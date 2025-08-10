// API service for connecting to Netlify Functions backend

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/' // Use relative URLs in production (Netlify handles routing)
  : 'http://localhost:8000'; // Local development backend

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Chatbot API methods
  async sendMedicalMessage(message) {
    return this.request('/api/medical', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendEducationMessage(message) {
    return this.request('/api/education', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendGeneralMessage(message) {
    return this.request('/api/general', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api');
  }
}

export default new ApiService();
