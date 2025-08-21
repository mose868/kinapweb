import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  features: string[];
  revisions: number;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServicePackage) => void;
  editingService?: ServicePackage | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingService
}) => {
  const [formData, setFormData] = useState<ServicePackage>({
    id: editingService?.id || '',
    name: editingService?.name || '',
    description: editingService?.description || '',
    price: editingService?.price || 50,
    deliveryTime: editingService?.deliveryTime || 7,
    features: editingService?.features || [''],
    revisions: editingService?.revisions || 2,
  });

  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0) {
      return;
    }

    const serviceToSave: ServicePackage = {
      ...formData,
      id: formData.id || Date.now().toString(),
      features: formData.features.filter(f => f.trim() !== '')
    };

    onSave(serviceToSave);
    onClose();
    
    // Reset form if creating new service
    if (!editingService) {
      setFormData({
        id: '',
        name: '',
        description: '',
        price: 50,
        deliveryTime: 7,
        features: [''],
        revisions: 2,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-ajira-primary">
              {editingService ? 'Edit Service Package' : 'Add Service Package'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                placeholder="e.g., Logo Design, Website Development"
                required
              />
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                placeholder="Describe what's included in this service package..."
                required
              />
            </div>

            {/* Price and Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time (Days) *
                </label>
                <input
                  type="number"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                  min="1"
                  max="365"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revisions Included
                </label>
                <select
                  value={formData.revisions}
                  onChange={(e) => setFormData(prev => ({ ...prev, revisions: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                >
                  <option value={0}>No revisions</option>
                  <option value={1}>1 revision</option>
                  <option value={2}>2 revisions</option>
                  <option value={3}>3 revisions</option>
                  <option value={5}>5 revisions</option>
                  <option value={999}>Unlimited revisions</option>
                </select>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features Included
              </label>
              
              {/* Existing Features */}
              <div className="space-y-2 mb-4">
                {formData.features.map((feature, index) => (
                  feature.trim() && (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                        {feature}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  )
                ))}
              </div>

              {/* Add New Feature */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                  placeholder="e.g., Source files included, Commercial license"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim() || !formData.description.trim() || formData.price <= 0}
                className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceModal;
