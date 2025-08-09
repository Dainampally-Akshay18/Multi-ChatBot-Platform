"""
Test script for prompt templates and chatbot handlers
Run this to verify all prompts and chatbots are working
"""

import asyncio
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.chatbots import (
    get_all_prompt_templates,
    get_available_chatbot_types,
    get_chatbot_response,
    test_all_chatbots
)

def test_prompt_templates():
    """Test that all prompt templates are properly loaded"""
    print("🎯 Testing Prompt Templates")
    print("=" * 40)
    
    prompts = get_all_prompt_templates()
    available_types = get_available_chatbot_types()
    
    print(f"📝 Found {len(prompts)} prompt templates")
    print(f"🤖 Found {len(available_types)} chatbot types")
    
    for chatbot_type in available_types:
        prompt_length = len(prompts.get(chatbot_type, ""))
        print(f"  ✅ {chatbot_type}: {prompt_length} characters")
    
    return len(prompts) > 0

def test_individual_chatbots():
    """Test each chatbot individually"""
    print("\n🤖 Testing Individual Chatbots")
    print("=" * 40)
    
    test_messages = {
        'medical': "I have a headache. What could be causing it?",
        'mental_health': "I've been feeling stressed lately. Can you help?",
        'education': "Can you explain photosynthesis to me?",
        'finance': "How should I start building an emergency fund?",
        'legal': "What are tenant rights regarding security deposits?",
        'career': "How can I improve my resume?",
        'developer': "What's the difference between let and var in JavaScript?",
        'entertainment': "Can you recommend a good sci-fi movie?"
    }
    
    results = {}
    
    for chatbot_type, message in test_messages.items():
        print(f"\n🔍 Testing {chatbot_type.upper()} chatbot...")
        try:
            response = get_chatbot_response(chatbot_type, message)
            
            if response["success"]:
                print(f"  ✅ Response received ({len(response['response'])} chars)")
                print(f"  📝 Preview: {response['response'][:100]}...")
                results[chatbot_type] = True
            else:
                print(f"  ❌ Failed: {response.get('error', 'Unknown error')}")
                results[chatbot_type] = False
                
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            results[chatbot_type] = False
    
    return results

def main():
    """Main test function"""
    print("🚀 Testing All Chatbot Prompt Templates and Handlers")
    print("=" * 60)
    
    # Test 1: Prompt templates
    if not test_prompt_templates():
        print("❌ Prompt template test failed!")
        return False
    
    # Test 2: Individual chatbots
    individual_results = test_individual_chatbots()
    
    # Test 3: Bulk test
    print("\n⚡ Running Bulk Chatbot Test")
    print("=" * 30)
    bulk_results = test_all_chatbots()
    
    # Summary
    print("\n📊 Test Results Summary")
    print("=" * 25)
    
    total_bots = len(individual_results)
    successful_individual = sum(individual_results.values())
    successful_bulk = sum(bulk_results.values())
    
    print(f"Individual Tests: {successful_individual}/{total_bots} passed")
    print(f"Bulk Tests: {successful_bulk}/{total_bots} passed")
    
    if successful_individual == total_bots and successful_bulk == total_bots:
        print("\n🎉 All chatbots are working perfectly!")
        return True
    else:
        print(f"\n⚠️ Some chatbots need attention:")
        for bot, success in individual_results.items():
            if not success:
                print(f"  ❌ {bot}")
        return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nTest failed with error: {e}")
        sys.exit(1)
