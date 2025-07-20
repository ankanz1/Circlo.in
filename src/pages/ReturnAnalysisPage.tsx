import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, ArrowLeft, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import ImageAIAnalysis from '../components/ImageAIAnalysis';

const ReturnAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { listings } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [returnImages, setReturnImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#FFD700] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors shadow-md hover:shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setReturnImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setReturnImages(prev => prev.filter((_, i) => i !== index));
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

  const handleAnalysisComplete = (results: any[]) => {
    setAnalysisResults(results);
  };

  const handleSubmitReturn = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call to submit return
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or dashboard
      navigate('/dashboard', { 
        state: { 
          message: 'Return submitted successfully!',
          hasDamage: analysisResults.length > 0
        }
      });
    } catch (error) {
      console.error('Error submitting return:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasMajorDamage = analysisResults.some(d => d.severity === 'high');

  return (
    <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-[#FFD700] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Return Item</h1>
              <p className="text-gray-600">Upload photos for AI damage analysis</p>
            </div>
          </div>

          {/* Item Info */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center space-x-4">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{listing.title}</h2>
                <p className="text-gray-600">Owner: {listing.ownerName}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">₹{listing.price}</div>
                <div className="text-gray-500">per {listing.priceUnit}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Return Photos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Return Photos</h3>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive ? 'border-[#FFD700] bg-yellow-50' : 'border-gray-300 hover:border-[#FFD700] hover:bg-yellow-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Upload photos of the returned item</p>
                <p className="text-gray-600 mb-6">Take clear photos from multiple angles for accurate analysis</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="return-image-upload"
                />
                <label
                  htmlFor="return-image-upload"
                  className="bg-[#FFD700] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors cursor-pointer inline-block shadow-md hover:shadow-lg"
                >
                  Choose Photos
                </label>
              </div>

              {returnImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Photos ({returnImages.length}/5)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {returnImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Return ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <Upload className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">📸 Photo Guidelines</h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Take photos in good lighting</li>
                <li>• Capture all sides and angles of the item</li>
                <li>• Include close-ups of any visible damage</li>
                <li>• Ensure photos are clear and in focus</li>
                <li>• Upload 3-5 photos for best analysis</li>
              </ul>
            </div>
          </motion.div>

          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {returnImages.length > 0 ? (
              <ImageAIAnalysis
                images={returnImages}
                onAnalysisComplete={handleAnalysisComplete}
                mode="post_rental"
                baselineImages={listing.images}
              />
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready for Analysis</h4>
                <p className="text-gray-600">
                  Upload return photos to begin AI damage detection and comparison with baseline images.
                </p>
              </div>
            )}

            {/* Analysis Summary */}
            {analysisResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h4>
                
                {hasMajorDamage ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-900">Damage Detected</span>
                    </div>
                    <p className="text-red-700 text-sm">
                      Major damage has been detected. This may affect your deposit refund.
                    </p>
                  </div>
                ) : analysisResults.length > 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-900">Minor Issues Found</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Some minor wear and tear detected. This is normal for rental items.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">No Damage Detected</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Item appears to be in good condition. Full deposit refund expected.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {analysisResults.filter(d => d.severity === 'low').length}
                    </div>
                    <div className="text-sm text-green-700">Minor</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {analysisResults.filter(d => d.severity === 'medium').length}
                    </div>
                    <div className="text-sm text-yellow-700">Moderate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {analysisResults.filter(d => d.severity === 'high').length}
                    </div>
                    <div className="text-sm text-red-700">Major</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Submit Button */}
        {returnImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center pt-8"
          >
            <button
              onClick={handleSubmitReturn}
              disabled={isSubmitting}
              className="px-8 py-4 bg-[#FFD700] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Return...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Return</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReturnAnalysisPage; 