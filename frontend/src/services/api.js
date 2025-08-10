// frontend/src/services/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cdak-chatbot.netlify.app' // Use root-relative URLs in production (Netlify handles routing)
  : 'http://localhost:8000'; // Local development backend

class ApiService {
  async request(endpoint, options = {}) {
    // Remove leading slash from endpoint to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${API_BASE_URL}${cleanEndpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Making request to:', url); // Debug log
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

  async sendMedicalMessage(message) {
    return this.request('api/medical', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async sendEducationMessage(message) {
    return this.request('api/education', {
      method: 'POST', 
      body: JSON.stringify({ message }),
    });
  }

  async sendGeneralMessage(message) {
    return this.request('api/general', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async healthCheck() {
    return this.request('api');
  }
}

export default new ApiService();
