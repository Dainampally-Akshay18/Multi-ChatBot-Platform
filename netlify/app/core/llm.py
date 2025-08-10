from langchain_groq import ChatGroq
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class LLMManager:
    """Manages the shared GROQ LLM instance across all chatbots"""
    
    _instance = None
    _llm = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLMManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._llm is None:
            self._initialize_llm()
    
    def _initialize_llm(self):
        """Initialize the GROQ LLM with configuration"""
        try:
            self._llm = ChatGroq(
                groq_api_key=settings.groq_api_key,
                model_name=settings.groq_model,
                temperature=settings.temperature,
                max_tokens=settings.max_tokens,
                timeout=30,  # 30 seconds timeout
                max_retries=2
            )
            logger.info(f"GROQ LLM initialized with model: {settings.groq_model}")
        except Exception as e:
            logger.error(f"Failed to initialize GROQ LLM: {str(e)}")
            raise
    
    def get_llm(self):
        """Get the shared LLM instance"""
        if self._llm is None:
            self._initialize_llm()
        return self._llm
    
    def test_connection(self):
        """Test the LLM connection"""
        try:
            test_response = self._llm.invoke("Hello, this is a connection test.")
            logger.info("LLM connection test successful")
            return True
        except Exception as e:
            logger.error(f"LLM connection test failed: {str(e)}")
            return False

# Global LLM manager instance
llm_manager = LLMManager()

def get_llm():
    """Get the shared LLM instance - main function to use throughout the app"""
    return llm_manager.get_llm()

def test_llm_connection():
    """Test LLM connection - utility function"""
    return llm_manager.test_connection()
