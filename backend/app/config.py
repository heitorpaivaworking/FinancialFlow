from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_name: str = "FinanceFlow API"
    app_version: str = "1.0.0"
    debug: bool = False
    log_level: str = "INFO"

    database_url: str = "postgresql://financeflow:financeflow123@localhost:5432/financeflow"
    secret_key: str = "change-me"

    cors_origins: List[str] = ["http://localhost:5173", "http://localhost"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
