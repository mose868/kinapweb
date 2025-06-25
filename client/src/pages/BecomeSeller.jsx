import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BecomeSeller = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      content: "Hi! I'll help you become a seller on our platform. First, could you tell me what digital service you'd like to offer?"
    }
  ]);
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState({
    service: '',
    skills: [],
    experience: '',
    portfolio: '',
    pricing: '',
    description: ''
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // In a real app, this would be an API call to your AI service
      const response = await fetch('/api/chat/seller-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          step,
          formData
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // Update form data based on AI response
      if (data.formUpdate) {
        setFormData(prev => ({
          ...prev,
          ...data.formUpdate
        }));
      }

      // Add AI response to conversation
      setConversation(prev => [...prev, { role: 'assistant', content: data.message }]);
      
      // Move to next step if AI determines we're ready
      if (data.nextStep) {
        setStep(prev => prev + 1);
      }

    } catch (error) {
      setError('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const finalizeRegistration = async () => {
    setLoading(true);
    try {
      // In a real app, this would save the seller profile to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/marketplace/dashboard');
    } catch (error) {
      setError('Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ajira-lightGray py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-ajira p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-ajira-blue mb-2">
                Become a Seller
              </h1>
              <p className="text-ajira-gray">
                Let our AI assistant guide you through the seller registration process
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            )}

            {/* Chat Interface */}
            <div className="space-y-6">
              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-4 bg-ajira-lightGray rounded-lg space-y-4">
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-ajira-blue text-white'
                          : 'bg-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg p-3">
                      <Loader className="animate-spin" size={20} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`bg-ajira-blue text-white px-6 py-3 rounded-lg flex items-center space-x-2 ${
                    !input.trim() || loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-ajira-lightBlue'
                  }`}
                >
                  <span>Send</span>
                  <ArrowRight size={20} />
                </button>
              </form>

              {/* Progress */}
              <div className="flex justify-between items-center pt-4 border-t border-ajira-lightGray">
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i <= step
                          ? 'bg-ajira-blue'
                          : 'bg-ajira-lightGray'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-ajira-gray">
                  Step {step + 1} of 5
                </span>
              </div>

              {/* Complete Registration */}
              {step === 4 && (
                <div className="text-center pt-6 border-t border-ajira-lightGray">
                  <button
                    onClick={finalizeRegistration}
                    disabled={loading}
                    className={`bg-ajira-blue text-white px-8 py-3 rounded-lg flex items-center space-x-2 mx-auto ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-ajira-lightBlue'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        <span>Complete Registration</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller; 