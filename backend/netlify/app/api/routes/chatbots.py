"""
FastAPI routes for all chatbot endpoints
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from app.api.models.schemas import (
    ChatRequest, 
    ChatResponse, 
    BatchChatRequest, 
    BatchChatResponse,
    HealthCheckResponse,
    MetricsResponse,
    ErrorResponse
)
from app.chatbots import (
    get_chatbot_response,
    get_chatbot_response_async,
    get_batch_chatbot_responses,
    get_available_chatbot_types,
    test_all_chatbots,
    get_chatbot_metrics,
    get_system_health
)
from typing import Dict, Any
import logging
import time
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/chatbots", tags=["Chatbots"])

# Track system start time for uptime calculation
SYSTEM_START_TIME = datetime.now()

def format_chatbot_response(response_data: Dict[str, Any]) -> ChatResponse:
    """Convert internal response format to API response format"""
    return ChatResponse(
        success=response_data.get("success", False),
        response=response_data.get("response"),
        chatbot_type=response_data.get("chatbot_type", "unknown"),
        error=response_data.get("error"),
        duration=response_data.get("duration", 0.0),
        timestamp=response_data.get("timestamp", datetime.now().isoformat()),
        validation=response_data.get("validation")
    )

async def handle_chatbot_request(chatbot_type: str, request: ChatRequest) -> ChatResponse:
    """Handle individual chatbot requests with error handling"""
    try:
        # Log the request
        logger.info(f"Processing {chatbot_type} request: {request.message[:50]}...")
        
        # Get response from chatbot
        response_data = await get_chatbot_response_async(
            chatbot_type, 
            request.message, 
            request.context
        )
        
        # Format and return response
        return format_chatbot_response(response_data)
        
    except Exception as e:
        logger.error(f"Error processing {chatbot_type} request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error while processing {chatbot_type} request"
        )

# Individual chatbot endpoints
@router.post("/medical", response_model=ChatResponse, summary="Medical Assistant")
async def medical_chat(request: ChatRequest):
    """
    Medical Assistant Chatbot
    
    Get medical information and health advice from our specialized medical assistant.
    **Note:** This is for informational purposes only and not a substitute for professional medical advice.
    """
    return await handle_chatbot_request("medical", request)

@router.post("/mental-health", response_model=ChatResponse, summary="Mental Health Support")
async def mental_health_chat(request: ChatRequest):
    """
    Mental Health Support Chatbot
    
    Get emotional support and mental wellness guidance from our specialized mental health assistant.
    """
    return await handle_chatbot_request("mental_health", request)

@router.post("/education", response_model=ChatResponse, summary="Education Tutor")
async def education_chat(request: ChatRequest):
    """
    Education Tutor Chatbot
    
    Get learning assistance and academic help across various subjects from our educational tutor.
    """
    return await handle_chatbot_request("education", request)

@router.post("/finance", response_model=ChatResponse, summary="Financial Advisor")
async def finance_chat(request: ChatRequest):
    """
    Financial Advisor Chatbot
    
    Get financial planning advice and money management tips from our financial expert.
    """
    return await handle_chatbot_request("finance", request)

@router.post("/legal", response_model=ChatResponse, summary="Legal Assistant")
async def legal_chat(request: ChatRequest):
    """
    Legal Assistant Chatbot
    
    Get legal information and guidance from our legal information specialist.
    **Note:** This provides legal information, not legal advice. Consult a qualified attorney for specific legal matters.
    """
    return await handle_chatbot_request("legal", request)

@router.post("/career", response_model=ChatResponse, summary="Career Coach")
async def career_chat(request: ChatRequest):
    """
    Career Coach Chatbot
    
    Get career advice, job search help, and professional development guidance from our career expert.
    """
    return await handle_chatbot_request("career", request)

@router.post("/developer", response_model=ChatResponse, summary="Developer Helper")
async def developer_chat(request: ChatRequest):
    """
    Developer Helper Chatbot
    
    Get programming assistance, code help, and development guidance from our technical expert.
    """
    return await handle_chatbot_request("developer", request)

@router.post("/entertainment", response_model=ChatResponse, summary="Entertainment Guide")
async def entertainment_chat(request: ChatRequest):
    """
    Entertainment Guide Chatbot
    
    Get movie, TV, game, and entertainment recommendations from our entertainment specialist.
    """
    return await handle_chatbot_request("entertainment", request)

# Batch processing endpoint
@router.post("/batch", response_model=BatchChatResponse, summary="Batch Chat Processing")
async def batch_chat(request: BatchChatRequest):
    """
    Process Multiple Chat Requests in Parallel
    
    Send multiple requests to different chatbots simultaneously for improved efficiency.
    Maximum 10 requests per batch.
    """
    try:
        start_time = time.time()
        
        # Process batch requests
        responses = await get_batch_chatbot_responses(request.requests)
        
        # Format responses
        formatted_responses = [format_chatbot_response(resp) for resp in responses]
        
        # Calculate metrics
        total_duration = time.time() - start_time
        successful_count = sum(1 for resp in formatted_responses if resp.success)
        
        return BatchChatResponse(
            responses=formatted_responses,
            total_requests=len(formatted_responses),
            successful_requests=successful_count,
            total_duration=total_duration
        )
        
    except Exception as e:
        logger.error(f"Error processing batch request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error while processing batch request"
        )

# System endpoints
@router.get("/health", response_model=HealthCheckResponse, summary="Health Check")
async def health_check():
    """
    System Health Check
    
    Get the current health status of all chatbots and system components.
    """
    try:
        # Get system health
        health_data = get_system_health()
        
        # Test all chatbots
        test_results = await test_all_chatbots()
        
        # Calculate uptime
        uptime_delta = datetime.now() - SYSTEM_START_TIME
        uptime_str = f"{uptime_delta.days}d {uptime_delta.seconds//3600}h {(uptime_delta.seconds//60)%60}m"
        
        # Format chatbot statuses
        chatbot_statuses = {
            chatbot_type: "healthy" if status else "unhealthy"
            for chatbot_type, status in test_results.items()
        }
        
        return HealthCheckResponse(
            status=health_data["status"],
            chatbots=chatbot_statuses,
            total_chatbots=health_data["total_chatbots"],
            healthy_chatbots=sum(test_results.values()),
            uptime=uptime_str,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in health check: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error performing health check"
        )

@router.get("/metrics", response_model=MetricsResponse, summary="System Metrics")
async def get_metrics():
    """
    Get System Performance Metrics
    
    Retrieve detailed performance metrics for all chatbots and overall system health.
    """
    try:
        chatbot_metrics = get_chatbot_metrics()
        system_health = get_system_health()
        
        return MetricsResponse(
            chatbot_metrics=chatbot_metrics,
            system_health=system_health
        )
        
    except Exception as e:
        logger.error(f"Error getting metrics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving system metrics"
        )

@router.get("/types", summary="Available Chatbot Types")
async def get_chatbot_types():
    """
    Get Available Chatbot Types
    
    Returns a list of all available chatbot types and their descriptions.
    """
    try:
        types = get_available_chatbot_types()
        
        # Add descriptions for each type
        type_descriptions = {
            'medical': 'Medical information and health advice',
            'mental_health': 'Mental wellness and emotional support',
            'education': 'Learning assistance and academic help',
            'finance': 'Financial planning and money management',
            'legal': 'Legal information and guidance',
            'career': 'Career advice and job search help',
            'developer': 'Programming and development assistance',
            'entertainment': 'Movies, games, and entertainment recommendations'
        }
        
        return {
            "available_types": types,
            "descriptions": {t: type_descriptions.get(t, "No description available") for t in types},
            "total_count": len(types)
        }
        
    except Exception as e:
        logger.error(f"Error getting chatbot types: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving chatbot types"
        )
