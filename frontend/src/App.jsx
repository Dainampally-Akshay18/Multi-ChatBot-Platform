import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BotSelector from './components/BotSelector';
import ChatInterface from './components/ChatInterface';
import ApiTest from './components/ApiTest';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<BotSelector />} />
          <Route path="/chat/:botId" element={<ChatInterface />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/test" element={<ApiTest />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// Updated placeholder components
const HealthPage = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">System Health</h1>
    <p className="text-gray-600 mb-4">Health monitoring dashboard coming soon...</p>
    <div className="mt-6">
      <ApiTest />
    </div>
  </div>
);

const MetricsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Performance Metrics</h1>
    <p className="text-gray-600">Analytics dashboard coming soon...</p>
  </div>
);

const AboutPage = () => (
  <div className="max-w-3xl mx-auto py-12">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">About Multi-Chatbot Platform</h1>
    <div className="prose prose-lg">
      <p>
        Our Multi-Chatbot Platform brings together 8 specialized AI assistants, each expertly 
        trained to help you with specific needs. Powered by advanced language models and built 
        with modern web technologies.
      </p>
      <h2>Technology Stack</h2>
      <ul>
        <li>Frontend: React + Vite + TailwindCSS</li>
        <li>Backend: FastAPI + Python</li>
        <li>AI: LangChain + GROQ</li>
        <li>Deployment: Netlify</li>
      </ul>
      <h2>Features</h2>
      <ul>
        <li>8 Specialized AI Assistants</li>
        <li>Real-time Connection Monitoring</li>
        <li>Advanced Error Handling & Retry Logic</li>
        <li>Response Caching for Better Performance</li>
        <li>Offline Support & Recovery</li>
        <li>Responsive Design</li>
      </ul>
    </div>
  </div>
);

export default App;
