import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Optimaize Backend"
    VERSION: str = "1.0"


settings = Settings()
