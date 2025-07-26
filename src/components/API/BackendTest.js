import React, { useState, useEffect } from 'react';
import { checkBackendHealth, sendChatMessage } from '../../utils/api';

const BackendTest = () => {
  const [healthStatus, setHealthStatus] = useState('checking');
  const [testResponse, setTestResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Test backend health on component mount
    testBackendHealth();
  }, []);

  const testBackendHealth = async () => {
    try {
      setHealthStatus('checking');
      const health = await checkBackendHealth();
      setHealthStatus('healthy');
      console.log('Backend health check:', health);
    } catch (error) {
      setHealthStatus('error');
      console.error('Backend health check failed:', error);
    }
  };

  const testChatMessage = async () => {
    setLoading(true);
    setTestResponse(null);
    
    try {
      const response = await sendChatMessage(
        "Hello, this is a test message from Sahayak frontend",
        "test_user",
        "test_session"
      );
      setTestResponse(response);
      console.log('Chat test response:', response);
    } catch (error) {
      setTestResponse({ error: error.message });
      console.error('Chat test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Backend Connection Test</h2>
      
      {/* Health Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Backend Health Status:</h3>
        <div className={`p-3 rounded-lg ${
          healthStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' :
          healthStatus === 'healthy' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {healthStatus === 'checking' && '🔄 Checking backend health...'}
          {healthStatus === 'healthy' && '✅ Backend is healthy and responding'}
          {healthStatus === 'error' && '❌ Backend health check failed'}
        </div>
        <button
          onClick={testBackendHealth}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retest Health
        </button>
      </div>

      {/* Chat Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Chat API Test:</h3>
        <button
          onClick={testChatMessage}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? '🔄 Testing...' : '🧪 Test Chat Message'}
        </button>
      </div>

      {/* Test Response */}
      {testResponse && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Test Response:</h3>
          <div className={`p-4 rounded-lg ${
            testResponse.error ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'
          }`}>
            {testResponse.error ? (
              <div>
                <p className="text-red-800 font-medium">❌ Error:</p>
                <p className="text-red-700">{testResponse.error}</p>
              </div>
            ) : (
              <div>
                <p className="text-green-800 font-medium">✅ Success:</p>
                <p className="text-green-700 mb-2">
                  <strong>Response:</strong> {testResponse.response}
                </p>
                <p className="text-green-700">
                  <strong>Session ID:</strong> {testResponse.session_id}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* API Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">API Configuration:</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Backend URL:</strong> https://agentic-ai-backend-1055718553765.us-central1.run.app</p>
          <p><strong>Health Endpoint:</strong> /health</p>
          <p><strong>Chat Endpoint:</strong> /chat</p>
          <p><strong>Frontend URL:</strong> https://maverics4agenticai.web.app/</p>
        </div>
      </div>
    </div>
  );
};

export default BackendTest; 