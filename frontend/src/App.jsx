import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BotSelector from './components/BotSelector';
import ChatInterface from './components/ChatInterface';
import HealthPage from './pages/HealthPage';
import MetricsPage from './pages/MetricsPage';
import AboutPage from './pages/AboutPage';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={
            <Layout>
              <BotSelector />
            </Layout>
          } />
          <Route path="/chat/:botId" element={<ChatInterface />} />
          <Route path="/health" element={
            <Layout>
              <HealthPage />
            </Layout>
          } />
          <Route path="/metrics" element={
            <Layout>
              <MetricsPage />
            </Layout>
          } />
          <Route path="/about" element={
            <Layout>
              <AboutPage />
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
