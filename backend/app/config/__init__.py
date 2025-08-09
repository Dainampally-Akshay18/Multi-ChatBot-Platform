from .settings import settings

__all__ = ["settings"]

# Environment-specific configurations
def get_database_url():
    """Future-proof for when you might add database"""
    if settings.debug:
        return "sqlite:///./dev.db"
    else:
        return "postgresql://production_db_url"

def get_log_level():
    """Configure logging based on environment"""
    return "DEBUG" if settings.debug else "INFO"

def is_development():
    """Check if running in development mode"""
    return settings.debug

def is_production():
    """Check if running in production mode"""
    return not settings.debug
