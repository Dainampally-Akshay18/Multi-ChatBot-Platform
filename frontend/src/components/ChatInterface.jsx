import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { 
  Send, ArrowLeft, Loader, AlertCircle, RefreshCw, 
  Copy, ThumbsUp, ThumbsDown, MoreVertical, X
} from 'lucide-react';
import apiService from '../services/api';

// Add this CSS import for syntax highlighting
import 'highlight.js/styles/github.css';

// Enhanced chatbots data
const CHATBOTS = [
  {
    id: 'medical',
    name: 'Dr. MediBot',
    description: 'Professional medical AI assistant',
    category: 'Healthcare',
    color: '#10b981',
    icon: '🏥',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'mental_health',
    name: 'Wellness Guide',
    description: 'Mental health support specialist',
    category: 'Healthcare',
    color: '#8b5cf6',
    icon: '🧠',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'education',
    name: 'EduTutor Pro',
    description: 'Personal learning assistant',
    category: 'Education',
    color: '#3b82f6',
    icon: '📚',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'finance',
    name: 'FinanceBot',
    description: 'Financial advisor assistant',
    category: 'Finance',
    color: '#f59e0b',
    icon: '💰',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'legal',
    name: 'LegalEagle',
    description: 'Legal information specialist',
    category: 'Legal',
    color: '#ef4444',
    icon: '⚖️',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'career',
    name: 'CareerCoach',
    description: 'Professional development guide',
    category: 'Professional',
    color: '#06b6d4',
    icon: '💼',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'developer',
    name: 'CodeMaster',
    description: 'Programming assistant',
    category: 'Technology',
    color: '#84cc16',
    icon: '💻',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'entertainment',
    name: 'EntertainBot',
    description: 'Entertainment guide',
    category: 'Lifestyle',
    color: '#ec4899',
    icon: '🎮',
    status: 'online',
    lastSeen: 'Active now'
  }
];

const UI_CONFIG = {
  MAX_MESSAGE_LENGTH: 4000
};

