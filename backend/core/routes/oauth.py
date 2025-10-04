from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from core.models.user import User, UserRole
from core.dependencies.db import get_db
from core.schemas.user import UserResponse
from jose import jwt
from dotenv import load_dotenv
import os
import requests
from datetime import datetime, timedelta

router = APIRouter()

load_dotenv()
GOOGLE_CLIENT_ID = "518989484475-r0rtrsoehtt8ig079dkl7ce2mio9jj64.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
REDIRECT_URI = os.getenv("REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL")
SECRET_KEY = "cbc939eedd96ed9e6b5e0c60712dc29cf9d4eacbde45d0c0b0066e87b51bde7d"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


@router.get("/google")
async def google_login():
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=email profile"
        f"&access_type=offline"
    )
    return RedirectResponse(url=google_auth_url)


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    # Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    token_response = requests.post(token_url, data=token_data)
    if token_response.status_code != 200:
        raise HTTPException(
            status_code=400, detail="Failed to exchange code for token")

    token_json = token_response.json()
    access_token = token_json.get("access_token")

    # Fetch user info
    user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    user_info_response = requests.get(
        user_info_url, headers={"Authorization": f"Bearer {access_token}"})
    if user_info_response.status_code != 200:
        raise HTTPException(
            status_code=400, detail="Failed to fetch user info")

    user_info = user_info_response.json()
    email = user_info.get("email")
    if not email:
        raise HTTPException(
            status_code=400, detail="Email not provided by Google")

    # Check if user exists, create if not
    user = get_user_by_email(db, email)
    if not user:
        user = User(
            email=email,
            # Placeholder, as no password is needed
            hashed_password="google_oauth_no_password",
            role=UserRole.USER,
            credits=100
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate JWT
    token = create_access_token(
        data={"sub": user.email, "role": user.role.value})

    # Redirect to frontend with token
    redirect_url = f"{FRONTEND_URL}/dashboard?token={token}"
    return RedirectResponse(url=redirect_url)
