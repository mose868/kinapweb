import React, { useState } from 'react';
import { geminiAI } from '../../services/geminiAI';
import { Loader2, Send, CheckCircle, XCircle } from 'lucide-react';

const GeminiTest: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await geminiAI.generateResponse('Hello, this is a test message.');
      
      if (result.error) {
        setError(`Connection failed: ${result.error}`);
        setIsConnected(false);
      } else {
        setResponse(result.text);
        setIsConnected(true);
        setError('');
      }
    } catch (err) {
      setError(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError('');
    setResponse('');
    
    try {
      const result = await geminiAI.generateResponse(message);
      
      if (result.error) {
        setError(`Error: ${result.error}`);
      } else {
        setResponse(result.text);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gemini AI Test</h2>
      
      {/* Connection Status */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-gray-700">Connection Status:</span>
          {isConnected === null && (
            <span className="text-sm text-gray-500">Not tested</span>
          )}
          {isConnected === true && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Connected</span>
            </div>
          )}
          {isConnected === false && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">Not connected</span>
            </div>
          )}
        </div>
        
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </button>
      </div>

      {/* Message Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Send a message to Gemini AI:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Error:</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Response:</h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>First, test the connection to verify your API key is working</li>
          <li>If connected, you can send messages to test the AI responses</li>
          <li>Check the browser console for detailed error messages</li>
          <li>Make sure your <code className="bg-gray-100 px-1 rounded">VITE_GEMINI_API_KEY</code> is set in your <code className="bg-gray-100 px-1 rounded">.env</code> file</li>
        </ol>
      </div>
    </div>
  );
};

export default GeminiTest; 