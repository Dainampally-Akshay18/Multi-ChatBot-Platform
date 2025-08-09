import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Zap } from 'lucide-react';
import { CHATBOTS } from '../utils/constants';

const BotSelector = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...new Set(CHATBOTS.map(bot => bot.category))];

  // Filter chatbots by category
  const filteredChatbots = selectedCategory === 'All' 
    ? CHATBOTS 
    : CHATBOTS.filter(bot => bot.category === selectedCategory);

  const handleBotSelect = (botId) => {
    navigate(`/chat/${botId}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your AI Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select from our specialized chatbots, each expertly trained to help you with specific needs.
          Powered by advanced AI technology for intelligent, helpful conversations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{CHATBOTS.length}</div>
          <div className="text-gray-600">Specialized Bots</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">24/7</div>
          <div className="text-gray-600">Always Available</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">Instant</div>
          <div className="text-gray-600">AI Responses</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Chatbot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredChatbots.map((bot) => (
          <div
            key={bot.id}
            onClick={() => handleBotSelect(bot.id)}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="p-6">
              {/* Bot Icon */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${bot.color}20` }}
              >
                {bot.icon}
              </div>

              {/* Bot Info */}
              <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {bot.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {bot.description}
              </p>

              {/* Category Badge */}
              <div className="flex items-center justify-between">
                <span 
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: bot.color }}
                >
                  {bot.category}
                </span>
                <MessageCircle size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Can't decide? Try our most popular assistants for general help.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => handleBotSelect('education')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Learning
          </button>
          <button
            onClick={() => handleBotSelect('developer')}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Get Coding Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotSelector;
