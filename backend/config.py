"""
Configuration settings for AI-Guardian
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_TITLE: str = "AI-Guardian"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./ai_guardian.db"
    # DATABASE_URL: str = "postgresql://user:password@localhost/ai_guardian"
    
    # External APIs
    WEATHER_API_KEY: Optional[str] = "demo_key"
    WEATHER_API_URL: str = "https://api.openweathermap.org/data/2.5"
    
    AIR_QUALITY_API_KEY: Optional[str] = "demo_key"
    AIR_QUALITY_API_URL: str = "https://api.waqi.info"
    
    # Alert Settings
    ALERT_WEBHOOK_URL: Optional[str] = None
    ALERT_EMAIL_ENABLED: bool = False
    ALERT_SMS_ENABLED: bool = False
    
    # Model Settings
    FLOOD_MODEL_THRESHOLD: float = 0.6
    FIRE_MODEL_THRESHOLD: float = 0.65
    POLLUTION_MODEL_THRESHOLD: float = 0.5
    
    # Simulation Settings
    SIMULATION_ENABLED: bool = True
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
