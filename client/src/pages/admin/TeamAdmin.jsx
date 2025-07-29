import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Users,
  UserCheck,
  Award,
  Eye,
  EyeOff
} from 'lucide-react';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TeamAdmin = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    title: '',
    department: '',
    bio: '',
    image: '',
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    skills: [],
    experience: '',
    achievements: [],
    education: {
      degree: '',
      institution: '',
      graduationYear: ''
    },
    contact: {
      phone: '',
      location: ''
    },
    socialMedia: {
      twitter: '',
      instagram: '',
      facebook: ''
    },
    isFounder: false,
    isLeadership: false,
    displayOrder: 0
  });

  // Fetch team members
  const { data: teamMembers, isLoading } = useQuery(
    'teamMembers',
    async () => {
      const response = await axios.get(`${BASEURL}/team`);
      return response.data;
    }
  );

  // Fetch team stats
  const { data: teamStats } = useQuery(
    'teamStats',
    async () => {
      const response = await axios.get(`${BASEURL}/team/stats/overview`);
      return response.data;
    }
  );

  // Create/Update team member mutation
  const saveTeamMemberMutation = useMutation(
    async (data) => {
      if (editingMember) {
        const response = await axios.put(`${BASEURL}/team/${editingMember._id}`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com'
        });
        return response.data;
      } else {
        const response = await axios.post(`${BASEURL}/team`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com'
        });
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teamMembers');
        queryClient.invalidateQueries('teamStats');
        setMessage(editingMember ? 'Team member updated successfully!' : 'Team member created successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to save team member');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Delete team member mutation
  const deleteTeamMemberMutation = useMutation(
    async (id) => {
      const response = await axios.delete(`${BASEURL}/team/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teamMembers');
        queryClient.invalidateQueries('teamStats');
        setMessage('Team member deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to delete team member');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Toggle active status mutation
  const toggleActiveMutation = useMutation(
    async ({ id, isActive }) => {
      const endpoint = isActive ? 'deactivate' : 'activate';
      const response = await axios.patch(`${BASEURL}/team/${id}/${endpoint}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teamMembers');
        queryClient.invalidateQueries('teamStats');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      title: '',
      department: '',
      bio: '',
      image: '',
      email: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      skills: [],
      experience: '',
      achievements: [],
      education: { degree: '', institution: '', graduationYear: '' },
      contact: { phone: '', location: '' },
      socialMedia: { twitter: '', instagram: '', facebook: '' },
      isFounder: false,
      isLeadership: false,
      displayOrder: 0
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const handleEdit = (member) => {
    setFormData({
      ...member,
      skills: member.skills || [],
      achievements: member.achievements || [],
      education: member.education || { degree: '', institution: '', graduationYear: '' },
      contact: member.contact || { phone: '', location: '' },
      socialMedia: member.socialMedia || { twitter: '', instagram: '', facebook: '' }
    });
    setEditingMember(member);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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
        [name]: type === 'checkbox' ? checked : value
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTeamMemberMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      deleteTeamMemberMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-ajira-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-ajira-primary">Team Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90"
          >
            <Plus className="w-5 h-5" />
            <span>Add Team Member</span>
          </button>
        </div>

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

        {/* Team Stats */}
        {teamStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-ajira-primary/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-ajira-primary" />
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-ajira-primary">{teamStats.totalMembers}</p>
                </div>
              </div>
            </div>
            <div className="bg-ajira-accent/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-ajira-accent" />
                <div>
                  <p className="text-sm text-gray-600">Founders</p>
                  <p className="text-2xl font-bold text-ajira-accent">{teamStats.founders}</p>
                </div>
              </div>
            </div>
            <div className="bg-ajira-secondary/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-8 h-8 text-ajira-secondary" />
                <div>
                  <p className="text-sm text-gray-600">Leadership</p>
                  <p className="text-2xl font-bold text-ajira-secondary">{teamStats.leadership}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-600">{teamStats.departments?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Founder, Developer, Designer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Job title/position"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Management">Management</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
                {formData.image && (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="mt-2 w-20 h-20 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={(e) => handleArrayChange(e.target.value, 'skills')}
                    placeholder="React, Node.js, Design (separate with commas)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="5+ years"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isFounder"
                    checked={formData.isFounder}
                    onChange={handleChange}
                    className="w-5 h-5 text-ajira-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Founder</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isLeadership"
                    checked={formData.isLeadership}
                    onChange={handleChange}
                    className="w-5 h-5 text-ajira-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Leadership Team</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveTeamMemberMutation.isLoading}
                  className="px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2"
                >
                  {saveTeamMemberMutation.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingMember ? 'Update' : 'Create'} Team Member</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Team Members List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamMembers?.map((member) => (
            <div key={member._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={member.image || '/images/default-avatar.png'}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <div className="flex items-center space-x-2">
                      {member.isFounder && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Founder
                        </span>
                      )}
                      {member.isLeadership && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Leadership
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-ajira-primary font-medium">{member.role}</p>
                  {member.title && (
                    <p className="text-sm text-gray-600">{member.title}</p>
                  )}
                  {member.department && (
                    <p className="text-sm text-gray-500">{member.department}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{member.bio}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-ajira-primary hover:text-ajira-primary/80"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActiveMutation.mutate({ id: member._id, isActive: member.isActive })}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {member.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teamMembers?.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-600 mb-4">Start building your team by adding the first member.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90"
            >
              Add First Team Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamAdmin; 