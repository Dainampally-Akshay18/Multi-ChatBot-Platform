"""
FastAPI main application
Multi-Chatbot Platform Backend
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from api.routes import chatbots
from config import settings
from utils.helpers import validate_environment, get_environment_info
import logging
import time
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Validate environment on startup
try:
    validate_environment()
    logger.info("Environment validation successful")
except Exception as e:
    logger.error(f"Environment validation failed: {e}")
    raise

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    # Multi-Chatbot Platform API
    
    A comprehensive chatbot platform with 8 specialized AI assistants:
    
    ## Available Chatbots
    
    * **Medical Assistant** 🏥 - Health information and medical advice
    * **Mental Health Support** 🧠 - Emotional wellness and mental health guidance  
    * **Education Tutor** 📚 - Learning assistance and academic help
    * **Financial Advisor** 💰 - Financial planning and money management
    * **Legal Assistant** ⚖️ - Legal information and guidance
    * **Career Coach** 💼 - Career advice and job search help
    * **Developer Helper** 💻 - Programming and development assistance
    * **Entertainment Guide** 🎮 - Movies, games, and entertainment recommendations
    
    ## Features
    
    * Individual endpoints for each chatbot type
    * Batch processing for multiple requests
    * Real-time health monitoring
    * Performance metrics and analytics
    * Comprehensive error handling
    * Request/response validation
    
    ## Getting Started
    
    1. Choose your desired chatbot endpoint
    2. Send a POST request with your message
    3. Receive AI-powered responses tailored to your needs
    
    **Note:** All responses are AI-generated and should not replace professional advice in medical, legal, or financial matters.
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    debug=settings.debug
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Add request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Custom exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors"""
    logger.warning(f"Request validation error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Request validation failed",
            "error_type": "validation_error",
            "details": exc.errors(),
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors"""
    logger.error(f"Unexpected error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal server error",
            "error_type": "internal_error",
            "timestamp": datetime.now().isoformat()
        }
    )

# Include routers
app.include_router(chatbots.router)

# Root endpoint
@app.get("/", summary="API Information")
async def root():
    """
    API Information Endpoint
    
    Returns basic information about the Multi-Chatbot Platform API.
    """
    env_info = get_environment_info()
    
    return {
        "message": "Welcome to the Multi-Chatbot Platform API!",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": env_info,
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "available_endpoints": {
            "chatbots": "/api/chatbots/",
            "health": "/api/chatbots/health",
            "metrics": "/api/chatbots/metrics",
            "types": "/api/chatbots/types"
        },
        "timestamp": datetime.now().isoformat()
    }

# Health check endpoint (simplified version)
@app.get("/health", summary="Quick Health Check")
async def quick_health_check():
    """
    Quick Health Check
    
    Simple endpoint to verify the API is running.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "app": settings.app_name,
        "version": settings.app_version
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Application startup tasks"""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"GROQ model: {settings.groq_model}")
    logger.info("Application startup complete")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown tasks"""
    logger.info("Shutting down Multi-Chatbot Platform")

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level="info"
    )

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Backend is reachable"}