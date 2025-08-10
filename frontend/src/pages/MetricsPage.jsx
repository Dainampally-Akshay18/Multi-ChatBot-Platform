import React from 'react';
import { BarChart3 } from 'lucide-react';

const MetricsPage = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center max-w-2xl w-full">
      <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Performance Metrics</h1>
        <p className="text-xl text-gray-600 mb-8">Analytics dashboard coming soon...</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-2xl font-bold text-blue-600">98.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-2xl font-bold text-green-600">1.2s</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MetricsPage;
