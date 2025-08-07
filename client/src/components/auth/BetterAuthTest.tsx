import React, { useState, useEffect } from 'react';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';

const BetterAuthTest: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, signIn, signUp, signOut } = useBetterAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isSignUp) {
        await signUp(email, password, { displayName: name });
        setMessage('Sign up successful!');
      } else {
        await signIn(email, password);
        setMessage('Sign in successful!');
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Authentication failed'}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMessage('Sign out successful!');
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Sign out failed'}`);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Better Auth Test</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
          Error: {error.message || 'Unknown error'}
        </div>
      )}

      {isAuthenticated ? (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-semibold">Authenticated User:</h3>
            <p>ID: {user?.id}</p>
            <p>Email: {user?.email}</p>
            <p>Name: {user?.displayName || user?.name}</p>
            <p>Role: {user?.role}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-1">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BetterAuthTest; 