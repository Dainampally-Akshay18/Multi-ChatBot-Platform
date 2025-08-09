#!/usr/bin/env python3
"""
Development server runner
"""

import uvicorn
from app.main import app
from app.config import settings

if __name__ == "__main__":
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"Server will be available at: http://{settings.api_host}:{settings.api_port}")
    print(f"API documentation: http://{settings.api_host}:{settings.api_port}/docs")
    print(f"Debug mode: {settings.debug}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level="info" if settings.debug else "warning"
    )