// Custom Markdown Components for Chat Styling
const MarkdownComponents = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-lg font-bold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-gray-900 mb-1 mt-2 first:mt-0">{children}</h3>
  ),
  
  // Paragraphs
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  
  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-2 pl-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 mb-2 pl-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm leading-relaxed">{children}</li>
  ),
  
  // Code blocks
  code: ({ inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code 
          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code 
        className={`block bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2 ${className || ''}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  
  // Pre blocks (code blocks container)
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2 whitespace-pre-wrap">
      {children}
    </pre>
  ),
  
  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-400 pl-3 py-1 bg-blue-50 text-gray-700 italic mb-2 rounded-r">
      {children}
    </blockquote>
  ),
  
  // Links
  a: ({ children, href }) => (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-800 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  
  // Tables
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2">
      <table className="min-w-full border border-gray-200 rounded text-xs">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-200 px-2 py-1 text-left font-semibold text-gray-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-200 px-2 py-1">{children}</td>
  ),
  
  // Horizontal rule
  hr: () => (
    <hr className="my-3 border-gray-300" />
  ),
  
  // Strong and emphasis
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),
};

// Connection status hook
const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState('online');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, serverStatus };
};

const ChatInterface = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isOnline, serverStatus } = useConnectionStatus();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Find the selected chatbot
  const selectedBot = CHATBOTS.find(bot => bot.id === botId);

  useEffect(() => {
    if (!selectedBot) {
      navigate('/');
      return;
    }

    // Add welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Hello! I'm **${selectedBot.name}**, your ${selectedBot.description}. I'm here to help you with anything you need.\n\nWhat can I assist you with today? 😊`,
        timestamp: new Date().toISOString(),
        botName: selectedBot.name
      }
    ]);
  }, [selectedBot, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateTyping = async (duration = 1500) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  // handleKeyPress function
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // UPDATED: Handle all 8 chatbots with correct API service methods
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!isOnline || serverStatus !== 'online') {
      setError('Connection lost. Please check your internet connection and try again.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    setTimeout(() => inputRef.current?.focus(), 100);

    try {
      await simulateTyping(1200);

      let response;
      
      // UPDATED: Map all 8 chatbot IDs to their corresponding API service methods
      switch (selectedBot.id) {
        case 'medical':
          response = await apiService.sendMedicalMessage(currentMessage);
          break;
        case 'mental_health':
          response = await apiService.sendMentalHealthMessage(currentMessage);
          break;
        case 'education':
          response = await apiService.sendEducationMessage(currentMessage);
          break;
        case 'finance':
          response = await apiService.sendFinanceMessage(currentMessage);
          break;
        case 'legal':
          response = await apiService.sendLegalMessage(currentMessage);
          break;
        case 'career':
          response = await apiService.sendCareerMessage(currentMessage);
          break;
        case 'developer':
          response = await apiService.sendDeveloperMessage(currentMessage);
          break;
        case 'entertainment':
          response = await apiService.sendEntertainmentMessage(currentMessage);
          break;
        default:
          response = await apiService.sendGeneralMessage(currentMessage);
          break;
      }

      if (response && response.response) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.response,
          timestamp: new Date().toISOString(),
          botName: selectedBot.name,
          duration: response.duration || 0
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Sorry, I encountered an error while processing your request. Please try again.\n\n*Error: ${err.message || 'Unknown error occurred'}*`,
        timestamp: new Date().toISOString(),
        botName: selectedBot.name
      };
      setMessages(prev => [...prev, errorMessage]);
      
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Hello again! I'm **${selectedBot.name}**. How can I help you today? 😊`,
        timestamp: new Date().toISOString(),
        botName: selectedBot.name
      }
    ]);
    setError(null);
  };

  // Fixed copyMessage function with proper syntax
  const copyMessage = async (content) => {
    try {
      // Remove markdown formatting for plain text copy
      const plainText = content
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
        .replace(/\*(.*?)\*/g, '$1')      // Remove italic
        .replace(/`(.*?)`/g, '$1')        // Remove inline code
        .replace(/``````/g, (match) => {
          // Keep code blocks but remove markdown markers
          return match.replace(/```/g, '').replace(/`/g, '');
        })
        .replace(/#{1,6}\s/g, '')         // Remove headers
        .replace(/>\s/g, '')              // Remove blockquotes
        .replace(/[-*+]\s/g, '-  ')        // Convert list markers to bullets
        .replace(/\d+\.\s/g, '-  ');       // Convert numbered lists to bullets
      
      await navigator.clipboard.writeText(plainText);
      console.log('Message copied to clipboard');
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedBot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <div className="text-center bg-white rounded-3xl p-8 shadow-2xl border border-red-200 max-w-sm w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-3">Assistant Not Found</h2>
          <p className="text-gray-600 mb-6">The requested AI assistant doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Mobile-Optimized Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-md"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedBot.color}20, ${selectedBot.color}40)`,
                    border: `2px solid ${selectedBot.color}30`
                  }}
                >
                  {selectedBot.icon}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  {selectedBot.name}
                </h2>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{selectedBot.lastSeen}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={clearChat}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <RefreshCw size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Messages Area with Markdown Support */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ minHeight: 0 }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${message.type === 'user' ? '' : ''}`}>
              {message.type === 'bot' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: `${selectedBot.color}20` }}
                  >
                    {selectedBot.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{message.botName}</span>
                  <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                </div>
              )}
              
              <div
                className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md ml-auto'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                }`}
              >
                {/* Enhanced Markdown Rendering */}
                <div className="text-sm leading-relaxed">
                  {message.type === 'user' ? (
                    // For user messages, keep simple formatting
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  ) : (
                    // For bot messages, use full Markdown rendering
                    <div className="prose prose-sm max-w-none prose-gray">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={MarkdownComponents}
                        className="markdown-content"
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="text-xs text-blue-100 mt-2 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                )}
                
                {message.type === 'bot' && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                        title="Copy message"
                      >
                        <Copy size={14} />
                      </button>
                      <button className="text-gray-400 hover:text-green-600 transition-colors p-1.5 rounded-md hover:bg-green-50">
                        <ThumbsUp size={14} />
                      </button>
                      <button className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50">
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                    
                    {message.duration && (
                      <span className="text-xs text-gray-400 font-mono">
                        {message.duration.toFixed(1)}s
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: `${selectedBot.color}20` }}
                >
                  {selectedBot.icon}
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {selectedBot.name} is typing...
                </span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-800 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* GUARANTEED MOBILE SEND BUTTON - ALWAYS VISIBLE */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
        {/* Input Row */}
        <div className="flex items-end gap-2 w-full">
          {/* Text Input - Flexible */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${selectedBot.name}...`}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
              rows="1"
              maxLength={UI_CONFIG.MAX_MESSAGE_LENGTH}
              disabled={isLoading || !isOnline || serverStatus !== 'online'}
              style={{ 
                minHeight: '40px', 
                maxHeight: '100px'
              }}
            />
            {/* Character Counter */}
            <div className="flex justify-between items-center mt-1 px-1">
              <span className="text-xs text-gray-400">
                {inputMessage.length}/{UI_CONFIG.MAX_MESSAGE_LENGTH}
              </span>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <div className={`w-2 h-2 rounded-full ${isOnline && serverStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isOnline && serverStatus === 'online' ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
          
          {/* SEND BUTTON - ALWAYS VISIBLE AND FUNCTIONAL */}
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || !isOnline || serverStatus !== 'online'}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-sm transition-all duration-200 active:scale-95"
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
