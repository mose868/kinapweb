import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { Save, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AboutUsAdmin = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission: '',
    vision: '',
    values: [],
    history: '',
    teamDescription: '',
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    stats: {
      membersCount: 0,
      projectsCompleted: 0,
      skillsOffered: 0,
      successStories: 0
    }
  });
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Fetch current About Us data
  const { data: aboutData, isLoading } = useQuery(
    'aboutUs',
    async () => {
      const response = await axios.get(`${BASEURL}/about-us`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          mission: data.mission || '',
          vision: data.vision || '',
          values: data.values || [],
          history: data.history || '',
          teamDescription: data.teamDescription || '',
          contactInfo: data.contactInfo || {
            email: '',
            phone: '',
            address: ''
          },
          socialLinks: data.socialLinks || {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
          },
          stats: data.stats || {
            membersCount: 0,
            projectsCompleted: 0,
            skillsOffered: 0,
            successStories: 0
          }
        });
      }
    }
  );

  // Update About Us mutation
  const updateAboutUsMutation = useMutation(
    async (data) => {
      const response = await axios.post(`${BASEURL}/about-us`, {
        ...data,
        lastUpdatedBy: 'admin@ajirakinap.com'
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('aboutUs');
        setMessage('About Us content updated successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to update About Us content');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (value, fieldName) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [fieldName]: array
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAboutUsMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-ajira-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-ajira-primary mb-8">
          About Us Content Management
        </h1>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                placeholder="About Ajira Digital Club..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                placeholder="Brief description of the organization..."
              />
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                placeholder="Our mission is..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Statement
              </label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                placeholder="Our vision is..."
              />
            </div>
          </div>

          {/* Values and History */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Core Values
              </label>
              <input
                type="text"
                value={formData.values.join(', ')}
                onChange={(e) => handleArrayChange(e.target.value, 'values')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                placeholder="Innovation, Excellence, Collaboration (separate with commas)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                History
              </label>
              <textarea
                name="history"
                value={formData.history}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                placeholder="Our journey and achievements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Description
              </label>
              <textarea
                name="teamDescription"
                value={formData.teamDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                placeholder="About our team..."
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  placeholder="kinapajira@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  placeholder="+254 792 343 958"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="contactInfo.address"
                  value={formData.contactInfo.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  placeholder="Nairobi, Kenya"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Members Count
                </label>
                <input
                  type="number"
                  name="stats.membersCount"
                  value={formData.stats.membersCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projects Completed
                </label>
                <input
                  type="number"
                  name="stats.projectsCompleted"
                  value={formData.stats.projectsCompleted}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Offered
                </label>
                <input
                  type="number"
                  name="stats.skillsOffered"
                  value={formData.stats.skillsOffered}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Stories
                </label>
                <input
                  type="number"
                  name="stats.successStories"
                  value={formData.stats.successStories}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateAboutUsMutation.isLoading}
              className="px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2"
            >
              {updateAboutUsMutation.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutUsAdmin; 