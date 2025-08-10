"""
Enhanced chatbot handlers with improved chain management
"""

from app.core.chains import create_enhanced_chatbot_chain, get_enhanced_chatbot_chain, EnhancedChatbotChain
from app.chatbots.prompt_templates import PromptTemplates
from typing import Dict, Any, List, Optional
import logging
import asyncio

logger = logging.getLogger(__name__)

class EnhancedChatbotManager:
    """Enhanced manager for all chatbot instances with better performance and monitoring"""
    
    def __init__(self):
        self.chatbots: Dict[str, EnhancedChatbotChain] = {}
        self._initialize_all_chatbots()
    
    def _initialize_all_chatbots(self):
        """Initialize all chatbot chains with their respective prompt templates"""
        chatbot_types = PromptTemplates.get_available_types()
        
        logger.info(f"Initializing {len(chatbot_types)} chatbots...")
        
        for chatbot_type in chatbot_types:
            try:
                prompt = PromptTemplates.get_prompt_by_type(chatbot_type)
                chain = create_enhanced_chatbot_chain(chatbot_type, prompt)
                self.chatbots[chatbot_type] = chain
                logger.info(f"✅ Initialized {chatbot_type} chatbot")
            except Exception as e:
                logger.error(f"❌ Failed to initialize {chatbot_type} chatbot: {str(e)}")
        
        logger.info(f"Successfully initialized {len(self.chatbots)}/{len(chatbot_types)} chatbots")
    
    def get_chatbot(self, chatbot_type: str) -> EnhancedChatbotChain:
        """Get a specific chatbot instance"""
        if chatbot_type not in self.chatbots:
            # Try to create it if it doesn't exist
            try:
                prompt = PromptTemplates.get_prompt_by_type(chatbot_type)
                chain = create_enhanced_chatbot_chain(chatbot_type, prompt)
                self.chatbots[chatbot_type] = chain
                logger.info(f"Created missing chatbot: {chatbot_type}")
            except Exception as e:
                logger.error(f"Failed to create chatbot {chatbot_type}: {str(e)}")
                raise ValueError(f"Chatbot type '{chatbot_type}' not available")
        
        return self.chatbots[chatbot_type]
    
    def get_available_chatbots(self) -> List[str]:
        """Get list of available chatbot types"""
        return list(self.chatbots.keys())
    
    async def chat(self, chatbot_type: str, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Send a message to a specific chatbot with optional context"""
        try:
            chatbot = self.get_chatbot(chatbot_type)
            response = await chatbot.invoke(user_input, context)
            return response
        except Exception as e:
            logger.error(f"Error in {chatbot_type} chat: {str(e)}")
            return {
                "success": False,
                "response": None,
                "chatbot_type": chatbot_type,
                "error": str(e),
                "validation": None,
                "duration": 0,
                "timestamp": None
            }
    
    def chat_sync(self, chatbot_type: str, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Synchronous version of chat"""
        try:
            chatbot = self.get_chatbot(chatbot_type)
            response = chatbot.invoke_sync(user_input, context)
            return response
        except Exception as e:
            logger.error(f"Error in {chatbot_type} chat: {str(e)}")
            return {
                "success": False,
                "response": None,
                "chatbot_type": chatbot_type,
                "error": str(e),
                "validation": None,
                "duration": 0,
                "timestamp": None
            }
    
    async def batch_chat(self, requests: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process multiple chat requests in parallel"""
        tasks = []
        
        for request in requests:
            chatbot_type = request.get("chatbot_type")
            user_input = request.get("user_input")
            context = request.get("context")
            
            if chatbot_type and user_input:
                task = self.chat(chatbot_type, user_input, context)
                tasks.append(task)
            else:
                # Create a failed task for invalid requests
                async def invalid_request():
                    return {
                        "success": False,
                        "error": "Missing chatbot_type or user_input",
                        "chatbot_type": chatbot_type or "unknown"
                    }
                tasks.append(invalid_request())
        
        if not tasks:
            return []
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results and handle exceptions
        processed_results = []
        for result in results:
            if isinstance(result, Exception):
                processed_results.append({
                    "success": False,
                    "error": str(result),
                    "chatbot_type": "unknown"
                })
            else:
                processed_results.append(result)
        
        return processed_results
    
    async def test_all_chatbots(self) -> Dict[str, bool]:
        """Test all chatbots with a simple message"""
        logger.info("Testing all chatbots...")
        
        test_requests = []
        for chatbot_type in self.chatbots.keys():
            test_requests.append({
                "chatbot_type": chatbot_type,
                "user_input": "Hello, this is a test message. Can you respond?"
            })
        
        results = await self.batch_chat(test_requests)
        
        test_results = {}
        for result in results:
            chatbot_type = result.get("chatbot_type", "unknown")
            success = result.get("success", False)
            test_results[chatbot_type] = success
            
            if success:
                logger.info(f"✅ {chatbot_type} test passed")
            else:
                logger.warning(f"⚠️ {chatbot_type} test failed: {result.get('error', 'Unknown error')}")
        
        return test_results
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for all chatbots"""
        metrics = {}
        for chatbot_type, chatbot in self.chatbots.items():
            metrics[chatbot_type] = chatbot.get_metrics()
        return metrics
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get overall health status of the chatbot system"""
        total_bots = len(self.chatbots)
        available_bots = len([bot for bot in self.chatbots.values() if bot is not None])
        
        return {
            "total_chatbots": total_bots,
            "available_chatbots": available_bots,
            "health_percentage": (available_bots / total_bots * 100) if total_bots > 0 else 0,
            "status": "healthy" if available_bots == total_bots else "degraded",
            "chatbot_types": list(self.chatbots.keys())
        }

# Global enhanced chatbot manager instance
enhanced_chatbot_manager = EnhancedChatbotManager()

# Convenience functions with enhanced features
def get_chatbot_response(chatbot_type: str, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get synchronous response from a chatbot with optional context"""
    return enhanced_chatbot_manager.chat_sync(chatbot_type, user_input, context)

async def get_chatbot_response_async(chatbot_type: str, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Get asynchronous response from a chatbot with optional context"""
    return await enhanced_chatbot_manager.chat(chatbot_type, user_input, context)

async def get_batch_chatbot_responses(requests: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Get responses from multiple chatbots in parallel"""
    return await enhanced_chatbot_manager.batch_chat(requests)

def get_available_chatbot_types() -> List[str]:
    """Get list of available chatbot types"""
    return enhanced_chatbot_manager.get_available_chatbots()

async def test_all_chatbots() -> Dict[str, bool]:
    """Test all chatbots asynchronously"""
    return await enhanced_chatbot_manager.test_all_chatbots()

def get_chatbot_metrics() -> Dict[str, Any]:
    """Get performance metrics for all chatbots"""
    return enhanced_chatbot_manager.get_all_metrics()

def get_system_health() -> Dict[str, Any]:
    """Get overall system health status"""
    return enhanced_chatbot_manager.get_health_status()

# Maintain backward compatibility
chatbot_manager = enhanced_chatbot_manager
