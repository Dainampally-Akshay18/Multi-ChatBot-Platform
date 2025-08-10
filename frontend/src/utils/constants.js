// API Configuration
export const API_CONFIG = {
  BASE_URL: '',
  ENDPOINTS: {
    MEDICAL: '/api/chatbots/medical',
    MENTAL_HEALTH: '/api/chatbots/mental-health',
    EDUCATION: '/api/chatbots/education',
    FINANCE: '/api/chatbots/finance',
    LEGAL: '/api/chatbots/legal',
    CAREER: '/api/chatbots/career',
    DEVELOPER: '/api/chatbots/developer',
    ENTERTAINMENT: '/api/chatbots/entertainment',
    BATCH: '/api/chatbots/batch',
    HEALTH: '/api/chatbots/health',
    METRICS: '/api/chatbots/metrics',
    TYPES: '/api/chatbots/types',
    TEST: '/api/test' 
  }
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Multi-Chatbot Platform',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEBUG: import.meta.env.VITE_DEBUG === 'true'
};

// Chatbot Configuration
export const CHATBOTS = [
  {
    id: 'medical',
    name: 'Medical Assistant',
    description: 'Get medical information and health advice from our specialized medical assistant.',
    icon: '🏥',
    color: '#ef4444',
    endpoint: API_CONFIG.ENDPOINTS.MEDICAL,
    category: 'Health & Wellness'
  },
  {
    id: 'mental-health',
    name: 'Mental Health Support',
    description: 'Receive emotional support and mental wellness guidance.',
    icon: '🧠',
    color: '#8b5cf6',
    endpoint: API_CONFIG.ENDPOINTS.MENTAL_HEALTH,
    category: 'Health & Wellness'
  },
  {
    id: 'education',
    name: 'Education Tutor',
    description: 'Get learning assistance and academic help across various subjects.',
    icon: '📚',
    color: '#3b82f6',
    endpoint: API_CONFIG.ENDPOINTS.EDUCATION,
    category: 'Learning & Development'
  },
  {
    id: 'finance',
    name: 'Financial Advisor',
    description: 'Receive financial planning advice and money management tips.',
    icon: '💰',
    color: '#10b981',
    endpoint: API_CONFIG.ENDPOINTS.FINANCE,
    category: 'Finance & Business'
  },
  {
    id: 'legal',
    name: 'Legal Assistant',
    description: 'Get legal information and guidance for various situations.',
    icon: '⚖️',
    color: '#f59e0b',
    endpoint: API_CONFIG.ENDPOINTS.LEGAL,
    category: 'Professional Services'
  },
  {
    id: 'career',
    name: 'Career Coach',
    description: 'Get career advice, job search help, and professional guidance.',
    icon: '💼',
    color: '#6366f1',
    endpoint: API_CONFIG.ENDPOINTS.CAREER,
    category: 'Professional Services'
  },
  {
    id: 'developer',
    name: 'Developer Helper',
    description: 'Get programming assistance and development guidance.',
    icon: '💻',
    color: '#ec4899',
    endpoint: API_CONFIG.ENDPOINTS.DEVELOPER,
    category: 'Technology'
  },
  {
    id: 'entertainment',
    name: 'Entertainment Guide',
    description: 'Get personalized movie, TV, game, and entertainment recommendations.',
    icon: '🎮',
    color: '#f97316',
    endpoint: API_CONFIG.ENDPOINTS.ENTERTAINMENT,
    category: 'Entertainment'
  }
];

// UI Constants
export const UI_CONFIG = {
  TYPING_DELAY: 100,
  MESSAGE_DELAY: 1000,
  MAX_MESSAGE_LENGTH: 2000,
  CHAT_HISTORY_LIMIT: 50
};
