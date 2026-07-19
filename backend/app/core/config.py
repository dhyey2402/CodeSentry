"""
core/config.py

This file is responsible for loading and validating environment variables.
Using Pydantic Settings ensures that our application crashes early if a required
environment variable is missing, rather than failing randomly during runtime.

Why it is needed:
1. Centralized configuration management.
2. Type validation for environment variables (e.g., ensuring port is an int).
3. Easy access to configuration anywhere in the app.
"""

from typing import Any, Dict, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Code Review Assistant"
    API_V1_STR: str = "/api/v1"

    # API Keys
    MISTRAL_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    AI_BASE_URL: str = "https://api.mistral.ai/v1"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: Optional[str] = None
    POSTGRES_SERVER: Optional[str] = None
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    POSTGRES_PORT: Optional[str] = "5432"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        """
        Constructs the SQLAlchemy database URI from components or uses DATABASE_URL.
        """
        if self.DATABASE_URL:
            # Convert standard postgresql:// prefix to use psycopg driver if necessary
            return self.DATABASE_URL.replace("postgresql://", "postgresql+psycopg://")
            
        import urllib.parse
        encoded_password = urllib.parse.quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql+psycopg://{self.POSTGRES_USER}:{encoded_password}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Load from .env file
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
