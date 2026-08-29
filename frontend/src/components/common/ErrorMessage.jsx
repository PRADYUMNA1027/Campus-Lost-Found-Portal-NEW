import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const ErrorMessage = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto my-6">
      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
        <FiAlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-bold text-red-900">An Error Occurred</h4>
      <p className="text-xs text-red-700 mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-white border border-red-300 hover:bg-red-50 shadow-xs transition-colors"
        >
          <FiRefreshCw className="mr-1.5" /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
