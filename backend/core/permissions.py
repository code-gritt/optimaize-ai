from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from core.models.user import User, UserRole
from core.dependencies.db import get_db
from config.settings import settings

security = HTTPBearer()


def validate_api_key(api_key: HTTPAuthorizationCredentials):
    if api_key.credentials != settings.API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return True


def get_current_user_from_token(request: Request, db: Session):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing or invalid Authorization header")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_role(user: User, role: UserRole):
    if user.role != role:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
