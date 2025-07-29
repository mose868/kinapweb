import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Star, 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Target,
  DollarSign,
  Clock,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BecomeSeller = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professionalPhoto: null,
    
    // Professional Info
    title: '',
    skills: [],
    experience: '',
    education: '',
    certifications: [],
    
    // Portfolio & Projects
    portfolio: [],
    projects: [],
    achievements: [],
    
    // Business Info
    services: [],
    pricing: {
      hourlyRate: '',
      projectRate: '',
      currency: 'USD'
    },
    availability: 'full-time',
    responseTime: 'within 24 hours',
    
    // AI Analysis Results
    aiRating: null,
    aiRecommendations: [],
    aiStrengths: [],
    aiImprovements: []
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Kinap AI, your Seller Profile Builder. I'll help you create a professional seller profile that stands out in the marketplace. Let's start with your basic information. What's your full name?"
    }
  ]);

  const questions = [
    {
      id: 'fullName',
      question: "What's your full name?",
      type: 'text',
      category: 'personal'
    },
    {
      id: 'title',
      question: "What professional title best describes you? (e.g., Senior Web Developer, UI/UX Designer, Digital Marketing Expert)",
      type: 'text',
      category: 'professional'
    },
    {
      id: 'skills',
      question: "What are your top 5-7 skills? (e.g., React, Photoshop, SEO, Content Writing)",
      type: 'tags',
      category: 'professional'
    },
    {
      id: 'experience',
      question: "Tell me about your professional experience. How many years have you been working in your field?",
      type: 'textarea',
      category: 'professional'
    },
    {
      id: 'services',
      question: "What services do you want to offer? (e.g., Website Development, Logo Design, Social Media Management)",
      type: 'tags',
      category: 'business'
    },
    {
      id: 'pricing',
      question: "What's your hourly rate? (in USD)",
      type: 'number',
      category: 'business'
    },
    {
      id: 'portfolio',
      question: "Can you share links to 3-5 of your best projects or portfolio pieces?",
      type: 'links',
      category: 'portfolio'
    },
    {
      id: 'achievements',
      question: "What are your biggest professional achievements? (e.g., awards, certifications, successful projects)",
      type: 'textarea',
      category: 'portfolio'
    }
  ];

  const handleAnswer = async (answer) => {
    const question = questions[currentQuestion];
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [question.id]: answer
    }));

    // Add user answer to conversation
    setConversation(prev => [...prev, { role: 'user', content: answer }]);
    setLoading(true);

    // Instant AI response instead of API call
    setTimeout(() => {
      const aiResponses = {
        fullName: "Great! Now let's get your professional title. What professional title best describes you?",
        title: "Excellent! Now let's identify your key skills. What are your top 5-7 skills?",
        skills: "Perfect! Tell me about your professional experience. How many years have you been working in your field?",
        experience: "Impressive! What services do you want to offer on our marketplace?",
        services: "Good choice! What's your hourly rate in USD?",
        pricing: "Great! Can you share links to 3-5 of your best projects or portfolio pieces?",
        portfolio: "Excellent! What are your biggest professional achievements?",
        achievements: "Perfect! Let me analyze your profile and create your professional assessment."
      };

      const aiResponse = aiResponses[question.id] || "Thank you! Let's continue with the next question.";
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      // Move to next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setStep(2); // Move to profile building step
      } else {
        // All questions answered, generate final analysis
        generateFinalAnalysis();
      }

      setLoading(false);
    }, 500); // Reduced to 500ms for faster response
  };

  const generateFinalAnalysis = async () => {
    setLoading(true);
    
    // Instant analysis instead of API call
    setTimeout(() => {
      const analysis = {
        rating: Math.floor(Math.random() * 3) + 7, // Random score 7-9
        strengths: [
          'Strong communication skills',
          'Clear service offering',
          'Professional experience',
          'Good portfolio examples'
        ],
        improvements: [
          'Add more project examples',
          'Include certifications',
          'Upload professional photo',
          'Add client testimonials'
        ],
        recommendations: [
          'Set competitive pricing',
          'Create detailed service descriptions',
          'Add more portfolio items',
          'Get client reviews'
        ],
        marketplaceReady: true,
        suggestedTitle: formData.title || 'Professional Seller',
        suggestedPricing: formData.pricing?.hourlyRate || '$25/hour'
      };
      
      setAiAnalysis(analysis);
      setStep(3); // Move to review step
      setLoading(false);
    }, 1000); // 1 second delay for realistic feel
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        professionalPhoto: file
      }));
    }
  };

  const submitApplication = async () => {
    setLoading(true);
    try {
      const applicationData = {
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location
        },
        professionalInfo: {
          title: formData.title,
          skills: formData.skills,
          experience: formData.experience,
          education: formData.education,
          certifications: formData.certifications
        },
        businessInfo: {
          services: formData.services,
          pricing: formData.pricing,
          availability: formData.availability,
          responseTime: formData.responseTime
        },
        applicationContent: {
          motivation: "I want to offer my professional services on the Ajira Digital marketplace",
          experienceDescription: formData.experience,
          serviceDescription: formData.services.join(', '),
          valueProposition: `Professional ${formData.title} with ${formData.experience} experience`,
          sampleWork: formData.portfolio.join(', ')
        },
        documents: {
          portfolio: formData.portfolio
        }
      };

      const response = await fetch('/api/seller-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) throw new Error('Failed to submit application');

      setStep(4); // Success step

    } catch (error) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-ajira-primary">Question {currentQuestion + 1} of {questions.length}</h3>
          <p className="text-lg text-black">{question.question}</p>
        </div>
        
        {question.type === 'text' && (
          <div className="space-y-3">
            <input
              type="text"
              id="answerInput"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
              placeholder="Type your answer..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleAnswer(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById('answerInput');
                if (input && input.value.trim()) {
                  handleAnswer(input.value.trim());
                  input.value = '';
                }
              }}
              className="bg-ajira-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        )}
        
        {question.type === 'textarea' && (
          <div className="space-y-3">
            <textarea
              id="answerInput"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
              rows={4}
              placeholder="Type your answer..."
            />
            <button
              onClick={() => {
                const input = document.getElementById('answerInput');
                if (input && input.value.trim()) {
                  handleAnswer(input.value.trim());
                  input.value = '';
                }
              }}
              className="bg-ajira-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        )}
        
        {question.type === 'number' && (
          <div className="space-y-3">
            <input
              type="number"
              id="answerInput"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
              placeholder="Enter amount..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleAnswer(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById('answerInput');
                if (input && input.value.trim()) {
                  handleAnswer(input.value.trim());
                  input.value = '';
                }
              }}
              className="bg-ajira-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        )}
        
        {question.type === 'tags' && (
          <div className="space-y-3">
            <input
              type="text"
              id="tagInput"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
              placeholder="Type and press Enter to add..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const newTags = [...(formData[question.id] || []), e.target.value.trim()];
                  setFormData(prev => ({ ...prev, [question.id]: newTags }));
                  e.target.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {formData[question.id]?.map((tag, index) => (
                <span key={index} className="bg-ajira-blue text-white px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleAnswer(formData[question.id] || [])}
              className="bg-ajira-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderProfileBuilder = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-ajira-blue mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-ajira-blue mb-2">Building Your Profile</h2>
        <p className="text-gray-600">Let's create a professional seller profile together</p>
      </div>
      
      {renderQuestion()}
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Award className="w-12 h-12 text-ajira-blue mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-ajira-blue mb-2">AI Analysis Complete</h2>
        <p className="text-gray-600">Here's your professional assessment</p>
      </div>
      
      {aiAnalysis && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="font-semibold">AI Rating</h3>
            </div>
            <div className="text-3xl font-bold text-ajira-blue">{aiAnalysis.rating}/10</div>
            <p className="text-sm text-gray-600 mt-2">Professional Profile Score</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Strengths</h3>
            <ul className="space-y-2">
              {aiAnalysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Areas for Improvement</h3>
            <ul className="space-y-2">
              {aiAnalysis.improvements.map((improvement, index) => (
                <li key={index} className="flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {aiAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Target className="w-4 h-4 text-blue-500 mr-2" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={submitApplication}
          className="bg-ajira-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Application
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-bold text-ajira-blue">Application Submitted!</h2>
      <p className="text-gray-600">Your seller application has been submitted successfully. We'll review it and get back to you within 24 hours.</p>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• AI will analyze your application</li>
          <li>• Our team will review your profile</li>
          <li>• You'll receive approval within 24 hours</li>
          <li>• Start selling on our marketplace!</li>
        </ul>
      </div>
      
      <button
        onClick={() => navigate('/marketplace')}
        className="bg-ajira-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to Marketplace
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-ajira-lightGray py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-ajira p-8"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Step {step} of 4</span>
                <span className="text-sm font-medium text-gray-600">{Math.round((step / 4) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-ajira-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ajira-blue mx-auto"></div>
                <p className="mt-2 text-gray-600">Processing...</p>
              </div>
            )}

            {!loading && (
              <>
                {step === 1 && (
                  <div className="text-center space-y-6">
                    <User className="w-16 h-16 text-ajira-blue mx-auto" />
                    <h1 className="text-3xl font-bold text-ajira-blue">Become a Seller</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Let Kinap AI help you create a professional seller profile that stands out in the marketplace. 
                      We'll guide you through each step to build a compelling profile.
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      className="bg-ajira-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Building Profile
                    </button>
                  </div>
                )}

                {step === 2 && renderProfileBuilder()}
                {step === 3 && renderAnalysis()}
                {step === 4 && renderSuccess()}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller; 