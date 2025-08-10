"""
Enhanced Multi-Chatbot Platform API Function
"""

import json
import os
import sys
import traceback
from pathlib import Path

# CORS headers for all responses
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json"
}

def create_response(status_code, body, additional_headers=None):
    """Helper function to create properly formatted responses"""
    headers = CORS_HEADERS.copy()
    if additional_headers:
        headers.update(additional_headers)
    
    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json.dumps(body) if isinstance(body, (dict, list)) else str(body)
    }

def handler(event, context):
    """
    Main entry point for Netlify functions
    """
    try:
        # Enhanced logging for debugging
        print(f"=== NETLIFY FUNCTION DEBUG ===")
        print(f"Event: {json.dumps(event, default=str, indent=2)}")
        print(f"Context: {json.dumps(vars(context), default=str, indent=2)}")
        
        # Handle CORS preflight requests
        if event.get("httpMethod") == "OPTIONS":
            print("Handling CORS preflight request")
            return create_response(200, {"message": "CORS preflight successful"})
        
        # Extract request information
        path = event.get("path", "")
        method = event.get("httpMethod", "GET")
        raw_path = event.get("rawPath", path)
        
        print(f"Request - Method: {method}, Path: {path}, Raw Path: {raw_path}")
        
        # Parse request body
        body = {}
        if event.get("body"):
            try:
                if event.get("isBase64Encoded"):
                    import base64
                    decoded_body = base64.b64decode(event["body"]).decode('utf-8')
                    body = json.loads(decoded_body)
                else:
                    body = json.loads(event["body"])
                print(f"Parsed body: {body}")
            except (json.JSONDecodeError, Exception) as e:
                print(f"Body parsing error: {e}")
                body = {"raw": event.get("body", "")}
        
        # Route handling with comprehensive path matching
        route_handlers = {
            "medical": handle_medical_request,
            "education": handle_education_request,
            "general": handle_general_request,
            "mental_health": handle_medical_request,  # Route to medical
            "finance": handle_general_request,
            "legal": handle_general_request,
            "career": handle_general_request,
            "developer": handle_general_request,
            "entertainment": handle_general_request
        }
        
        # Determine route from path
        route = None
        for key in route_handlers.keys():
            if key in path.lower() or key in raw_path.lower():
                route = key
                break
        
        print(f"Detected route: {route}")
        
        if route and method == "POST":
            handler_func = route_handlers[route]
            return handler_func(body, event, context)
        
        # Health check endpoints
        elif method == "GET" or path.endswith("/api") or "health" in path.lower():
            return create_response(200, {
                "status": "✅ Multi-Chatbot Platform API Online!",
                "message": "All chatbot endpoints operational",
                "endpoints": list(route_handlers.keys()),
                "version": "1.0.0",
                "timestamp": context.aws_request_id if hasattr(context, 'aws_request_id') else "N/A",
                "debug": {
                    "path": path,
                    "raw_path": raw_path,
                    "method": method,
                    "detected_route": route
                }
            })
        
        else:
            return create_response(404, {
                "error": "Endpoint not found",
                "available_endpoints": list(route_handlers.keys()),
                "requested_path": path,
                "raw_path": raw_path,
                "method": method,
                "help": "POST to /api/{endpoint} with JSON body containing 'message' field"
            })
            
    except Exception as e:
        print(f"=== CRITICAL ERROR ===")
        print(f"Error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        
        return create_response(500, {
            "success": False,
            "error": "Internal server error", 
            "message": str(e),
            "traceback": traceback.format_exc() if os.getenv("DEBUG") else "Enable DEBUG for traceback"
        })

def handle_medical_request(body, event, context):
    """Handle medical chatbot requests"""
    message = body.get('message', 'No message provided')
    return create_response(200, {
        "response": f"🏥 **Medical AI Response**\n\nThank you for your medical question: *\"{message}\"*\n\nI'm here to provide general health information. Please note:\n\n- This is **not medical advice**\n- Always consult healthcare professionals\n- For emergencies, call emergency services\n\nHow else can I help with your health questions?",
        "status": "success",
        "type": "medical",
        "timestamp": str(context.aws_request_id) if hasattr(context, 'aws_request_id') else None
    })

def handle_education_request(body, event, context):
    """Handle education chatbot requests"""
    message = body.get('message', 'No message provided')
    return create_response(200, {
        "response": f"📚 **Education AI Response**\n\nGreat question: *\"{message}\"*\n\nI'm here to help you learn! Here are some key points:\n\n- **Learning is a journey** - take it step by step\n- **Practice makes perfect** - apply what you learn\n- **Stay curious** - ask more questions!\n\nWhat else would you like to explore together?",
        "status": "success", 
        "type": "education",
        "timestamp": str(context.aws_request_id) if hasattr(context, 'aws_request_id') else None
    })

def handle_general_request(body, event, context):
    """Handle general chatbot requests"""
    message = body.get('message', 'No message provided')
    return create_response(200, {
        "response": f"🤖 **General AI Response**\n\nHello! You said: *\"{message}\"*\n\nI'm here to help with:\n\n- **General questions** and conversations\n- **Problem-solving** assistance\n- **Information** and explanations\n- **Creative tasks** and brainstorming\n\nWhat would you like to discuss next?",
        "status": "success",
        "type": "general",
        "timestamp": str(context.aws_request_id) if hasattr(context, 'aws_request_id') else None
    })

# Alternative entry points for different naming conventions
main = handler  # Some systems expect 'main'
