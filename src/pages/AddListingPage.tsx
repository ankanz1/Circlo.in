import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import apiService from '../services/api';
import { Upload, X, Plus, MapPin, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import CulturalVaultBadge from '../components/CulturalVaultBadge';
import LocationPicker from '../components/LocationPicker';
import ImageAIAnalysis from '../components/ImageAIAnalysis';

const AddListingPage: React.FC = () => {
  const { user } = useAuth();
  const { addListing } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    priceUnit: 'day' as 'day' | 'hour' | 'week',
    location: '',
    images: [] as string[],
    availability: [] as string[],
    isVaultItem: false,
    vaultStory: ''
  });

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any[]>([]);
  const [aiAnalysisKey, setAiAnalysisKey] = useState(0); // Key to force re-render

  const categories = [
    'Electronics',
    'Fashion',
    'Tools',
    'Sports',
    'Books',
    'Home & Garden',
    'Art & Culture',
    'Music',
    'Other'
  ];

  // Mock: is the user Aadhaar-verified?
  const isAadhaarVerified = true; // Set to true for demo; replace with real check later

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    // Use the actual uploaded images
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5) // Max 5 images
    }));
    
    // Reset AI analysis when new images are uploaded
    setAiAnalysisResults([]);
    setAiAnalysisKey(prev => prev + 1); // Force re-render of AI analysis component
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Reset AI analysis when images are removed
    setAiAnalysisResults([]);
    setAiAnalysisKey(prev => prev + 1);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleAIAnalysisComplete = (results: any[]) => {
    setAiAnalysisResults(results);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('price_unit', formData.priceUnit);
      formDataToSend.append('location', formData.location);
      
      if (formData.isVaultItem) {
        formDataToSend.append('is_vault_item', 'true');
        formDataToSend.append('vault_story', formData.vaultStory);
      }

      // Add images if available
      if (formData.images.length > 0) {
        // For now, we'll use placeholder images
        // In a real implementation, you'd upload actual files
        formDataToSend.append('images', JSON.stringify(formData.images));
      }

      const response = await apiService.createListing(formDataToSend);
      
      if (response.success) {
        // Refresh listings in the app context
        // This will trigger a re-fetch from the backend
        navigate('/dashboard');
      } else {
        throw new Error(response.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to list an item</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#FFD700] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="px-8 py-8 border-b border-gray-100 bg-gradient-to-r from-white to-yellow-50">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Item</h1>
            <p className="text-gray-600 text-lg">Share your items with the community and earn money</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Basic Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-3">
                  Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-sm hover:shadow-md"
                  placeholder="e.g., Canon EOS R5 Camera"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-sm hover:shadow-md"
                  placeholder="Describe your item, its condition, and any special features..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-3">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-sm hover:shadow-md"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Location *
                  </label>
                  <LocationPicker
                    value={formData.location}
                    onChange={loc => setFormData(prev => ({ ...prev, location: loc }))}
                  />
                </div>

                {/* Availability Calendar Add-on */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability (select all available dates)
                  </label>
                  <AvailabilityCalendar
                    selectedDates={formData.availability}
                    onChange={dates => setFormData(prev => ({ ...prev, availability: dates }))}
                  />
                </div>

                {/* Cultural Vault Add-on */}
                {isAadhaarVerified && (
                  <div className="mt-6">
                    <label className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        name="isVaultItem"
                        checked={formData.isVaultItem}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#FFD700] focus:ring-[#FFD700] border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-800 font-medium flex items-center gap-2">
                        <CulturalVaultBadge />
                        Mark as Cultural Vault item
                      </span>
                    </label>
                    {formData.isVaultItem && (
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Share the story or significance of this item (optional)
                        </label>
                        <textarea
                          name="vaultStory"
                          value={formData.vaultStory}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all"
                          placeholder="Describe the cultural or heritage value..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900">Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-3">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 font-bold">₹</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-sm hover:shadow-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="priceUnit" className="block text-sm font-medium text-gray-700 mb-3">
                    Per *
                  </label>
                  <select
                    id="priceUnit"
                    name="priceUnit"
                    required
                    value={formData.priceUnit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-sm hover:shadow-md"
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900">Photos</h2>
              
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive ? 'border-[#FFD700] bg-yellow-50' : 'border-gray-300 hover:border-[#FFD700] hover:bg-yellow-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Upload photos of your item</p>
                <p className="text-gray-600 mb-6">Drag and drop files here, or click to select</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-[#FFD700] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors cursor-pointer inline-block shadow-md hover:shadow-lg"
                >
                  Choose Files
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* AI Image Analysis */}
            {formData.images.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-8"
              >
                <ImageAIAnalysis
                  key={aiAnalysisKey} // Force re-render when images change
                  images={formData.images}
                  onAnalysisComplete={handleAIAnalysisComplete}
                  mode="pre_rental"
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-end space-x-4 pt-8 border-t border-gray-100"
            >
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#FFD700] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Publish Listing</span>
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddListingPage;