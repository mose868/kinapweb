import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  Star,
  ThumbsUp,
  ThumbsDown,
  Search,
  HelpCircle,
  BarChart3,
  Loader2, 
  CheckCircle, 
  AlertCircle,
  FileQuestion,
  Users,
  TrendingUp
} from 'lucide-react';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FAQAdmin = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPublished, setSelectedPublished] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    tags: [],
    priority: 0,
    isPublished: true,
    isPopular: false,
    relatedFAQs: [],
    seoMeta: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    displayOrder: 0
  });

  // Fetch FAQs for admin
  const { data: faqsData, isLoading } = useQuery(
    ['adminFAQs', selectedCategory, selectedPublished],
    async () => {
      let url = `${BASEURL}/faq/admin?limit=100`;
      
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      
      if (selectedPublished !== 'all') {
        url += `&isPublished=${selectedPublished}`;
      }

      const response = await axios.get(url);
      return response.data;
    }
  );

  // Fetch FAQ statistics
  const { data: faqStats } = useQuery(
    'faqStats',
    async () => {
      const response = await axios.get(`${BASEURL}/faq/stats/overview`);
      return response.data;
    }
  );

  // Create/Update FAQ mutation
  const saveFAQMutation = useMutation(
    async (data) => {
      if (editingFAQ) {
        const response = await axios.put(`${BASEURL}/faq/${editingFAQ._id}`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com'
        });
        return response.data;
      } else {
        const response = await axios.post(`${BASEURL}/faq`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com'
        });
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminFAQs');
        queryClient.invalidateQueries('faqStats');
        setMessage(editingFAQ ? 'FAQ updated successfully!' : 'FAQ created successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to save FAQ');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Delete FAQ mutation
  const deleteFAQMutation = useMutation(
    async (id) => {
      const response = await axios.delete(`${BASEURL}/faq/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminFAQs');
        queryClient.invalidateQueries('faqStats');
        setMessage('FAQ deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to delete FAQ');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Toggle publish status mutation
  const togglePublishMutation = useMutation(
    async (id) => {
      const response = await axios.patch(`${BASEURL}/faq/${id}/publish`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminFAQs');
        queryClient.invalidateQueries('faqStats');
      }
    }
  );

  // Toggle popular status mutation
  const togglePopularMutation = useMutation(
    async (id) => {
      const response = await axios.patch(`${BASEURL}/faq/${id}/popular`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminFAQs');
        queryClient.invalidateQueries('faqStats');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      tags: [],
      priority: 0,
      isPublished: true,
      isPopular: false,
      relatedFAQs: [],
      seoMeta: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      },
      displayOrder: 0
    });
    setEditingFAQ(null);
    setShowForm(false);
  };

  const handleEdit = (faq) => {
    setFormData({
      ...faq,
      tags: faq.tags || [],
      relatedFAQs: faq.relatedFAQs?.map(related => related._id) || [],
      seoMeta: faq.seoMeta || {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      }
    });
    setEditingFAQ(faq);
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
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
      }));
    }
  };

  const handleArrayChange = (value, fieldName) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    if (fieldName === 'keywords') {
      setFormData(prev => ({
        ...prev,
        seoMeta: {
          ...prev.seoMeta,
          keywords: array
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: array
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveFAQMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      deleteFAQMutation.mutate(id);
    }
  };

  const getPublishStatusColor = (isPublished) => {
    return isPublished ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority) => {
    if (priority >= 5) return 'text-red-600 bg-red-100';
    if (priority >= 3) return 'text-orange-600 bg-orange-100';
    if (priority >= 1) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  // Filter FAQs based on search query
  const filteredFAQs = faqsData?.faqs?.filter(faq => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(query) ||
           faq.answer.toLowerCase().includes(query) ||
           faq.tags.some(tag => tag.toLowerCase().includes(query));
  }) || [];

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
          <h1 className="text-3xl font-bold text-ajira-primary">FAQ Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90"
          >
            <Plus className="w-5 h-5" />
            <span>Add FAQ</span>
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

        {/* FAQ Statistics */}
        {faqStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-ajira-primary/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileQuestion className="w-8 h-8 text-ajira-primary" />
                <div>
                  <p className="text-sm text-gray-600">Total FAQs</p>
                  <p className="text-2xl font-bold text-ajira-primary">{faqStats.totalFAQs}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Eye className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">{faqStats.publishedFAQs}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Popular</p>
                  <p className="text-2xl font-bold text-purple-600">{faqStats.popularFAQs}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-blue-600">{faqStats.totalViews}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          >
            <option value="all">All Categories</option>
            <option value="General">General</option>
            <option value="Membership">Membership</option>
            <option value="Events">Events</option>
            <option value="Training">Training</option>
            <option value="Technical">Technical</option>
            <option value="Certification">Certification</option>
            <option value="Career">Career</option>
            <option value="Payment">Payment</option>
          </select>

          <select
            value={selectedPublished}
            onChange={(e) => setSelectedPublished(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          >
            <option value="all">All Status</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>

          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer *
                </label>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  >
                    <option value="General">General</option>
                    <option value="Membership">Membership</option>
                    <option value="Events">Events</option>
                    <option value="Training">Training</option>
                    <option value="Technical">Technical</option>
                    <option value="Certification">Certification</option>
                    <option value="Career">Career</option>
                    <option value="Payment">Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority (0-10)
                  </label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayChange(e.target.value, 'tags')}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="w-5 h-5 text-ajira-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                    className="w-5 h-5 text-ajira-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Popular FAQ</span>
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
                  disabled={saveFAQMutation.isLoading}
                  className="px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2"
                >
                  {saveFAQMutation.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingFAQ ? 'Update' : 'Create'} FAQ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    {faq.isPopular && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-3">{faq.answer}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPublishStatusColor(faq.isPublished)}`}>
                      {faq.isPublished ? 'Published' : 'Unpublished'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(faq.priority)}`}>
                      Priority: {faq.priority}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{faq.viewCount} views</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span>{faq.helpfulCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <span>{faq.notHelpfulCount}</span>
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {faq.category}
                    </span>
                  </div>
                  
                  {faq.tags && faq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {faq.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="text-ajira-primary hover:text-ajira-primary/80"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => togglePublishMutation.mutate(faq._id)}
                    className={`${faq.isPublished ? 'text-green-600' : 'text-gray-400'} hover:text-green-800`}
                    title="Toggle Publish"
                  >
                    {faq.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => togglePopularMutation.mutate(faq._id)}
                    className={`${faq.isPopular ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                    title="Toggle Popular"
                  >
                    <Star className={`w-4 h-4 ${faq.isPopular ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'No FAQs match your search criteria.' : 'Start building your FAQ section by adding the first question.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90"
              >
                Add First FAQ
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQAdmin; 