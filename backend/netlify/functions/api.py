"""
Main Netlify function handler for Multi-Chatbot Platform
Handles all API routes through a single serverless function
"""

import json
import os
import sys
from pathlib import Path

# Add the app directory to Python path
current_dir = Path(__file__).parent
app_dir = current_dir.parent.parent / "app"
sys.path.insert(0, str(app_dir))

try:
    from app.main import app
    from mangum import Mangum
    
    # Create Mangum handler for serverless deployment
    handler = Mangum(app, lifespan="off")
    
    def main(event, context):
        """
        Main entry point for Netlify functions
        """
        try:
            # Process the request through FastAPI
            response = handler(event, context)
            return response
        except Exception as e:
            print(f"Error in main handler: {str(e)}")
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization"
                },
                "body": json.dumps({
                    "success": False,
                    "error": "Internal server error",
                    "message": str(e)
                })
            }

except ImportError as e:
    print(f"Import error: {e}")
    
    def main(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": "Failed to import application",
                "details": str(e)
            })
        }
