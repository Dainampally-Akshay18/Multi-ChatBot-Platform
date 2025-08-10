"""
Enhanced Netlify function handler for Multi-Chatbot Platform
"""

import json
import os
import sys
from pathlib import Path

# Add the backend directory to Python path
current_dir = Path(__file__).parent
backend_dir = current_dir.parent
sys.path.insert(0, str(backend_dir))

# CORS headers for all responses
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
}

def create_response(status_code, body, additional_headers=None):
    """Helper function to create properly formatted responses"""
    headers = CORS_HEADERS.copy()
    if additional_headers:
        headers.update(additional_headers)
    
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body) if isinstance(body, (dict, list)) else body
    }

def handler(event, context):
    """
    Main entry point for Netlify functions (must be named 'handler')
    """
    try:
        # Handle CORS preflight requests
        if event.get("httpMethod") == "OPTIONS":
            return create_response(200, {"message": "CORS preflight successful"})
        
        # Get the path and method
        path = event.get("path", "")
        method = event.get("httpMethod", "GET")
        
        # Parse request body
        body = {}
        if event.get("body"):
            try:
                body = json.loads(event["body"])
            except json.JSONDecodeError:
                body = {"raw": event["body"]}
        
        # Route handling for your chatbots
        if "/api/medical" in path and method == "POST":
            return create_response(200, {
                "response": f"🏥 Medical AI: Thank you for your question: '{body.get('message', '')}'. I'm here to help with medical information.",
                "status": "success",
                "type": "medical"
            })
        
        elif "/api/education" in path and method == "POST":
            return create_response(200, {
                "response": f"📚 Education AI: You asked: '{body.get('message', '')}'. Let me help you learn!",
                "status": "success", 
                "type": "education"
            })
        
        elif "/api/general" in path and method == "POST":
            return create_response(200, {
                "response": f"🤖 General AI: Hello! You said: '{body.get('message', '')}'. How can I assist you?",
                "status": "success",
                "type": "general"
            })
        
        # Health check endpoint
        elif path.endswith("/api") or path == "/" or "health" in path:
            return create_response(200, {
                "status": "✅ Multi-Chatbot Platform Backend Online!",
                "message": "All chatbot endpoints operational",
                "endpoints": ["/api/medical", "/api/education", "/api/general"],
                "version": "1.0.0"
            })
        
        else:
            return create_response(404, {
                "error": "Endpoint not found",
                "available_endpoints": ["/api/medical", "/api/education", "/api/general"],
                "requested_path": path
            })
            
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        return create_response(500, {
            "success": False,
            "error": "Internal server error", 
            "message": str(e)
        })
