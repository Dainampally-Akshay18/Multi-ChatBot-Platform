#!/usr/bin/env python3
"""
Test script for FastAPI endpoints
Tests all chatbot endpoints and system functionality
"""

import requests
import asyncio
import json
import time
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test health check endpoint"""
    print("Testing Health Check...")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Health check passed: {data['status']}")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Health check error: {e}")
        return False

def test_chatbot_endpoint(endpoint, message, chatbot_name):
    """Test individual chatbot endpoint"""
    print(f"Testing {chatbot_name}...")
    
    payload = {
        "message": message,
        "context": {"test": True}
    }
    
    try:
        start_time = time.time()
        response = requests.post(f"{BASE_URL}/api/chatbots/{endpoint}", json=payload)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            if data["success"]:
                print(f"✓ {chatbot_name} responded in {duration:.2f}s")
                print(f"  Preview: {data['response'][:100]}...")
                return True
            else:
                print(f"✗ {chatbot_name} failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"✗ {chatbot_name} HTTP error: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ {chatbot_name} error: {e}")
        return False

def test_all_chatbots():
    """Test all chatbot endpoints"""
    print("\nTesting All Chatbot Endpoints")
    print("=" * 40)
    
    endpoints_and_messages = [
        ("medical", "What should I do for a headache?", "Medical Assistant"),
        ("mental-health", "I'm feeling stressed, can you help?", "Mental Health Support"),
        ("education", "Explain photosynthesis in simple terms", "Education Tutor"),
        ("finance", "How should I start investing?", "Financial Advisor"),
        ("legal", "What are tenant rights?", "Legal Assistant"),
        ("career", "How can I improve my resume?", "Career Coach"),
        ("developer", "Explain async/await in Python", "Developer Helper"),
        ("entertainment", "Recommend a good sci-fi movie", "Entertainment Guide")
    ]
    
    results = []
    for endpoint, message, name in endpoints_and_messages:
        result = test_chatbot_endpoint(endpoint, message, name)
        results.append(result)
    
    return results

def test_batch_processing():
    """Test batch processing endpoint"""
    print("\nTesting Batch Processing...")
    
    batch_payload = {
        "requests": [
            {"chatbot_type": "medical", "user_input": "What is diabetes?"},
            {"chatbot_type": "finance", "user_input": "What is compound interest?"},
            {"chatbot_type": "education", "user_input": "What is gravity?"}
        ]
    }
    
    try:
        start_time = time.time()
        response = requests.post(f"{BASE_URL}/api/chatbots/batch", json=batch_payload)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            successful = data["successful_requests"]
            total = data["total_requests"]
            print(f"✓ Batch processing: {successful}/{total} successful in {duration:.2f}s")
            return True
        else:
            print(f"✗ Batch processing failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Batch processing error: {e}")
        return False

def test_system_endpoints():
    """Test system endpoints"""
    print("\nTesting System Endpoints...")
    
    # Test metrics
    try:
        response = requests.get(f"{BASE_URL}/api/chatbots/metrics")
        if response.status_code == 200:
            print("✓ Metrics endpoint working")
        else:
            print("✗ Metrics endpoint failed")
    except Exception as e:
        print(f"✗ Metrics endpoint error: {e}")
    
    # Test chatbot types
    try:
        response = requests.get(f"{BASE_URL}/api/chatbots/types")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Types endpoint: {data['total_count']} chatbot types available")
        else:
            print("✗ Types endpoint failed")
    except Exception as e:
        print(f"✗ Types endpoint error: {e}")

def main():
    """Main test function"""
    print("FastAPI Multi-Chatbot Platform Test")
    print("=" * 50)
    print(f"Test started at: {datetime.now()}")
    print(f"Testing API at: {BASE_URL}")
    
    # Test 1: Health check
    if not test_health_check():
        print("\n✗ Basic health check failed. Is the server running?")
        print(f"  Make sure to start the server with: uvicorn app.main:app --reload")
        return False
    
    # Test 2: Individual chatbots
    chatbot_results = test_all_chatbots()
    successful_chatbots = sum(chatbot_results)
    total_chatbots = len(chatbot_results)
    
    # Test 3: Batch processing
    batch_success = test_batch_processing()
    
    # Test 4: System endpoints
    test_system_endpoints()
    
    # Summary
    print(f"\n" + "=" * 50)
    print("Test Summary:")
    print(f"Individual chatbots: {successful_chatbots}/{total_chatbots}")
    print(f"Batch processing: {'✓' if batch_success else '✗'}")
    
    if successful_chatbots == total_chatbots and batch_success:
        print("🎉 All API tests passed! Your FastAPI backend is working perfectly!")
        return True
    else:
        print("⚠️ Some tests failed. Check the output above for details.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
