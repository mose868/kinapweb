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
  Calendar,
  Tag,
  Archive,
  Upload,
  Clock,
  BarChart3,
  Loader2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Megaphone,
  TrendingUp
} from 'lucide-react';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UpdatesAdmin = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    authorEmail: '',
    category: 'General',
    tags: [],
    featured: false,
    priority: 'Medium',
    status: 'Draft',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    images: [],
    eventDetails: {
      eventDate: '',
      location: '',
      registrationLink: '',
      capacity: ''
    },
    seoMeta: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  // Fetch updates for admin
  const { data: updatesData, isLoading } = useQuery(
    ['adminUpdates', selectedStatus, selectedCategory],
    async () => {
      let url = `${BASEURL}/updates/admin?limit=50`;
      
      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }
      
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }

      const response = await axios.get(url);
      return response.data;
    }
  );

  // Fetch update statistics
  const { data: updateStats } = useQuery(
    'updateStats',
    async () => {
      const response = await axios.get(`${BASEURL}/updates/stats/overview`);
      return response.data;
    }
  );

  // Create/Update update mutation
  const saveUpdateMutation = useMutation(
    async (data) => {
      if (editingUpdate) {
        const response = await axios.put(`${BASEURL}/updates/${editingUpdate._id}`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com'
        });
        return response.data;
      } else {
        const response = await axios.post(`${BASEURL}/updates`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com'
        });
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminUpdates');
        queryClient.invalidateQueries('updateStats');
        setMessage(editingUpdate ? 'Update saved successfully!' : 'Update created successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to save update');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Delete update mutation
  const deleteUpdateMutation = useMutation(
    async (id) => {
      const response = await axios.delete(`${BASEURL}/updates/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminUpdates');
        queryClient.invalidateQueries('updateStats');
        setMessage('Update deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to delete update');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Publish update mutation
  const publishUpdateMutation = useMutation(
    async (id) => {
      const response = await axios.patch(`${BASEURL}/updates/${id}/publish`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminUpdates');
        queryClient.invalidateQueries('updateStats');
        setMessage('Update published successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Archive update mutation
  const archiveUpdateMutation = useMutation(
    async (id) => {
      const response = await axios.patch(`${BASEURL}/updates/${id}/archive`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminUpdates');
        queryClient.invalidateQueries('updateStats');
        setMessage('Update archived successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation(
    async (id) => {
      const response = await axios.patch(`${BASEURL}/updates/${id}/feature`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminUpdates');
        queryClient.invalidateQueries('updateStats');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      authorEmail: '',
      category: 'General',
      tags: [],
      featured: false,
      priority: 'Medium',
      status: 'Draft',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      images: [],
      eventDetails: {
        eventDate: '',
        location: '',
        registrationLink: '',
        capacity: ''
      },
      seoMeta: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      }
    });
    setEditingUpdate(null);
    setShowForm(false);
  };

  const handleEdit = (update) => {
    setFormData({
      ...update,
      publishDate: update.publishDate ? new Date(update.publishDate).toISOString().split('T')[0] : '',
      expiryDate: update.expiryDate ? new Date(update.expiryDate).toISOString().split('T')[0] : '',
      eventDetails: update.eventDetails || {
        eventDate: '',
        location: '',
        registrationLink: '',
        capacity: ''
      },
      seoMeta: update.seoMeta || {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      }
    });
    setEditingUpdate(update);
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
    if (fieldName === 'tags' || fieldName === 'keywords') {
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
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB');
          reject('File too large');
          return;
        }

        if (!file.type.startsWith('image/')) {
          alert('Please select valid image files');
          reject('Invalid file type');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const images = await Promise.all(imagePromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process date fields
    const processedData = {
      ...formData,
      publishDate: formData.publishDate ? new Date(formData.publishDate) : new Date(),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
      eventDetails: {
        ...formData.eventDetails,
        eventDate: formData.eventDetails.eventDate ? new Date(formData.eventDetails.eventDate) : null,
        capacity: formData.eventDetails.capacity ? parseInt(formData.eventDetails.capacity) : null
      }
    };

    saveUpdateMutation.mutate(processedData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      deleteUpdateMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'text-green-600 bg-green-100';
      case 'Draft': return 'text-yellow-600 bg-yellow-100';
      case 'Archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-blue-600 bg-blue-100';
      case 'Low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Announcement': return <Megaphone className="w-4 h-4" />;
      case 'Event': return <Calendar className="w-4 h-4" />;
      case 'Achievement': return <TrendingUp className="w-4 h-4" />;
      case 'Training': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-ajira-primary">Club Updates Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90"
          >
            <Plus className="w-5 h-5" />
            <span>Create Update</span>
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

        {/* Update Statistics */}
        {updateStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-ajira-primary/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-ajira-primary" />
                <div>
                  <p className="text-sm text-gray-600">Total Updates</p>
                  <p className="text-2xl font-bold text-ajira-primary">{updateStats.totalUpdates}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Eye className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">{updateStats.publishedUpdates}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-600">{updateStats.draftUpdates}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-purple-600">{updateStats.featuredUpdates}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          >
            <option value="all">All Categories</option>
            <option value="Announcement">Announcement</option>
            <option value="Event">Event</option>
            <option value="Achievement">Achievement</option>
            <option value="Training">Training</option>
            <option value="Partnership">Partnership</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingUpdate ? 'Edit Update' : 'Create New Update'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
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
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                </div>

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
                    <option value="Announcement">Announcement</option>
                    <option value="Event">Event</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Training">Training</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent"
                  />
                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Preview ${index}`} 
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-ajira-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Update</span>
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
                  disabled={saveUpdateMutation.isLoading}
                  className="px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2"
                >
                  {saveUpdateMutation.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingUpdate ? 'Update' : 'Create'} Update</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Updates List */}
        <div className="space-y-4">
          {updatesData?.updates?.map((update) => (
            <div key={update._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getCategoryIcon(update.category)}
                    <h3 className="text-lg font-semibold text-gray-900">{update.title}</h3>
                    {update.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{update.excerpt}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                      {update.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(update.publishDate).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{update.engagement?.views || 0} views</span>
                    </span>
                    <span>By {update.author}</span>
                  </div>
                  
                  {update.tags && update.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {update.tags.map((tag, index) => (
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
                    onClick={() => handleEdit(update)}
                    className="text-ajira-primary hover:text-ajira-primary/80"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  {update.status === 'Draft' && (
                    <button
                      onClick={() => publishUpdateMutation.mutate(update._id)}
                      className="text-green-600 hover:text-green-800"
                      title="Publish"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  
                  {update.status === 'Published' && (
                    <button
                      onClick={() => archiveUpdateMutation.mutate(update._id)}
                      className="text-gray-600 hover:text-gray-800"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => toggleFeaturedMutation.mutate(update._id)}
                    className={`${update.featured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                    title="Toggle Featured"
                  >
                    <Star className={`w-4 h-4 ${update.featured ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(update._id)}
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

        {updatesData?.updates?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No updates yet</h3>
            <p className="text-gray-600 mb-4">Start sharing updates with your community.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90"
            >
              Create First Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatesAdmin; 