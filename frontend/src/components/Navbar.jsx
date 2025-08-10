import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, BarChart3, Info, Menu, X } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';
const Navbar = () => {
    
      const location = useLocation();
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigation = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Health', href: '/health', icon: Activity },
        { name: 'Metrics', href: '/metrics', icon: BarChart3 },
        { name: 'About', href: '/about', icon: Info },
      ];
  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg lg:text-xl">MC</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl lg:text-2xl text-gray-900">
                  {APP_CONFIG.NAME}
                </span>
                <p className="text-sm text-gray-500 -mt-1">AI Assistant Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </div>
  )
}

export default Navbar
