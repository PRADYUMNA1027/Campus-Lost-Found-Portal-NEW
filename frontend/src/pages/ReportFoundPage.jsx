import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, LOCATIONS } from '../data/mockData';
import { itemService } from '../services/itemService';
import ImageUpload from '../components/items/ImageUpload';
import { FiCheckCircle, FiAlertCircle, FiSend } from 'react-icons/fi';

const ReportFoundPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    category: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    storage_location: 'Campus Security Office - Desk 1',
    verification_question: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (file) => {
    setImageFile(file);
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.item_name.trim()) newErrors.item_name = 'Item name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.category) newErrors.category = 'Please select a category.';
    if (!formData.location) newErrors.location = 'Please select or enter a location.';
    if (!formData.date) newErrors.date = 'Date found is required.';
    if (!formData.storage_location.trim()) newErrors.storage_location = 'Storage location is required.';
    if (!formData.verification_question.trim()) newErrors.verification_question = 'Verification question is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Execute POST /api/items/found
      await itemService.createFoundItem(formData, imageFile);
      setIsSubmitting(false);
      setSuccessMessage('Found item reported successfully!');
      
      // Navigate to /found-items where latest items will be fetched from backend
      setTimeout(() => {
        navigate('/found-items');
      }, 1200);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      const msg = err.response?.data?.detail || 'Failed to publish found item report. Please check backend connection.';
      setErrors({ form: msg });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a Found Item
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Turn in a found item or report it so the rightful owner can safely claim it.
          </p>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center space-x-2 animate-in fade-in">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Global Error Banner */}
        {errors.form && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold flex items-center space-x-2 animate-in fade-in">
            <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="e.g. iPhone 14 Pro or Brown Leather Wallet"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                errors.item_name ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-blue-500 bg-slate-50/50'
              }`}
            />
            {errors.item_name && <p className="text-xs text-red-600 font-medium">{errors.item_name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe general condition without revealing secret verification details..."
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                errors.description ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-blue-500 bg-slate-50/50'
              }`}
            />
            {errors.description && <p className="text-xs text-red-600 font-medium">{errors.description}</p>}
          </div>

          {/* Category & Location Found Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                  errors.category ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-blue-500 bg-slate-50/50'
                }`}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-600 font-medium">{errors.category}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Location Found <span className="text-red-500">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                  errors.location ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-blue-500 bg-slate-50/50'
                }`}
              >
                <option value="">Select Campus Location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && <p className="text-xs text-red-600 font-medium">{errors.location}</p>}
            </div>

          </div>

          {/* Storage Location & Verification Prompt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Storage / Collection Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="storage_location"
                value={formData.storage_location}
                onChange={handleChange}
                placeholder="e.g. Student Union Desk, Security Office"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                  errors.storage_location ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-blue-500 bg-slate-50/50'
                }`}
              />
              {errors.storage_location && <p className="text-xs text-red-600 font-medium">{errors.storage_location}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-purple-900">
                Verification Question <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="verification_question"
                value={formData.verification_question}
                onChange={handleChange}
                placeholder="e.g. What wallpaper was on the phone?"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                  errors.verification_question ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-purple-200 focus:ring-purple-500 bg-purple-50/30'
                }`}
              />
              {errors.verification_question && <p className="text-xs text-red-600 font-medium">{errors.verification_question}</p>}
            </div>

          </div>

          {/* Date & Time Found */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Date Found <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Time Found
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Image Upload Component - Strictly empty on load */}
          <ImageUpload onImageChange={handleImageChange} error={errors.image} />

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <FiSend className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing Report...' : 'Publish Found Item Report'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportFoundPage;
