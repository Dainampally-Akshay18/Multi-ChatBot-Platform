// frontend/src/services/api.js - CORRECTED FOR ALL 8 CHATBOTS

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production (Netlify handles routing)
  : ''; // Use relative URLs in development too (Vite proxy handles routing)

class ApiService {
  async request(endpoint, options = {}) {
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Use relative URLs - let Vite proxy handle routing in dev
    const url = normalizedEndpoint;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('🚀 Making request to:', url);
      console.log('🔍 Environment:', process.env.NODE_ENV);
      console.log('🔍 Full URL will be:', window.location.origin + url);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // CORRECTED: All 8 chatbot endpoints using /api/chatbots/*
  async sendMedicalMessage(message) {
    return this.request('/api/chatbots/medical', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendMentalHealthMessage(message) {
    return this.request('/api/chatbots/mental-health', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendEducationMessage(message) {
    return this.request('/api/chatbots/education', {
      method: 'POST', 
      body: JSON.stringify({ message }),
    });
  }

  async sendFinanceMessage(message) {
    return this.request('/api/chatbots/finance', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendLegalMessage(message) {
    return this.request('/api/chatbots/legal', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendCareerMessage(message) {
    return this.request('/api/chatbots/career', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendDeveloperMessage(message) {
    return this.request('/api/chatbots/developer', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendEntertainmentMessage(message) {
    return this.request('/api/chatbots/entertainment', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendGeneralMessage(message) {
    return this.request('/api/chatbots/general', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async healthCheck() {
    return this.request('/api/chatbots');
  }
}

export default new ApiService();
