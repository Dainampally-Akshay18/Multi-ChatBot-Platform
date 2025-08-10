import json

def handler(event, context):
    """Minimal working Netlify Function for all chatbot endpoints"""
    
    # CORS headers
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    }
    
    # Handle OPTIONS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"message": "CORS OK"})
        }
    
    try:
        path = event.get("path", "")
        method = event.get("httpMethod", "GET")
        
        # Parse body
        body = {}
        if event.get("body"):
            try:
                body = json.loads(event["body"])
            except:
                body = {"message": "No message"}
        
        message = body.get("message", "Hello")
        
        # Route to appropriate chatbot based on path
        if "medical" in path.lower():
            response_text = f"🏥 Medical AI: Thank you for your question: '{message}'. I'm here to help with medical information."
        elif "mental-health" in path.lower():
            response_text = f"🧠 Mental Health AI: I understand you said: '{message}'. Mental health is important - how can I support you?"
        elif "education" in path.lower():
            response_text = f"📚 Education AI: Great question: '{message}'. Let me help you learn!"
        elif "finance" in path.lower():
            response_text = f"💰 Finance AI: About '{message}' - I can help you with financial advice."
        elif "legal" in path.lower():
            response_text = f"⚖️ Legal AI: Regarding '{message}' - I can provide legal information."
        elif "career" in path.lower():
            response_text = f"💼 Career AI: About '{message}' - Let me help with your career development."
        elif "developer" in path.lower():
            response_text = f"💻 Developer AI: You asked: '{message}'. Let me help you with coding!"
        elif "entertainment" in path.lower():
            response_text = f"🎮 Entertainment AI: About '{message}' - Let me suggest something fun!"
        else:
            response_text = f"🤖 General AI: Hello! You said: '{message}'. How can I assist you?"
        
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "response": response_text,
                "status": "success",
                "debug": {
                    "path": path,
                    "method": method,
                    "message_received": message
                }
            })
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({
                "error": str(e),
                "message": "Function error occurred"
            })
        }
