import axios from 'axios';
import { API_CONFIG, CHATBOTS } from '../utils/constants';

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Connection status tracking
let isOnline = navigator.onLine;
let connectionListeners = [];

// Request retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
    return (
      !error.response ||
      error.response.status >= 500 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'NETWORK_ERROR'
    );
  },
};

// Request interceptor with retry logic
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    config.headers['X-Request-ID'] = Date.now().toString();
    
    if (API_CONFIG.DEBUG) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        timestamp: new Date().toISOString()
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => {
    if (API_CONFIG.DEBUG) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        duration: response.headers['x-process-time'],
        timestamp: new Date().toISOString()
      });
    }
    
    // Update connection status
    updateConnectionStatus(true);
    
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Update connection status
    updateConnectionStatus(!error.code || error.code !== 'NETWORK_ERROR');
    
    // Implement retry logic
    if (config && !config.__retryCount && RETRY_CONFIG.retryCondition(error)) {
      config.__retryCount = 0;
    }
    
    if (config && config.__retryCount < RETRY_CONFIG.maxRetries) {
      config.__retryCount += 1;
      
      console.warn(`⚠️ Retrying request (${config.__retryCount}/${RETRY_CONFIG.maxRetries}):`, config.url);
      
      // Wait before retrying
      await new Promise(resolve => 
        setTimeout(resolve, RETRY_CONFIG.retryDelay * config.__retryCount)
      );
      
      return api(config);
    }
    
    // Enhanced error handling
    const enhancedError = enhanceError(error);
    console.error('❌ API Response Error:', enhancedError);
    
    return Promise.reject(enhancedError);
  }
);

// Enhanced error handler
function enhanceError(error) {
  let userMessage = 'Something went wrong. Please try again.';
  let errorType = 'unknown';
  
  if (error.code === 'ECONNABORTED') {
    userMessage = 'Request timeout. The server is taking too long to respond.';
    errorType = 'timeout';
  } else if (!error.response) {
    userMessage = 'Network error. Please check your internet connection.';
    errorType = 'network';
  } else if (error.response.status === 404) {
    userMessage = 'The requested resource was not found.';
    errorType = 'not_found';
  } else if (error.response.status === 422) {
    userMessage = 'Invalid request data. Please check your input.';
    errorType = 'validation';
  } else if (error.response.status >= 500) {
    userMessage = 'Server error. Our team has been notified.';
    errorType = 'server';
  } else if (error.response.status === 429) {
    userMessage = 'Too many requests. Please wait a moment and try again.';
    errorType = 'rate_limit';
  }
  
  return {
    ...error,
    userMessage,
    errorType,
    details: error.response?.data || {},
    timestamp: new Date().toISOString()
  };
}

// Connection status management
function updateConnectionStatus(online) {
  if (isOnline !== online) {
    isOnline = online;
    connectionListeners.forEach(listener => listener(online));
  }
}

// Listen for online/offline events
window.addEventListener('online', () => updateConnectionStatus(true));
window.addEventListener('offline', () => updateConnectionStatus(false));

// Enhanced API Service Class
class EnhancedApiService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Connection status methods
  isOnline() {
    return isOnline;
  }
  
  onConnectionChange(callback) {
    connectionListeners.push(callback);
    return () => {
      connectionListeners = connectionListeners.filter(l => l !== callback);
    };
  }

  // Cache management
  getCacheKey(method, url, data) {
    return `${method}:${url}:${JSON.stringify(data || {})}`;
  }
  
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // Enhanced message sending with typing simulation
  async sendMessage(chatbotId, message, context = null, options = {}) {
    try {
      // Validate inputs
      if (!chatbotId || !message?.trim()) {
        throw new Error('Invalid chatbot ID or message');
      }

      const chatbot = CHATBOTS.find(bot => bot.id === chatbotId);
      if (!chatbot) {
        throw new Error(`Unknown chatbot: ${chatbotId}`);
      }

      // Check cache for similar requests (optional)
      const cacheKey = this.getCacheKey('POST', chatbot.endpoint, { message: message.trim(), context });
      if (options.useCache) {
        const cached = this.getCache(cacheKey);
        if (cached) {
          return { success: true, data: cached, error: null, fromCache: true };
        }
      }

      // Simulate typing delay for better UX
      if (options.typingDelay) {
        await new Promise(resolve => setTimeout(resolve, options.typingDelay));
      }

      const response = await api.post(chatbot.endpoint, {
        message: message.trim(),
        context
      });

      // Cache successful responses
      if (options.useCache && response.data.success) {
        this.setCache(cacheKey, response.data);
      }

      return {
        success: true,
        data: response.data,
        error: null,
        fromCache: false
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.userMessage || error.message || 'Failed to send message',
        errorType: error.errorType || 'unknown',
        details: error.details || {},
        fromCache: false
      };
    }
  }

  // Batch message processing with progress tracking
  async sendBatchMessages(requests, onProgress = null) {
    try {
      if (!Array.isArray(requests) || requests.length === 0) {
        throw new Error('Invalid batch requests');
      }

      const response = await api.post(API_CONFIG.ENDPOINTS.BATCH, {
        requests
      });

      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.userMessage || error.message || 'Batch request failed',
        errorType: error.errorType || 'unknown'
      };
    }
  }

  // Health check with detailed status
  async getHealthStatus() {
    try {
      const cacheKey = this.getCacheKey('GET', API_CONFIG.ENDPOINTS.HEALTH);
      const cached = this.getCache(cacheKey);
      if (cached) {
        return { success: true, data: cached, error: null, fromCache: true };
      }

      const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH);
      this.setCache(cacheKey, response.data);

      return {
        success: true,
        data: response.data,
        error: null,
        fromCache: false
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.userMessage || error.message || 'Health check failed',
        errorType: error.errorType || 'unknown'
      };
    }
  }

  // Performance metrics
  async getMetrics() {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.METRICS);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.userMessage || error.message || 'Failed to get metrics',
        errorType: error.errorType || 'unknown'
      };
    }
  }

  // Connection test with detailed diagnostics
  async testConnection() {
    const startTime = Date.now();
    
    try {
      const response = await api.get('/health');
      const duration = Date.now() - startTime;
      
      return {
        success: true,
        data: {
          ...response.data,
          responseTime: duration,
          timestamp: new Date().toISOString()
        },
        error: null
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        success: false,
        data: {
          responseTime: duration,
          timestamp: new Date().toISOString()
        },
        error: error.userMessage || error.message || 'Connection test failed',
        errorType: error.errorType || 'unknown'
      };
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const apiService = new EnhancedApiService();
export default apiService;
