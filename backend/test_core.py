#!/usr/bin/env python3
"""
Test script for core LangChain components
Run this to verify your setup is working
"""

import asyncio
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core import get_llm, test_llm_connection, create_chatbot_chain

async def test_core_components():
    """Test all core components"""
    print("🚀 Testing Core LangChain Components")
    print("=" * 50)
    
    # Test 1: LLM Connection
    print("\n1. Testing LLM Connection...")
    if test_llm_connection():
        print("✅ LLM connection successful!")
    else:
        print("❌ LLM connection failed!")
        return False
    
    # Test 2: Create a test chain
    print("\n2. Testing Chain Creation...")
    try:
        test_prompt = """You are a helpful assistant. 
        Respond to user questions in a friendly and informative manner."""
        
        chain = create_chatbot_chain("test", test_prompt)
        print("✅ Chain creation successful!")
    except Exception as e:
        print(f"❌ Chain creation failed: {e}")
        return False
    
    # Test 3: Test chain invocation
    print("\n3. Testing Chain Invocation...")
    try:
        result = await chain.invoke("Hello, how are you?")
        if result["success"]:
            print("✅ Chain invocation successful!")
            print(f"Response: {result['response'][:100]}...")
        else:
            print(f"❌ Chain invocation failed: {result['error']}")
            return False
    except Exception as e:
        print(f"❌ Chain invocation failed: {e}")
        return False
    
    print("\n🎉 All core components working perfectly!")
    return True

if __name__ == "__main__":
    try:
        asyncio.run(test_core_components())
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
    except Exception as e:
        print(f"\n\nTest failed with error: {e}")
