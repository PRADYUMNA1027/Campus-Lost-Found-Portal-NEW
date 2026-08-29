import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiCheckCircle, FiAlertCircle, FiArrowLeft, FiSend, FiHelpCircle } from 'react-icons/fi';

const ClaimItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    reason: '',
    ownership_details: '',
    verification_answer: '',
    additional_info: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await itemService.getItemById(id);
        if (data) {
          setItem(data);
        } else {
          setError('Item not found.');
        }
      } catch (err) {
        setError('Failed to fetch item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.reason.trim()) newErrors.reason = 'Reason for claim is required.';
    if (!formData.ownership_details.trim()) newErrors.ownership_details = 'Ownership details are required.';
    if (item?.verification_question && !formData.verification_answer.trim()) {
      newErrors.verification_answer = 'Please answer the verification question.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await itemService.submitClaim(item.id, {
        reason: formData.reason,
        ownership_details: formData.ownership_details,
        verification_answer: formData.verification_answer,
      });

      setIsSubmitting(false);
      setSuccessMessage('Claim submitted successfully. Campus admin will verify your claim.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Claim submission error:', err);
      setIsSubmitting(false);
      const msg = err.response?.data?.detail || 'Failed to submit claim. Please try again.';
      setErrors({ form: msg });
    }
  };

  if (loading) return <LoadingSpinner message="Loading claim form..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!item) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Back link */}
      <div>
        <Link
          to={`/items/${item.id}`}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft className="mr-2" /> Back to Item Details
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            Ownership Verification Claim
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Submit Claim for "{item.item_name}"
          </h1>
          <p className="text-xs text-slate-500">
            Location Found: <span className="font-semibold text-slate-700">{item.location}</span>
          </p>
        </div>

        {/* Verification Question Callout Banner */}
        {item.verification_question && (
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-900 space-y-1 text-xs font-medium">
            <div className="flex items-center text-purple-700 font-bold text-sm">
              <FiHelpCircle className="mr-1.5" /> Verification Prompt from Finder
            </div>
            <p className="italic font-semibold">"{item.verification_question}"</p>
          </div>
        )}

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
          
          {/* Reason for Claim */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Reason for Claim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g. I dropped my laptop while studying in Central Library on Tuesday."
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                errors.reason ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-blue-500 bg-slate-50/50'
              }`}
            />
            {errors.reason && <p className="text-xs text-red-600 font-medium">{errors.reason}</p>}
          </div>

          {/* Ownership Details */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Ownership Details & Identifiers <span className="text-red-500">*</span>
            </label>
            <textarea
              name="ownership_details"
              rows={3}
              value={formData.ownership_details}
              onChange={handleChange}
              placeholder="Describe unique marks, serial numbers, case details, or custom stickers..."
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                errors.ownership_details ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-blue-500 bg-slate-50/50'
              }`}
            />
            {errors.ownership_details && <p className="text-xs text-red-600 font-medium">{errors.ownership_details}</p>}
          </div>

          {/* Verification Answer */}
          {item.verification_question && (
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-purple-900">
                Verification Answer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="verification_answer"
                value={formData.verification_answer}
                onChange={handleChange}
                placeholder="Answer the verification question above precisely..."
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                  errors.verification_answer ? 'border-red-300 focus:ring-red-500 bg-red-50/20' : 'border-purple-200 focus:ring-purple-500 bg-purple-50/30'
                }`}
              />
              {errors.verification_answer && <p className="text-xs text-red-600 font-medium">{errors.verification_answer}</p>}
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Additional Information <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
              placeholder="Any student ID number or receipt details..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <FiSend className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Claim...' : 'Submit Official Claim'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ClaimItemPage;
