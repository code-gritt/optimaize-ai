import strawberry
from strawberry.types import Info
from typing import Optional
import httpx
import google.generativeai as genai
from fastapi import HTTPException
from sqlalchemy.orm import Session
from core.models.upload import Upload
from core.dependencies.db import get_db
# Reusing existing ActivityType for consistency
from core.types import ActivityType
from config.settings import settings  # Assuming settings is still accessible

genai.configure(api_key="AIzaSyDqxbID4YBbRnVrVMfvuAgRLAyrjG-hs48")


@strawberry.input
class UploadInput:
    url: str


@strawberry.type
class UploadResponse:
    success: bool
    analysis: str
    error: str | None


@strawberry.type
class UploadMutation:
    @strawberry.mutation
    async def upload_url(self, info, input: UploadInput) -> UploadResponse:
        db: Session = info.context["db"]
        request = info.context["request"]
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization required")

        # Simplified auth check (assuming token validation is handled elsewhere)
        token = auth_header.split(" ")[1]
        # Placeholder: In a real scenario, validate token and get user_id
        user_id = 1  # Replace with actual user_id from token validation

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(input.url)
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=400, detail="Invalid URL or inaccessible content")
                code = response.text

            model = genai.GenerativeModel("gemini-pro")
            prompt = f"Analyze this code for bugs, suggestions, and optimizations:\n\n{code}"
            gemini_response = model.generate_content(prompt)
            analysis = gemini_response.text

            upload = Upload(user_id=user_id, url=input.url, analysis=analysis)
            db.add(upload)
            db.commit()
            db.refresh(upload)

            return UploadResponse(success=True, analysis=analysis, error=None)
        except Exception as e:
            return UploadResponse(success=False, analysis="", error=str(e))
