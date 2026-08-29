import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getBadgeStyle = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'lost':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'found':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'claimed':
      case 'pending':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'returned':
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(
        status
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
