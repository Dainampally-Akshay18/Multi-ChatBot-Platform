import React from 'react';
import { Activity } from 'lucide-react';

const HealthPage = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center max-w-2xl w-full">
      <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">System Health</h1>
        <p className="text-xl text-gray-600 mb-8">Health monitoring dashboard coming soon...</p>
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">All Systems Operational</span>
        </div>
      </div>
    </div>
  </div>
);

export default HealthPage;
