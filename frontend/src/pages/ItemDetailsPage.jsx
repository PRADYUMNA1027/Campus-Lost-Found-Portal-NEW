import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { 
  FiMapPin, 
  FiCalendar, 
  FiUser, 
  FiGift, 
  FiHelpCircle, 
  FiCheckSquare, 
  FiArrowLeft, 
  FiBox, 
  FiShield 
} from 'react-icons/fi';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await itemService.getItemById(id);
        if (data) {
          setItem(data);
        } else {
          setError('The requested item could not be found or may have been removed.');
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to fetch item details from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading item details..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!item) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Listings
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Large Image Display */}
          <div className="lg:col-span-6 bg-slate-100 p-6 sm:p-8 flex items-center justify-center min-h-[350px]">
            {item.image_url && !imgError ? (
              <img
                src={item.image_url}
                alt={item.item_name}
                className="max-h-[450px] w-auto object-contain rounded-2xl shadow-md"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-center p-12 text-slate-400">
                <FiBox className="w-16 h-16 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No Photograph Available</p>
              </div>
            )}
          </div>

          {/* Right Column: Item Information */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Status Badges */}
              <div className="flex items-center space-x-3">
                <StatusBadge status={item.status} />
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {item.category}
                </span>
              </div>

              {/* Item Name */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {item.item_name}
              </h1>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {/* Meta Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Location
                  </span>
                  <div className="flex items-center text-sm font-medium text-slate-800">
                    <FiMapPin className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Date & Time
                  </span>
                  <div className="flex items-center text-sm font-medium text-slate-800">
                    <FiCalendar className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                    <span>{item.date} {item.time ? `(${item.time})` : ''}</span>
                  </div>
                </div>

                {item.storage_location && (
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Current Storage Location
                    </span>
                    <div className="flex items-center text-sm font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <FiShield className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                      <span>{item.storage_location}</span>
                    </div>
                  </div>
                )}

                {item.reward && (
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Owner Reward
                    </span>
                    <div className="flex items-center text-sm font-bold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <FiGift className="w-4 h-4 mr-2 shrink-0" />
                      <span>{item.reward}</span>
                    </div>
                  </div>
                )}

                {item.verification_question && (
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block">
                      Owner Verification Prompt
                    </span>
                    <div className="flex items-start text-xs font-medium text-purple-900 bg-purple-50 p-3 rounded-xl border border-purple-100">
                      <FiHelpCircle className="w-4 h-4 text-purple-600 mr-2 shrink-0 mt-0.5" />
                      <span>"{item.verification_question}"</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Reporter Info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Reported By
                </span>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-slate-400" />
                    <span className="font-semibold text-slate-900">{item.reporter_name || 'Campus Student / Safety Staff'}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Verified Portal Listing</span>
                </div>
              </div>

            </div>

            {/* Bottom Claim Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              {item.status === 'Found' ? (
                <Link
                  to={`/items/${item.id}/claim`}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-center text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <FiCheckSquare className="w-5 h-5" />
                  <span>Submit Claim for this Item</span>
                </Link>
              ) : item.status === 'Lost' ? (
                <Link
                  to="/report-found"
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-center text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <FiCheckSquare className="w-5 h-5" />
                  <span>I Found This Item</span>
                </Link>
              ) : (
                <div className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-500 font-semibold text-center text-xs">
                  This item status is currently "{item.status}"
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
