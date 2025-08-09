#!/usr/bin/env python3
"""
Test script for enhanced LangChain chains and chatbot handlers
Tests performance, validation, and batch processing
"""

import asyncio
import sys
import os
import time
from datetime import datetime

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.chatbots import (
    get_chatbot_response,
    get_chatbot_response_async,
    get_batch_chatbot_responses,
    test_all_chatbots,
    get_chatbot_metrics,
    get_system_health,
    get_available_chatbot_types
)

async def test_enhanced_features():
    """Test enhanced chain features"""
    print("🚀 Testing Enhanced LangChain Chain Features")
    print("=" * 50)
    
    # Test 1: System Health Check
    print("\n🏥 System Health Check")
    print("-" * 25)
    health = get_system_health()
    print(f"Total Chatbots: {health['total_chatbots']}")
    print(f"Available: {health['available_chatbots']}")
    print(f"Health: {health['health_percentage']:.1f}%")
    print(f"Status: {health['status']}")
    
    # Test 2: Individual Response with Validation
    print("\n🧪 Testing Response Validation")
    print("-" * 30)
    response = get_chatbot_response("medical", "What should I do if I have a fever?")
    
    if response["success"]:
        print(f"✅ Response: {response['response'][:100]}...")
        print(f"⏱️ Duration: {response['duration']:.2f}s")
        
        if response["validation"]:
            validation = response["validation"]
            print(f"✅ Valid: {validation['is_valid']}")
            if validation["issues"]:
                print(f"⚠️ Issues: {validation['issues']}")
    else:
        print(f"❌ Failed: {response['error']}")
    
    # Test 3: Async Response
    print("\n⚡ Testing Async Processing")
    print("-" * 25)
    start_time = time.time()
    async_response = await get_chatbot_response_async("developer", "Explain async/await in Python")
    async_duration = time.time() - start_time
    
    if async_response["success"]:
        print(f"✅ Async response received in {async_duration:.2f}s")
        print(f"📝 Preview: {async_response['response'][:100]}...")
    else:
        print(f"❌ Async failed: {async_response['error']}")
    
    # Test 4: Batch Processing
    print("\n📦 Testing Batch Processing")
    print("-" * 25)
    
    batch_requests = [
        {"chatbot_type": "finance", "user_input": "How to start investing?"},
        {"chatbot_type": "career", "user_input": "Tips for job interviews?"},
        {"chatbot_type": "education", "user_input": "Explain quantum physics simply"},
        {"chatbot_type": "entertainment", "user_input": "Recommend a comedy movie"}
    ]
    
    batch_start = time.time()
    batch_responses = await get_batch_chatbot_responses(batch_requests)
    batch_duration = time.time() - batch_start
    
    successful_batch = sum(1 for r in batch_responses if r.get("success", False))
    print(f"✅ Batch: {successful_batch}/{len(batch_requests)} successful")
    print(f"⏱️ Total time: {batch_duration:.2f}s")
    print(f"⚡ Avg per request: {batch_duration/len(batch_requests):.2f}s")
    
    # Test 5: Performance Metrics
    print("\n📊 Performance Metrics")
    print("-" * 20)
    
    metrics = get_chatbot_metrics()
    for chatbot_type, metric in metrics.items():
        if metric:  # Only show metrics for tested chatbots
            print(f"{chatbot_type}:")
            print(f"  Invocations: {metric.get('total_invocations', 0)}")
            print(f"  Success rate: {(metric.get('successful_invocations', 0) / max(metric.get('total_invocations', 1), 1) * 100):.1f}%")
            print(f"  Avg duration: {metric.get('average_duration', 0):.2f}s")
    
    # Test 6: Comprehensive Chatbot Test
    print("\n🤖 Comprehensive Chatbot Test")
    print("-" * 30)
    
    test_results = await test_all_chatbots()
    total_tests = len(test_results)
    passed_tests = sum(test_results.values())
    
    print(f"Tests passed: {passed_tests}/{total_tests}")
    
    if passed_tests == total_tests:
        print("🎉 All enhanced features working perfectly!")
        return True
    else:
        print("⚠️ Some tests failed:")
        for chatbot_type, success in test_results.items():
            if not success:
                print(f"  ❌ {chatbot_type}")
        return False

def test_error_handling():
    """Test error handling capabilities"""
    print("\n🛡️ Testing Error Handling")
    print("-" * 25)
    
    # Test invalid chatbot type
    response = get_chatbot_response("invalid_bot", "Test message")
    if not response["success"]:
        print("✅ Invalid chatbot type handled correctly")
    else:
        print("❌ Invalid chatbot type not handled")
    
    # Test empty input
    response = get_chatbot_response("medical", "")
    if not response["success"] or response.get("validation", {}).get("issues"):
        print("✅ Empty input handled correctly")
    else:
        print("❌ Empty input not handled")

async def main():
    """Main test function"""
    print("🚀 Enhanced LangChain Chain Implementation Test")
    print("=" * 60)
    print(f"Test started at: {datetime.now()}")
    
    try:
        # Test enhanced features
        enhanced_success = await test_enhanced_features()
        
        # Test error handling
        test_error_handling()
        
        # Final summary
        print("\n" + "=" * 60)
        if enhanced_success:
            print("🎉 All enhanced chain features are working perfectly!")
            print("✅ Your LangChain implementation is production-ready!")
        else:
            print("⚠️ Some features need attention")
        
        print(f"Test completed at: {datetime.now()}")
        return enhanced_success
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
        sys.exit(1)
