import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, Users, Zap, ArrowRight, Sparkles,
  Star, Shield, Globe, Cpu, Search, Filter
} from 'lucide-react';

// Enhanced chatbots data
const CHATBOTS = [
  {
    id: 'medical',
    name: 'Medical Assistant',
    description: 'Get professional medical information and health guidance from our AI doctor with latest medical knowledge.',
    category: 'Healthcare',
    color: '#10b981',
    icon: '🏥',
    badge: 'Popular',
    features: ['Symptom Analysis', 'Treatment Info', 'Drug Interactions']
  },
  {
    id: 'mental_health',
    name: 'Mental Health Support',
    description: 'Compassionate mental health support and wellness guidance for emotional wellbeing.',
    category: 'Healthcare',
    color: '#8b5cf6',
    icon: '🧠',
    badge: 'New',
    features: ['Stress Management', 'Mindfulness', 'Coping Strategies']
  },
  {
    id: 'education',
    name: 'Education Tutor',
    description: 'Personalized learning assistance across all subjects and skill levels with adaptive teaching.',
    category: 'Education',
    color: '#3b82f6',
    icon: '📚',
    badge: 'Featured',
    features: ['All Subjects', 'Homework Help', 'Exam Prep']
  },
  {
    id: 'finance',
    name: 'Financial Advisor',
    description: 'Expert financial guidance, investment advice, and comprehensive money management solutions.',
    category: 'Finance',
    color: '#f59e0b',
    icon: '💰',
    badge: 'Premium',
    features: ['Investment Tips', 'Budget Planning', 'Tax Advice']
  },
  {
    id: 'legal',
    name: 'Legal Assistant',
    description: 'Professional legal information and guidance for various legal matters and document review.',
    category: 'Legal',
    color: '#ef4444',
    icon: '⚖️',
    badge: 'Pro',
    features: ['Contract Review', 'Legal Research', 'Compliance']
  },
  {
    id: 'career',
    name: 'Career Coach',
    description: 'Professional career development, resume optimization, and strategic job search assistance.',
    category: 'Professional',
    color: '#06b6d4',
    icon: '💼',
    badge: 'Trending',
    features: ['Resume Building', 'Interview Prep', 'Career Planning']
  },
  {
    id: 'developer',
    name: 'Developer Helper',
    description: 'Advanced programming assistance, code review, debugging, and technical architecture guidance.',
    category: 'Technology',
    color: '#84cc16',
    icon: '💻',
    badge: 'Popular',
    features: ['Code Review', 'Debugging', 'Best Practices']
  },
  {
    id: 'entertainment',
    name: 'Entertainment Guide',
    description: 'Personalized movie recommendations, game suggestions, and comprehensive entertainment advice.',
    category: 'Lifestyle',
    color: '#ec4899',
    icon: '🎮',
    badge: 'Fun',
    features: ['Movie Recs', 'Game Reviews', 'Event Planning']
  }
];

const BotSelector = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredBot, setHoveredBot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories
  const categories = ['All', ...new Set(CHATBOTS.map(bot => bot.category))];

  // Filter chatbots
  const filteredChatbots = CHATBOTS.filter(bot => {
    const matchesCategory = selectedCategory === 'All' || bot.category === selectedCategory;
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleBotSelect = (botId) => {
    navigate(`/chat/${botId}`);
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Popular': 'bg-red-500',
      'New': 'bg-green-500',
      'Featured': 'bg-blue-500',
      'Premium': 'bg-purple-500',
      'Pro': 'bg-orange-500',
      'Trending': 'bg-pink-500',
      'Fun': 'bg-yellow-500'
    };
    return colors[badge] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Modern Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-semibold text-sm">Powered by Advanced AI Technology</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Choose Your Perfect
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Assistant
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Experience the future of intelligent conversations with our specialized AI assistants.
              Each one is expertly trained for specific domains to provide you with the best assistance.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search assistants by name, category, or feature..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/30 text-gray-700 placeholder-gray-500 shadow-xl text-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Filter className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Users, label: 'AI Specialists', value: CHATBOTS.length, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
              { icon: MessageCircle, label: 'Available 24/7', value: '∞', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
              { icon: Zap, label: 'Avg Response', value: '<2s', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50' },
              { icon: Shield, label: 'Enterprise Grade', value: '100%', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`group relative ${stat.bgColor} rounded-3xl p-6 text-center shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-500 hover:scale-105`}
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Category Filter */}
      <section className="py-8 bg-white/60 backdrop-blur-sm border-y border-white/20 sticky top-24 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105 border border-gray-200/50'
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Bot Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredChatbots.map((bot) => (
              <div
                key={bot.id}
                onClick={() => handleBotSelect(bot.id)}
                onMouseEnter={() => setHoveredBot(bot.id)}
                onMouseLeave={() => setHoveredBot(null)}
                className="group relative bg-white rounded-3xl p-6 cursor-pointer border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white overflow-hidden"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`${getBadgeColor(bot.badge)} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}>
                    {bot.badge}
                  </span>
                </div>

                {/* Bot Icon with Enhanced Styling */}
                <div className="relative mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      background: `linear-gradient(135deg, ${bot.color}20, ${bot.color}40)`,
                      border: `2px solid ${bot.color}30`
                    }}
                  >
                    {bot.icon}
                  </div>
                  <div 
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: bot.color }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Bot Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      {bot.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3">
                      {bot.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {bot.features.slice(0, 2).map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {bot.features.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          +{bot.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: bot.color }}
                    >
                      {bot.category}
                    </span>
                    
                    <div
                      className="flex items-center space-x-2 text-gray-400 group-hover:text-blue-600 transition-all duration-300"
                      style={{ 
                        transform: hoveredBot === bot.id ? 'translateX(4px)' : 'translateX(0px)' 
                      }}
                    >
                      <span className="text-sm font-medium">Chat</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredChatbots.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No assistants found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or category filter.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.3),transparent)] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-lg lg:text-xl text-blue-200 max-w-3xl mx-auto mb-12">
            Join thousands of professionals who rely on our AI assistants for their daily tasks.
            Start with our most popular options.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => handleBotSelect('education')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Start Learning</span>
                <span className="text-2xl">📚</span>
              </span>
            </button>
            <button
              onClick={() => handleBotSelect('developer')}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Code with AI</span>
                <span className="text-2xl">💻</span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BotSelector;
