from langchain.schema import HumanMessage, SystemMessage, BaseMessage
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain.schema.output_parser import StrOutputParser
from langchain_core.callbacks import AsyncCallbackHandler  # ✅ Updated import
from core.llm import get_llm
from typing import Dict, Any, List, Optional, Callable
import logging
import time
import asyncio
from datetime import datetime


logger = logging.getLogger(__name__)

class ChatbotResponseValidator:
    """Validates and formats chatbot responses"""
    
    @staticmethod
    def validate_response(response: str, chatbot_type: str) -> Dict[str, Any]:
        """Validate response quality and format"""
        validation_result = {
            "is_valid": True,
            "issues": [],
            "formatted_response": response.strip()
        }
        
        # Basic validation checks
        if not response or not response.strip():
            validation_result["is_valid"] = False
            validation_result["issues"].append("Empty response")
            return validation_result
        
        # Length validation
        if len(response.strip()) < 10:
            validation_result["issues"].append("Response too short")
        
        if len(response.strip()) > 2000:
            validation_result["issues"].append("Response too long")
            # Truncate response
            validation_result["formatted_response"] = response[:1900] + "... [Response truncated for length]"
        
        # Content validation based on chatbot type
        sensitive_types = ['medical', 'mental_health', 'legal']
        if chatbot_type in sensitive_types:
            if "I am not a" not in response and "consult a professional" not in response.lower():
                validation_result["issues"].append("Missing professional consultation disclaimer")
        
        return validation_result

class ChatbotChainMetrics:
    """Tracks metrics for chatbot chains"""
    
    def __init__(self):
        self.metrics = {}
    
    def record_invocation(self, chatbot_type: str, duration: float, success: bool):
        """Record chain invocation metrics"""
        if chatbot_type not in self.metrics:
            self.metrics[chatbot_type] = {
                "total_invocations": 0,
                "successful_invocations": 0,
                "total_duration": 0.0,
                "average_duration": 0.0,
                "last_invocation": None
            }
        
        self.metrics[chatbot_type]["total_invocations"] += 1
        self.metrics[chatbot_type]["total_duration"] += duration
        self.metrics[chatbot_type]["last_invocation"] = datetime.now()
        
        if success:
            self.metrics[chatbot_type]["successful_invocations"] += 1
        
        # Update average
        self.metrics[chatbot_type]["average_duration"] = (
            self.metrics[chatbot_type]["total_duration"] / 
            self.metrics[chatbot_type]["total_invocations"]
        )
    
    def get_metrics(self, chatbot_type: Optional[str] = None) -> Dict[str, Any]:
        """Get metrics for a specific chatbot or all chatbots"""
        if chatbot_type:
            return self.metrics.get(chatbot_type, {})
        return self.metrics.copy()

