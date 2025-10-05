from enum import Enum
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta
from core.dependencies.db import get_db
from core.models.user import User
from sqlalchemy.orm import Session
from config.settings import settings


class UserRole(Enum):
    USER = "user"
    ADMIN = "admin"


# API Key Authentication
security = HTTPBearer()


def api_key_auth(api_key: HTTPAuthorizationCredentials = Depends(security)):
    if api_key.credentials != settings.API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

# JWT Token Validation


def get_current_user(token: str = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token.credentials, settings.SECRET_KEY, algorithms=[
                             settings.ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# RBAC Check (to be used in context)


def check_role(required_role: UserRole, user: User):
    if user.role != required_role.value:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return user
