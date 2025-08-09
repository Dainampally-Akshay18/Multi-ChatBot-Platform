import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { useConnectionStatus } from '../hooks/useConnectionStatus';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);
  const { isOnline, serverStatus, testConnection } = useConnectionStatus();

  const runTests = async () => {
    setIsTesting(true);
    const results = {};

    // Test 1: Connection Test
    console.log('🧪 Running connection test...');
    const connectionResult = await apiService.testConnection();
    results.connection = connectionResult;

    // Test 2: Health Check
    console.log('🧪 Running health check...');
    const healthResult = await apiService.getHealthStatus();
    results.health = healthResult;

    // Test 3: Sample Chat Message
    console.log('🧪 Testing chat message...');
    const chatResult = await apiService.sendMessage('medical', 'Hello, this is a test message');
    results.chat = chatResult;

    setTestResults(results);
    setIsTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const TestResult = ({ title, result, icon: Icon }) => (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{title}</h3>
        {result ? (
          result.success ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )
        ) : (
          <Clock className="w-5 h-5 text-gray-400" />
        )}
      </div>
      
      {result && (
        <div className="text-sm">
          {result.success ? (
            <div className="text-green-700">
              ✅ Success
              {result.data?.responseTime && (
                <span className="ml-2 text-gray-600">
                  ({result.data.responseTime}ms)
                </span>
              )}
            </div>
          ) : (
            <div className="text-red-700">
              ❌ {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">API Integration Test</h2>
          <button
            onClick={runTests}
            disabled={isTesting}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Run Tests'}</span>
          </button>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Network Status</div>
            <div className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Server Status</div>
            <div className={`font-medium ${
              serverStatus === 'online' ? 'text-green-600' : 
              serverStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {serverStatus === 'online' ? '🟢 Connected' : 
               serverStatus === 'error' ? '🔴 Error' : '🟡 Unknown'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Cache Stats</div>
            <div className="font-medium text-blue-600">
              {apiService.getCacheStats().size} entries
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TestResult 
            title="Connection Test" 
            result={testResults.connection}
          />
          <TestResult 
            title="Health Check" 
            result={testResults.health}
          />
          <TestResult 
            title="Chat Message Test" 
            result={testResults.chat}
          />
        </div>

        {/* Detailed Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Detailed Results</h3>
            <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
