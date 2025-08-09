from pydantic_settings import BaseSettings
from typing import List, Optional
import os
import logging

# Configure logging for serverless
if os.getenv('NETLIFY'):
    # Serverless logging configuration
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
else:
    # Local development logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('app.log') if os.path.exists('.') else logging.StreamHandler()
        ]
    )

class Settings(BaseSettings):
    # API Configuration
    app_name: str = "Multi-Chatbot Platform"
    app_version: str = "1.0.0"
    debug: bool = False  # Default to False for production
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # GROQ Configuration
    groq_api_key: str
    groq_model: str = "llama3-8b-8192"
    
    # LangChain Configuration
    max_tokens: int = 1000
    temperature: float = 0.7
    
    # Logging Configuration
    log_level: str = "INFO"
    
    # Environment Detection
    @property
    def is_netlify(self) -> bool:
        return os.getenv('NETLIFY') is not None
    
    @property
    def is_production(self) -> bool:
        return os.getenv('NODE_ENV') == 'production' or self.is_netlify
    
    # CORS Origins (computed based on environment)
    @property
    def allowed_origins(self) -> List[str]:
        """Get allowed origins based on environment"""
        if self.is_production:
            # Production origins
            return [
                "https://your-app-name.netlify.app",
                "https://*.netlify.app"  # Allow all Netlify preview deployments
            ]
        else:
            # Development origins
            return [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5173",  # Vite dev server alternative port
                "http://127.0.0.1:5173"
            ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create global settings instance
settings = Settings()

# Update logging level
logging.getLogger().setLevel(getattr(logging, settings.log_level.upper()))

# Validate GROQ API key
if not settings.groq_api_key:
    if not settings.is_netlify:  # Only raise error in non-Netlify environments during development
        raise ValueError("GROQ_API_KEY environment variable is required")
    else:
        logging.warning("GROQ_API_KEY not found in Netlify environment")
