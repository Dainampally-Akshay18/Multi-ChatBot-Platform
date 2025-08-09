import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, ArrowLeft, Loader, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { CHATBOTS, UI_CONFIG } from '../utils/constants';
import { apiService } from '../services/api';
import { useConnectionStatus } from '../hooks/useConnectionStatus';

const ChatInterface = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const { isOnline, serverStatus } = useConnectionStatus();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

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
        content: `Hello! I'm your ${selectedBot.name}. ${selectedBot.description} How can I help you today?`,
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

  const simulateTyping = async (duration = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  const handleSendMessage = async (retryAttempt = false) => {
    if (!inputMessage.trim() || isLoading) return;

    // Check connection status
    if (!isOnline || serverStatus !== 'online') {
      setError('You appear to be offline. Please check your connection and try again.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      retryAttempt
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Simulate typing for better UX
      await simulateTyping(500);

      const response = await apiService.sendMessage(
        botId, 
        userMessage.content,
        null,
        { 
          typingDelay: 200,
          useCache: false // Disable cache for real-time conversations
        }
      );

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.response,
          timestamp: response.data.timestamp,
          botName: selectedBot.name,
          duration: response.data.duration,
          fromCache: response.fromCache
        };

        setMessages(prev => [...prev, botMessage]);
        setRetryCount(0); // Reset retry count on success
      } else {
        setError(response.error);
        
        // Show retry option for certain error types
        if (['timeout', 'network', 'server'].includes(response.errorType)) {
          setRetryCount(prev => prev + 1);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (retryCount > 0) {
      handleSendMessage(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Hello! I'm your ${selectedBot.name}. ${selectedBot.description} How can I help you today?`,
        timestamp: new Date().toISOString(),
        botName: selectedBot.name
      }
    ]);
    setError(null);
    setRetryCount(0);
  };

  if (!selectedBot) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Chatbot Not Found</h2>
        <p className="text-gray-600 mb-4">The requested chatbot doesn't exist.</p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header with Connection Status */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              {selectedBot.icon}
            </div>
            <div>
              <h2 className="font-semibold text-lg">{selectedBot.name}</h2>
              <div className="flex items-center space-x-2 text-blue-100 text-sm">
                <span>{selectedBot.category}</span>
                {/* Connection indicator */}
                <div className="flex items-center space-x-1">
                  {isOnline && serverStatus === 'online' ? (
                    <Wifi size={14} className="text-green-300" />
                  ) : (
                    <WifiOff size={14} className="text-red-300" />
                  )}
                  <span className="text-xs">
                    {serverStatus === 'online' ? 'Connected' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.type === 'bot' && (
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <span>{message.botName}</span>
                  {message.fromCache && (
                    <span className="ml-2 text-blue-500">⚡ Cached</span>
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.duration && (
                <div className="text-xs text-gray-400 mt-1">
                  Responded in {message.duration.toFixed(2)}s
                </div>
              )}
              {message.retryAttempt && (
                <div className="text-xs text-yellow-400 mt-1">
                  Retry attempt
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-gray-600">Thinking...</span>
            </div>
          </div>
        )}

        {isLoading && !isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-gray-600">Processing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display with Retry Option */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-700">{error}</p>
              {retryCount > 0 && retryCount < 3 && (
                <button
                  onClick={handleRetry}
                  className="mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  Retry ({retryCount}/3)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offline Notice */}
      {(!isOnline || serverStatus !== 'online') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4">
          <div className="flex items-center">
            <WifiOff className="w-5 h-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {!isOnline ? 'You appear to be offline.' : 'Unable to connect to the server.'} 
                Messages will be sent when connection is restored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${selectedBot.name} anything...`}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="2"
            maxLength={UI_CONFIG.MAX_MESSAGE_LENGTH}
            disabled={isLoading || !isOnline || serverStatus !== 'online'}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading || !isOnline || serverStatus !== 'online'}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{inputMessage.length}/{UI_CONFIG.MAX_MESSAGE_LENGTH} characters</span>
          <span>{isOnline && serverStatus === 'online' ? '🟢 Online' : '🔴 Offline'}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
