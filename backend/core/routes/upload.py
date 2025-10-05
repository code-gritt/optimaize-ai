import io
import zipfile
import re
from core.models.activity import Activity
import strawberry
from strawberry.types import Info
import httpx
import google.generativeai as genai
from fastapi import HTTPException
from sqlalchemy.orm import Session
from core.models.upload import Upload
from core.dependencies.db import get_db
from config.settings import settings
from core.types import ActivityType  # Reuse for consistency

genai.configure(api_key="AIzaSyDqxbID4YBbRnVrVMfvuAgRLAyrjG-hs48")


@strawberry.input
class UploadInput:
    url: str


@strawberry.type
class UploadResponse:
    success: bool
    analysis: str
    error: str | None
    activity: ActivityType | None  # Add activity field


@strawberry.type
class UploadMutation:
    @strawberry.mutation
    async def upload_url(self, info: Info, input: UploadInput) -> UploadResponse:
        db: Session = info.context["db"]
        request = info.context["request"]
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401, detail="Authorization required")

        token = auth_header.split(" ")[1]
        user_id = 1  # TODO: Replace with actual user_id from token validation

        try:
            code = ""
            url = input.url.strip()

            async with httpx.AsyncClient() as client:
                if re.match(r"https://github\.com/[^/]+/[^/]+/?$", url):
                    parts = url.rstrip("/").split("/")
                    username, repo = parts[-2], parts[-1]
                    zip_url = f"https://github.com/{username}/{repo}/archive/refs/heads/main.zip"
                    zip_resp = await client.get(zip_url)
                    if zip_resp.status_code != 200:
                        raise HTTPException(
                            status_code=400, detail="Could not download repo ZIP")

                    with zipfile.ZipFile(io.BytesIO(zip_resp.content)) as z:
                        py_files = [z.read(name).decode("utf-8", errors="ignore")
                                    for name in z.namelist() if name.endswith(".py")]
                        if not py_files:
                            raise HTTPException(
                                status_code=400, detail="No Python files found in repo")
                        code = "\n\n".join(py_files)
                else:
                    resp = await client.get(url)
                    if resp.status_code != 200:
                        raise HTTPException(
                            status_code=400, detail="Invalid or inaccessible URL")
                    code = resp.text

            model = genai.GenerativeModel("gemini-2.5-flash-lite")
            prompt = f"Analyze this code for bugs, suggestions, and optimizations:\n\n{code[:50000]}"
            gemini_resp = model.generate_content(prompt)
            analysis = gemini_resp.text or "No analysis generated."

            upload = Upload(user_id=user_id, url=url, analysis=analysis)
            db.add(upload)
            db.commit()
            db.refresh(upload)

            # Create a corresponding activity for the dashboard
            activity = Activity(
                user_id=user_id, activity_type="upload_repo", details=url)
            db.add(activity)
            db.commit()
            db.refresh(activity)

            return UploadResponse(
                success=True,
                analysis=analysis,
                error=None,
                activity=ActivityType.from_orm(activity)
            )

        except Exception as e:
            return UploadResponse(success=False, analysis="", error=str(e), activity=None)