class EnhancedChatbotChain:
    """Enhanced chatbot chain with validation, metrics, and error handling"""
    
    def __init__(self, system_prompt: str, chatbot_type: str):
        self.system_prompt = system_prompt
        self.chatbot_type = chatbot_type
        self.llm = get_llm()
        self.output_parser = StrOutputParser()
        self.validator = ChatbotResponseValidator()
        self.metrics = ChatbotChainMetrics()
        self._build_chain()
    
    def _build_chain(self):
        """Build the enhanced LangChain chain with middleware"""
        
        def create_messages(inputs: Dict[str, Any]) -> List[BaseMessage]:
            """Create message list from inputs"""
            return [
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=inputs["user_input"])
            ]
        
        def format_response(response: str) -> str:
            """Format and clean the response"""
            # Remove extra whitespace and newlines
            cleaned = response.strip()
            
            # Ensure proper sentence endings
            if cleaned and not cleaned.endswith(('.', '!', '?')):
                cleaned += '.'
            
            return cleaned
        
        # Build the chain with middleware
        self.chain = (
            RunnablePassthrough.assign(messages=RunnableLambda(create_messages))
            | RunnableLambda(lambda x: self.llm.invoke(x["messages"]))
            | self.output_parser
            | RunnableLambda(format_response)
        )
    
    async def invoke(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Async invocation with full error handling and validation"""
        start_time = time.time()
        
        try:
            # Prepare input
            chain_input = {"user_input": user_input}
            if context:
                chain_input.update(context)
            
            # Invoke the chain
            response = await self.chain.ainvoke(chain_input)
            
            # Validate response
            validation = self.validator.validate_response(response, self.chatbot_type)
            
            # Calculate duration
            duration = time.time() - start_time
            
            # Record metrics
            self.metrics.record_invocation(self.chatbot_type, duration, True)
            
            return {
                "success": True,
                "response": validation["formatted_response"],
                "chatbot_type": self.chatbot_type,
                "error": None,
                "validation": validation,
                "duration": duration,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            duration = time.time() - start_time
            self.metrics.record_invocation(self.chatbot_type, duration, False)
            
            logger.error(f"Error in {self.chatbot_type} chain: {str(e)}")
            return {
                "success": False,
                "response": None,
                "chatbot_type": self.chatbot_type,
                "error": str(e),
                "validation": None,
                "duration": duration,
                "timestamp": datetime.now().isoformat()
            }
    
    def invoke_sync(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Synchronous version of invoke"""
        start_time = time.time()
        
        try:
            # Prepare input
            chain_input = {"user_input": user_input}
            if context:
                chain_input.update(context)
            
            # Invoke the chain
            response = self.chain.invoke(chain_input)
            
            # Validate response
            validation = self.validator.validate_response(response, self.chatbot_type)
            
            # Calculate duration
            duration = time.time() - start_time
            
            # Record metrics
            self.metrics.record_invocation(self.chatbot_type, duration, True)
            
            return {
                "success": True,
                "response": validation["formatted_response"],
                "chatbot_type": self.chatbot_type,
                "error": None,
                "validation": validation,
                "duration": duration,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            duration = time.time() - start_time
            self.metrics.record_invocation(self.chatbot_type, duration, False)
            
            logger.error(f"Error in {self.chatbot_type} chain: {str(e)}")
            return {
                "success": False,
                "response": None,
                "chatbot_type": self.chatbot_type,
                "error": str(e),
                "validation": None,
                "duration": duration,
                "timestamp": datetime.now().isoformat()
            }
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get chain performance metrics"""
        return self.metrics.get_metrics(self.chatbot_type)

class EnhancedChainFactory:
    """Enhanced factory for creating and managing chatbot chains"""
    
    def __init__(self):
        self.chains: Dict[str, EnhancedChatbotChain] = {}
        self.llm = get_llm()
        self.global_metrics = ChatbotChainMetrics()
    
    def create_chain(self, chatbot_type: str, system_prompt: str) -> EnhancedChatbotChain:
        """Create a new enhanced chatbot chain"""
        if chatbot_type in self.chains:
            logger.info(f"Returning existing chain for {chatbot_type}")
            return self.chains[chatbot_type]
        
        logger.info(f"Creating new enhanced chain for {chatbot_type}")
        chain = EnhancedChatbotChain(system_prompt, chatbot_type)
        self.chains[chatbot_type] = chain
        return chain
    
    def get_chain(self, chatbot_type: str) -> EnhancedChatbotChain:
        """Get existing chain or raise error"""
        if chatbot_type not in self.chains:
            raise ValueError(f"Chain for {chatbot_type} not found. Create it first.")
        return self.chains[chatbot_type]
    
    def get_all_chains(self) -> Dict[str, EnhancedChatbotChain]:
        """Get all created chains"""
        return self.chains.copy()
    
    def remove_chain(self, chatbot_type: str) -> bool:
        """Remove a chain"""
        if chatbot_type in self.chains:
            del self.chains[chatbot_type]
            logger.info(f"Removed chain for {chatbot_type}")
            return True
        return False
    
    async def batch_invoke(self, requests: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process multiple requests in parallel"""
        tasks = []
        
        for request in requests:
            chatbot_type = request.get("chatbot_type")
            user_input = request.get("user_input")
            context = request.get("context")
            
            if chatbot_type and user_input:
                try:
                    chain = self.get_chain(chatbot_type)
                    task = chain.invoke(user_input, context)
                    tasks.append(task)
                except Exception as e:
                    # Add error response for invalid requests
                    tasks.append(asyncio.create_task(asyncio.coroutine(lambda: {
                        "success": False,
                        "error": f"Invalid request: {str(e)}",
                        "chatbot_type": chatbot_type
                    })()))
        
        if not tasks:
            return []
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Convert exceptions to error responses
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
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Get metrics for all chains"""
        all_metrics = {}
        for chatbot_type, chain in self.chains.items():
            all_metrics[chatbot_type] = chain.get_metrics()
        return all_metrics
    
    async def test_all_chains(self) -> Dict[str, bool]:
        """Test all chains with a simple message"""
        test_message = "Hello, can you help me with a quick test?"
        
        # Prepare batch request
        requests = []
        for chatbot_type in self.chains.keys():
            requests.append({
                "chatbot_type": chatbot_type,
                "user_input": test_message
            })
        
        # Execute batch test
        results = await self.batch_invoke(requests)
        
        # Process results
        test_results = {}
        for result in results:
            chatbot_type = result.get("chatbot_type", "unknown")
            success = result.get("success", False)
            test_results[chatbot_type] = success
            
            if success:
                logger.info(f"✅ {chatbot_type} chain test passed")
            else:
                logger.warning(f"⚠️ {chatbot_type} chain test failed: {result.get('error', 'Unknown error')}")
        
        return test_results

# Global enhanced chain factory instance
enhanced_chain_factory = EnhancedChainFactory()

def get_enhanced_chain_factory() -> EnhancedChainFactory:
    """Get the global enhanced chain factory instance"""
    return enhanced_chain_factory

def create_enhanced_chatbot_chain(chatbot_type: str, system_prompt: str) -> EnhancedChatbotChain:
    """Utility function to create an enhanced chatbot chain"""
    return enhanced_chain_factory.create_chain(chatbot_type, system_prompt)

def get_enhanced_chatbot_chain(chatbot_type: str) -> EnhancedChatbotChain:
    """Utility function to get an enhanced chatbot chain"""
    return enhanced_chain_factory.get_chain(chatbot_type)

# Maintain backward compatibility
ChatbotChain = EnhancedChatbotChain
ChainFactory = EnhancedChainFactory
chain_factory = enhanced_chain_factory
create_chatbot_chain = create_enhanced_chatbot_chain
get_chatbot_chain = get_enhanced_chatbot_chain
get_chain_factory = get_enhanced_chain_factory
