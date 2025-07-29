import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Eye, 
  Archive, 
  Trash2,
  Search,
  Filter,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  User,
  Calendar
} from 'lucide-react';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContactAdmin = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Fetch contact messages
  const { data: contactsData, isLoading } = useQuery(
    ['adminContacts', selectedStatus, selectedCategory, selectedPriority],
    async () => {
      let url = `${BASEURL}/contact/admin?limit=100`;
      
      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }
      
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      
      if (selectedPriority !== 'all') {
        url += `&priority=${selectedPriority}`;
      }

      const response = await axios.get(url);
      return response.data;
    }
  );

  // Fetch contact statistics
  const { data: contactStats } = useQuery(
    'contactStats',
    async () => {
      const response = await axios.get(`${BASEURL}/contact/stats/overview`);
      return response.data;
    }
  );

  // Update status mutation
  const updateStatusMutation = useMutation(
    async ({ id, status, responseNotes, assignedTo }) => {
      const response = await axios.patch(`${BASEURL}/contact/${id}/status`, {
        status,
        responseNotes,
        assignedTo
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminContacts');
        queryClient.invalidateQueries('contactStats');
        setMessage('Contact status updated successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to update status');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Archive contact mutation
  const archiveContactMutation = useMutation(
    async (id) => {
      const response = await axios.patch(`${BASEURL}/contact/${id}/archive`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminContacts');
        queryClient.invalidateQueries('contactStats');
        setMessage('Contact archived successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  // Delete contact mutation
  const deleteContactMutation = useMutation(
    async (id) => {
      const response = await axios.delete(`${BASEURL}/contact/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminContacts');
        queryClient.invalidateQueries('contactStats');
        setMessage('Contact deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  );

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setShowDetails(true);
  };

  const handleStatusUpdate = (contact, newStatus) => {
    updateStatusMutation.mutate({
      id: contact._id,
      status: newStatus,
      assignedTo: 'admin@ajirakinap.com'
    });
  };

  const handleArchive = (id) => {
    if (window.confirm('Are you sure you want to archive this contact message?')) {
      archiveContactMutation.mutate(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact message? This action cannot be undone.')) {
      deleteContactMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Responded': return 'text-green-600 bg-green-100';
      case 'Resolved': return 'text-green-700 bg-green-200';
      case 'Closed': return 'text-gray-600 bg-gray-100';
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
      case 'Technical Support': return <AlertCircle className="w-4 h-4" />;
      case 'Partnership': return <CheckCircle className="w-4 h-4" />;
      case 'Training': return <BarChart3 className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const openWhatsApp = (contact) => {
    const message = `Hi ${contact.name}, thank you for contacting Ajira Digital KiNaP Club regarding: ${contact.subject}`;
    const phoneNumber = contact.phone?.replace(/\D/g, '') || '254792343958';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openEmail = (contact) => {
    const subject = `Re: ${contact.subject}`;
    const body = `Hi ${contact.name},\n\nThank you for contacting Ajira Digital KiNaP Club.\n\nBest regards,\nAjira Digital Team`;
    const url = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  // Filter contacts based on search query
  const filteredContacts = contactsData?.contacts?.filter(contact => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return contact.name.toLowerCase().includes(query) ||
           contact.email.toLowerCase().includes(query) ||
           contact.subject.toLowerCase().includes(query) ||
           contact.message.toLowerCase().includes(query);
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
          <h1 className="text-3xl font-bold text-ajira-primary">Contact Messages</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredContacts.length} message{filteredContacts.length !== 1 ? 's' : ''}
            </span>
          </div>
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

        {/* Contact Statistics */}
        {contactStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-ajira-primary/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-8 h-8 text-ajira-primary" />
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-ajira-primary">{contactStats.totalMessages}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{contactStats.unreadMessages}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">New</p>
                  <p className="text-2xl font-bold text-yellow-600">{contactStats.newMessages}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{contactStats.resolvedMessages}</p>
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
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Responded">Responded</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          >
            <option value="all">All Categories</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Partnership">Partnership</option>
            <option value="Training">Training</option>
            <option value="Complaint">Complaint</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Contact Messages List */}
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div key={contact._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getCategoryIcon(contact.category)}
                    <h3 className="text-lg font-semibold text-gray-900">{contact.subject}</h3>
                    {!contact.isRead && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{contact.name}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </span>
                    {contact.phone && (
                      <span className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{contact.message}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                      {contact.priority}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {contact.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewDetails(contact)}
                    className="text-ajira-primary hover:text-ajira-primary/80"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => openEmail(contact)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Reply via Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  
                  {contact.phone && (
                    <button
                      onClick={() => openWhatsApp(contact)}
                      className="text-green-600 hover:text-green-800"
                      title="Reply via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}
                  
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusUpdate(contact, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Responded">Responded</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  
                  <button
                    onClick={() => handleArchive(contact._id)}
                    className="text-gray-600 hover:text-gray-800"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(contact._id)}
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

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contact messages found</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'No messages match your search criteria.' 
                : 'No contact messages have been received yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Contact Details Modal */}
      {showDetails && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedContact.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="font-medium text-gray-700">Category</label>
                    <p className="text-gray-900">{selectedContact.category}</p>
                  </div>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700">Subject</label>
                  <p className="text-gray-900">{selectedContact.subject}</p>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700">Message</label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <button
                    onClick={() => openEmail(selectedContact)}
                    className="bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </button>
                  
                  {selectedContact.phone && (
                    <button
                      onClick={() => openWhatsApp(selectedContact)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Reply via WhatsApp</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactAdmin; 