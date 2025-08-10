// Complete API Service for Multi-Chatbot Platform
// File: frontend/src/services/api.js

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://langchain-rag-chatbot.onrender.com' // Your Render backend URL
  : 'http://localhost:8000'; // Local development backend

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('🚀 Making request to:', endpoint);
    console.log('🔍 Environment:', process.env.NODE_ENV);
    console.log('🔍 Full URL will be:', url);
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ API response received:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // Health check endpoint
  async healthCheck() {
    return this.request('/');
  }

  // Medical Chatbot
  async sendMedicalMessage(message) {
    return this.request('/api/chatbots/medical', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Mental Health Chatbot
  async sendMentalHealthMessage(message) {
    return this.request('/api/chatbots/mental-health', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Education Chatbot
  async sendEducationMessage(message) {
    return this.request('/api/chatbots/education', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Finance Chatbot
  async sendFinanceMessage(message) {
    return this.request('/api/chatbots/finance', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Legal Chatbot
  async sendLegalMessage(message) {
    return this.request('/api/chatbots/legal', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Career Chatbot
  async sendCareerMessage(message) {
    return this.request('/api/chatbots/career', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Developer Chatbot
  async sendDeveloperMessage(message) {
    return this.request('/api/chatbots/developer', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Entertainment Chatbot
  async sendEntertainmentMessage(message) {
    return this.request('/api/chatbots/entertainment', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // General Chatbot (fallback)
  async sendGeneralMessage(message) {
    return this.request('/api/chatbots/general', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Generic method for any chatbot type
  async sendMessage(chatbotType, message) {
    const methodMap = {
      'medical': this.sendMedicalMessage,
      'mental-health': this.sendMentalHealthMessage,
      'education': this.sendEducationMessage,
      'finance': this.sendFinanceMessage,
      'legal': this.sendLegalMessage,
      'career': this.sendCareerMessage,
      'developer': this.sendDeveloperMessage,
      'entertainment': this.sendEntertainmentMessage,
      'general': this.sendGeneralMessage,
    };

    const method = methodMap[chatbotType];
    if (method) {
      return method.call(this, message);
    } else {
      throw new Error(`Unsupported chatbot type: ${chatbotType}`);
    }
  }
}

// Export singleton instance
export default new ApiService();
