from fastapi import HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta
import strawberry
from strawberry.types import Info
from typing import Optional
from enum import Enum

from core.models.user import User, UserRole
from core.dependencies.db import get_db

# ----------------- Config -----------------
SECRET_KEY = "cbc939eedd96ed9e6b5e0c60712dc29cf9d4eacbde45d0c0b0066e87b51bde7d"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ----------------- Utility Functions -----------------


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


# ----------------- Strawberry Enum -----------------
@strawberry.enum
class UserRoleEnum(Enum):
    USER = UserRole.USER.value
    ADMIN = UserRole.ADMIN.value


# ----------------- Strawberry Types -----------------
@strawberry.type
class UserType:
    id: int
    email: str
    role: UserRoleEnum
    credits: int


@strawberry.type
class AuthPayload:
    token: str
    user: UserType


# ----------------- Mutations -----------------
@strawberry.type
class Mutation:
    @strawberry.mutation
    def register(self, email: str, password: str, info: Info) -> UserType:
        db: Session = info.context["db"]

        if get_user_by_email(db, email):
            raise HTTPException(
                status_code=400, detail="Email already registered")

        # Store password as plain text (not recommended for production)
        user = User(email=email, hashed_password=password,
                    role=UserRole.USER, credits=100)
        db.add(user)
        db.commit()
        db.refresh(user)

        return UserType(
            id=user.id,
            email=user.email,
            role=UserRoleEnum(user.role.value),
            credits=user.credits,
        )

    @strawberry.mutation
    def login(self, email: str, password: str, info: Info) -> AuthPayload:
        db: Session = info.context["db"]
        user = get_user_by_email(db, email)

        # Plain text comparison
        if not user or user.hashed_password != password:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token(
            data={"sub": user.email, "role": user.role.value})

        return AuthPayload(
            token=token,
            user=UserType(
                id=user.id,
                email=user.email,
                role=UserRoleEnum(user.role.value),
                credits=user.credits,
            ),
        )


# ----------------- Queries -----------------
@strawberry.type
class Query:
    @strawberry.field
    def me(self, info: Info) -> Optional[UserType]:
        db: Session = info.context["db"]
        request = info.context["request"]
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization header missing or invalid"
            )

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            user = get_user_by_email(db, email)

            if not user:
                raise HTTPException(status_code=401, detail="User not found")

            return UserType(
                id=user.id,
                email=user.email,
                role=UserRoleEnum(user.role.value),
                credits=user.credits,
            )

        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
