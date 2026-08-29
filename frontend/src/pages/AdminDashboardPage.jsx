import React, { useState, useEffect } from 'react';
import { itemService } from '../services/itemService';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  FiShield, 
  FiTrash2, 
  FiCheck 
} from 'react-icons/fi';

const AdminDashboardPage = () => {
  const [activeSection, setActiveSection] = useState('claims');
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = {
    totalUsers: 2480,
    totalLost: items.filter((i) => i.status === 'Lost').length,
    totalFound: items.filter((i) => i.status === 'Found').length,
    pendingClaims: claims.filter((c) => c.status === 'Pending').length,
    returnedItems: items.filter((i) => i.status === 'Returned').length,
  };

  const handleApproveClaim = async (claimId) => {
    try {
      await itemService.updateClaimStatus(claimId, 'Approved');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to approve claim.');
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      await itemService.updateClaimStatus(claimId, 'Rejected');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to reject claim.');
    }
  };

  const handleMarkReturned = async (itemId) => {
    try {
      await itemService.updateItem(itemId, { status: 'Returned' });
      fetchData();
    } catch (err) {
      alert('Failed to mark item returned.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item report?')) return;
    try {
      await itemService.deleteItem(itemId);
      fetchData();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <FiShield className="w-4 h-4" />
            <span>Campus Security Control Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Admin Portal & Claim Moderation</h1>
          <p className="text-sm text-slate-400 mt-1">Manage listings, approve owner claims, and monitor return metrics.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Users</span>
          <p className="text-xl font-extrabold text-slate-900">{metrics.totalUsers}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Lost Items</span>
          <p className="text-xl font-extrabold text-amber-600">{metrics.totalLost}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Found Items</span>
          <p className="text-xl font-extrabold text-blue-600">{metrics.totalFound}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Pending Claims</span>
          <p className="text-xl font-extrabold text-purple-600">{metrics.pendingClaims}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Returned Items</span>
          <p className="text-xl font-extrabold text-emerald-600">{metrics.returnedItems}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex space-x-8">
        {['claims', 'items', 'users'].map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`pb-3 text-sm font-bold capitalize border-b-2 transition-all ${
              activeSection === sec
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {sec} Management
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading admin records..." />
      ) : (
        <>
          {/* Claims Section */}
          {activeSection === 'claims' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                      <th className="p-4">Claim ID</th>
                      <th className="p-4">Item ID</th>
                      <th className="p-4">Claim Reason</th>
                      <th className="p-4">Verification Answer</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {claims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">#{claim.id}</td>
                        <td className="p-4 font-semibold text-blue-600">Item #{claim.item_id}</td>
                        <td className="p-4 max-w-xs truncate">{claim.reason}</td>
                        <td className="p-4 max-w-xs truncate text-purple-700 font-semibold">"{claim.verification_answer}"</td>
                        <td className="p-4"><StatusBadge status={claim.status} /></td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedClaim(claim);
                              setIsModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Items Section */}
          {activeSection === 'items' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{item.item_name}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.location}</td>
                        <td className="p-4">{item.date}</td>
                        <td className="p-4"><StatusBadge status={item.status} /></td>
                        <td className="p-4 text-right space-x-2">
                          {item.status !== 'Returned' && (
                            <button
                              onClick={() => handleMarkReturned(item.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            >
                              Mark Returned
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 text-xs text-slate-600">
              <p className="font-semibold text-slate-900 mb-2">Registered Campus Users (2,480 Active)</p>
              <p>User account directory and authorization roles active.</p>
            </div>
          )}
        </>
      )}

      {/* Review Claim Modal */}
      {selectedClaim && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Review Claim #${selectedClaim.id}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div>
              <span className="font-bold block text-slate-900">Reason for Claim:</span>
              <p>{selectedClaim.reason}</p>
            </div>
            <div>
              <span className="font-bold block text-slate-900">Ownership Proof Details:</span>
              <p>{selectedClaim.ownership_details}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-900 font-medium">
              <span className="font-bold block">Verification Answer Provided:</span>
              <p className="italic font-bold text-sm">"{selectedClaim.verification_answer}"</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleApproveClaim(selectedClaim.id)}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Approve Claim
              </button>
              <button
                onClick={() => handleRejectClaim(selectedClaim.id)}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700"
              >
                Reject Claim
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default AdminDashboardPage;
