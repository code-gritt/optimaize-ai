import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Optimaize Backend"
    VERSION: str = "1.0"
    API_KEY: str = os.getenv(
        "API_KEY", "f48e30b49ba143c7cfa99c8d03b5b380aeaaa777bbbb804ae45ad6da84af77b0")
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "cbc939eedd96ed9e6b5e0c60712dc29cf9d4eacbde45d0c0b0066e87b51bde7d")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv(
        "CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv(
        "CELERY_RESULT_BACKEND", "redis://localhost:6379/0")


settings = Settings()
