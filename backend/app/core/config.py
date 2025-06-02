from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:natiss_natiss@localhost/astrobsm_oracle"
    SECRET_KEY: str = "your_secret_key"  # Change this to a strong secret key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_ORIGINS: List[str] = ["*"]  # Correct field name for allowed origins
    allow_methods: List[str] = Field(
        default=["*"],
        env="ALLOW_METHODS",
        description="List of HTTP methods allowed for CORS"
    )
    allow_headers: List[str] = Field(
        default=["*"],
        env="ALLOW_HEADERS",
        description="List of HTTP headers allowed for CORS"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "forbid"  # Enforce known fields to prevent typos

settings = Settings()