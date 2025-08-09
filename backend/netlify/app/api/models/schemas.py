"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime

class ChatRequest(BaseModel):
    """Request model for chatbot interactions"""
    message: str = Field(
        ..., 
        min_length=1, 
        max_length=2000,
        description="User message to send to the chatbot",
        example="Hello, I have a question about my health."
    )
    context: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional context for the conversation",
        example={"user_id": "12345", "session_id": "abc123"}
    )
    
    @validator('message')
    def validate_message(cls, v):
        """Validate message content"""
        if not v.strip():
            raise ValueError('Message cannot be empty or whitespace only')
        return v.strip()

class ChatResponse(BaseModel):
    """Response model for chatbot interactions"""
    success: bool = Field(..., description="Whether the request was successful")
    response: Optional[str] = Field(None, description="Chatbot response message")
    chatbot_type: str = Field(..., description="Type of chatbot that processed the request")
    error: Optional[str] = Field(None, description="Error message if request failed")
    duration: float = Field(..., description="Processing time in seconds")
    timestamp: str = Field(..., description="Response timestamp")
    validation: Optional[Dict[str, Any]] = Field(None, description="Response validation details")

class BatchChatRequest(BaseModel):
    """Request model for batch chatbot interactions"""
    requests: List[Dict[str, Any]] = Field(
        ...,
        min_items=1,
        max_items=10,
        description="List of chat requests",
        example=[
            {"chatbot_type": "medical", "user_input": "What should I do for a headache?"},
            {"chatbot_type": "finance", "user_input": "How to start investing?"}
        ]
    )

class BatchChatResponse(BaseModel):
    """Response model for batch chatbot interactions"""
    responses: List[ChatResponse] = Field(..., description="List of chatbot responses")
    total_requests: int = Field(..., description="Total number of requests processed")
    successful_requests: int = Field(..., description="Number of successful requests")
    total_duration: float = Field(..., description="Total processing time in seconds")

class HealthCheckResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Overall system status")
    chatbots: Dict[str, str] = Field(..., description="Status of individual chatbots")
    total_chatbots: int = Field(..., description="Total number of chatbots")
    healthy_chatbots: int = Field(..., description="Number of healthy chatbots")
    uptime: str = Field(..., description="System uptime")
    timestamp: str = Field(..., description="Health check timestamp")

class MetricsResponse(BaseModel):
    """Metrics response model"""
    chatbot_metrics: Dict[str, Dict[str, Any]] = Field(..., description="Performance metrics for each chatbot")
    system_health: Dict[str, Any] = Field(..., description="Overall system health metrics")

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = Field(default=False, description="Always false for error responses")
    error: str = Field(..., description="Error message")
    error_type: str = Field(..., description="Type of error")
    timestamp: str = Field(..., description="Error timestamp")
    request_id: Optional[str] = Field(None, description="Request ID for tracking")
