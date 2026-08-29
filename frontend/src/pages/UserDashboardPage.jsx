import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemService } from '../services/itemService';
import ItemCard from '../components/items/ItemCard';
import StatusBadge from '../components/common/StatusBadge';
import NotificationCard from '../components/notifications/NotificationCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  FiPlusCircle, 
  FiBox, 
  FiCheckCircle, 
  FiCheckSquare, 
  FiFileText, 
  FiShield 
} from 'react-icons/fi';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('lost');
  
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedItems, fetchedClaims] = await Promise.all([
          itemService.getItems(),
          itemService.getClaims()
        ]);
        setItems(fetchedItems || []);
        setClaims(fetchedClaims || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const myLostItems = items.filter((item) => item.status === 'Lost');
  const myFoundItems = items.filter((item) => item.status === 'Found');

  const stats = {
    reported: myLostItems.length,
    found: myFoundItems.length,
    claims: claims.length,
    returned: items.filter((item) => item.status === 'Returned').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            {user?.role === 'admin' && (
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 flex items-center">
                <FiShield className="mr-1" /> Admin
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your reported belongings, active ownership claims, and status updates.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/report-lost"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors flex items-center space-x-1.5"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>Report Lost</span>
          </Link>

          <Link
            to="/report-found"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all flex items-center space-x-1.5"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>Report Found</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lost Reported</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FiBox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.reported}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Found Items</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FiCheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.found}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Claims</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FiFileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.claims}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items Returned</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FiCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.returned}</p>
        </div>

      </div>

      {/* Tabs Section */}
      {loading ? (
        <LoadingSpinner message="Loading user dashboard..." />
      ) : (
        <div className="space-y-6">
          <div className="border-b border-slate-200 flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('lost')}
              className={`pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'lost'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              My Lost Reports ({myLostItems.length})
            </button>

            <button
              onClick={() => setActiveTab('found')}
              className={`pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'found'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              My Found Reports ({myFoundItems.length})
            </button>

            <button
              onClick={() => setActiveTab('claims')}
              className={`pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'claims'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              My Claims ({claims.length})
            </button>
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'lost' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myLostItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {activeTab === 'found' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myFoundItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-subtle space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">{claim.item_name || `Item #${claim.item_id}`}</h3>
                    <StatusBadge status={claim.status} />
                  </div>
                  <p className="text-xs text-slate-600"><strong>Reason:</strong> {claim.reason}</p>
                  <p className="text-xs text-slate-600"><strong>Verification Answer:</strong> "{claim.verification_answer}"</p>
                  <div className="text-[11px] text-slate-400">Submitted on {new Date(claim.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default UserDashboardPage;
