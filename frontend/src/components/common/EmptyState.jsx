import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ 
  title = "No items found", 
  message = "Try tweaking your search keywords or resetting filters.",
  actionButton = null 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-subtle my-8">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
        <FiInbox className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 mb-6 leading-relaxed">{message}</p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
