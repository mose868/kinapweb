import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Position {
  name: string;
  department: string;
  requirements: string[];
  description: string;
}

interface JoinTeamFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinTeamForm: React.FC<JoinTeamFormProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    location: {
      city: '',
      country: 'Kenya',
    },

    // Position Applied For
    positionInterested: '',

    // Student Information
    course: '',
    yearOfStudy: '',
    studentId: '',
    faculty: '',

    // Current Skills & Learning
    currentSkills: [] as string[],
    skillsToLearn: [] as string[],
    experienceLevel: 'Beginner - Just Starting',

    // Interest & Motivation
    whyJoinClub: '',
    motivation: '',
    timeCommitment: '',
    learningGoals: '',

    // Previous Experience (Optional)
    previousProjects: '',
    hobbies: '',

    // Social Links (Optional)
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: '',
      instagram: '',
    },

    // Availability for Club Activities
    availability: {
      weekdays: false,
      weekends: false,
      evenings: false,
      timePerWeek: '2-4 hours',
    },

    // Additional Information
    additionalInfo: '',
    hearAboutUs: '',
  });

  const experienceLevels = [
    'Beginner - Just Starting',
    'Some Experience - Learning Basics',
    'Intermediate - Have Some Projects',
    'Advanced - Teaching Others',
  ];

  const yearsOfStudy = [
    'Year 1',
    'Year 2', 
    'Year 3',
    'Year 4',
    'Masters',
    'PhD',
    'Recent Graduate',
  ];

  const timeCommitments = [
    '1-2 hours per week',
    '2-4 hours per week',
    '4-6 hours per week',
    '6-10 hours per week',
    '10+ hours per week',
  ];

  useEffect(() => {
    if (isOpen) {
      fetchPositions();
    }
  }, [isOpen]);

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/team-applications/positions`);
      if (response.ok) {
        const data = await response.json();
        setPositions(data.positions);
      } else {
        throw new Error('Failed to fetch positions');
      }
    } catch (error) {
      console.error('Failed to fetch positions:', error);
      toast.error('Using default positions - backend not available');
      
      // Fallback positions for digital club
      setPositions([
        {
          name: 'Frontend Developer',
          department: 'Technology',
          requirements: ['React', 'JavaScript', 'CSS', 'HTML', 'Responsive Design'],
          description: 'Develop and maintain user-facing web applications for our digital platforms'
        },
        {
          name: 'Backend Developer',
          department: 'Technology',
          requirements: ['Node.js', 'JavaScript', 'MySQL/MongoDB', 'API Development'],
          description: 'Build and maintain server-side applications, APIs, and database systems'
        },
        {
          name: 'UI/UX Designer',
          department: 'Design',
          requirements: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
          description: 'Design user interfaces and experiences for our digital platforms'
        },
        {
          name: 'Digital Marketing Specialist',
          department: 'Marketing',
          requirements: ['Social Media Marketing', 'Content Creation', 'SEO', 'Google Analytics'],
          description: 'Develop and execute digital marketing strategies to grow our community'
        },
        {
          name: 'Community Manager',
          department: 'Community',
          requirements: ['Community Building', 'Event Management', 'Communication'],
          description: 'Build and nurture our online and offline student communities'
        },
        {
          name: 'Content Creator',
          department: 'Content',
          requirements: ['Writing', 'Video Creation', 'Photography', 'Storytelling'],
          description: 'Create engaging educational and promotional content across multiple platforms'
        },
        {
          name: 'Student Ambassador',
          department: 'Community',
          requirements: ['Leadership', 'Communication', 'Event Coordination', 'Peer Mentoring'],
          description: 'Represent the club in universities and help recruit new members'
        },
        {
          name: 'Workshop Facilitator',
          department: 'Education',
          requirements: ['Public Speaking', 'Technical Skills', 'Teaching'],
          description: 'Lead technical workshops and training sessions for club members'
        },
        {
          name: 'Social Media Manager',
          department: 'Marketing',
          requirements: ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'Content Planning'],
          description: 'Manage our social media presence and engage with our digital community'
        },
        {
          name: 'Data Analyst',
          department: 'Analytics',
          requirements: ['SQL', 'Excel', 'Python/R', 'Data Visualization'],
          description: 'Analyze member engagement and platform performance data'
        },
        {
          name: 'Event Coordinator',
          department: 'Events',
          requirements: ['Event Planning', 'Organization', 'Communication', 'Time Management'],
          description: 'Plan and coordinate digital skills workshops, hackathons, and networking events'
        },
        {
          name: 'Digital Skills Tutor',
          department: 'Education',
          requirements: ['Teaching Skills', 'Patience', 'Basic Tech Knowledge', 'Communication'],
          description: 'Help fellow students learn basic digital skills and computer literacy'
        }
      ]);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (field: string, value: string) => {
    const items = value.split(',').map((item) => item.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: checked,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone);
      case 2:
        return !!(formData.positionInterested && formData.course && formData.yearOfStudy);
      case 3:
        return !!(formData.whyJoinClub && formData.motivation);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/team-applications/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
      } else {
        toast.error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Submit application error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPosition = positions.find((p) => p.name === formData.positionInterested);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-ajira-primary text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Join Our Team</h2>
            <p className="text-ajira-primary/80">
              {submitted ? 'Application Submitted!' : `Step ${currentStep} of 4`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in joining our team. We've received your
                application for the <strong>{formData.positionInterested}</strong> position.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Our HR team will review your application within 5-7 business days</li>
                  <li>• You'll receive a confirmation email shortly</li>
                  <li>• We'll contact you if you're selected for an interview</li>
                  <li>• Check your email regularly for updates</li>
                </ul>
              </div>
              <button
                onClick={onClose}
                className="bg-ajira-primary text-white px-6 py-3 rounded-lg hover:bg-ajira-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step <= currentStep
                          ? 'bg-ajira-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-ajira-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Content */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="+254 700 000 000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.location.city}
                        onChange={(e) =>
                          handleNestedInputChange('location', 'city', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="Nairobi"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Role Interest & Academic Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What role interests you? *
                    </label>
                    <select
                      value={formData.positionInterested}
                      onChange={(e) => handleInputChange('positionInterested', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                    >
                      <option value="">Select a role...</option>
                      {positions.map((position) => (
                        <option key={position.name} value={position.name}>
                          {position.name} - {position.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPosition && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        {selectedPosition.name}
                      </h4>
                      <p className="text-blue-800 mb-3">{selectedPosition.description}</p>
                      <div>
                        <p className="font-medium text-blue-900 mb-1">What you'll learn:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPosition.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course/Program *
                      </label>
                      <input
                        type="text"
                        value={formData.course}
                        onChange={(e) => handleInputChange('course', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="e.g., Diploma in ICT, Certificate in Business, Artisan in Engineering"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Study *
                      </label>
                      <select
                        value={formData.yearOfStudy}
                        onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      >
                        <option value="">Select your year...</option>
                        {yearsOfStudy.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Registration Number
                      </label>
                      <input
                        type="text"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange('studentId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="Your KiNaP registration number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department/Course Area
                      </label>
                      <select
                        value={formData.faculty}
                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      >
                        <option value="">Select your department...</option>
                        <option value="Computer Studies">Computer Studies</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Business Studies">Business Studies</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Applied Sciences">Applied Sciences</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Why Join & What You Want to Learn
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to join Ajira Digital KiNaP Club? *
                    </label>
                    <textarea
                      value={formData.whyJoinClub}
                      onChange={(e) => handleInputChange('whyJoinClub', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Tell us what excites you about joining our digital club and how you think it will help your learning journey..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What motivates you to learn digital skills? *
                    </label>
                    <textarea
                      value={formData.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Share your goals, dreams, and what drives you to learn technology..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are your learning goals?
                    </label>
                    <textarea
                      value={formData.learningGoals}
                      onChange={(e) => handleInputChange('learningGoals', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="What specific skills or projects do you want to work on? What do you hope to achieve in the next 6-12 months?"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.currentSkills.join(', ')}
                        onChange={(e) => handleArrayInputChange('currentSkills', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="e.g., Basic HTML, Microsoft Office, Photography"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills You Want to Learn
                      </label>
                      <input
                        type="text"
                        value={formData.skillsToLearn.join(', ')}
                        onChange={(e) => handleArrayInputChange('skillsToLearn', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="e.g., React, Digital Marketing, Video Editing"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level
                      </label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      >
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time You Can Commit Per Week
                      </label>
                      <select
                        value={formData.availability.timePerWeek}
                        onChange={(e) =>
                          handleNestedInputChange('availability', 'timePerWeek', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      >
                        {timeCommitments.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Availability & Additional Info
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      When are you available for club activities?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.availability.weekdays}
                          onChange={(e) => handleAvailabilityChange('weekdays', e.target.checked)}
                          className="rounded border-gray-300 text-ajira-primary focus:ring-ajira-primary"
                        />
                        <span>Weekdays</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.availability.weekends}
                          onChange={(e) => handleAvailabilityChange('weekends', e.target.checked)}
                          className="rounded border-gray-300 text-ajira-primary focus:ring-ajira-primary"
                        />
                        <span>Weekends</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.availability.evenings}
                          onChange={(e) => handleAvailabilityChange('evenings', e.target.checked)}
                          className="rounded border-gray-300 text-ajira-primary focus:ring-ajira-primary"
                        />
                        <span>Evenings</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Any previous projects or hobbies? (Optional)
                    </label>
                    <textarea
                      value={formData.previousProjects}
                      onChange={(e) => handleInputChange('previousProjects', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Share any school projects, personal projects, or hobbies that might be relevant..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are your hobbies and interests?
                    </label>
                    <textarea
                      value={formData.hobbies}
                      onChange={(e) => handleInputChange('hobbies', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Tell us about your interests outside of academics..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) =>
                          handleNestedInputChange('socialLinks', 'linkedin', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub Profile (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks.github}
                        onChange={(e) =>
                          handleNestedInputChange('socialLinks', 'github', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How did you hear about Ajira Digital KiNaP Club?
                    </label>
                    <input
                      type="text"
                      value={formData.hearAboutUs}
                      onChange={(e) => handleInputChange('hearAboutUs', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Social media, friend, university announcement, website, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anything else you'd like us to know?
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Share anything else that might help us understand you better..."
                    />
                  </div>
                </div>
              )}



              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="text-sm text-gray-500">
                  Step {currentStep} of 4
                </div>

                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Join the Club!</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinTeamForm;
