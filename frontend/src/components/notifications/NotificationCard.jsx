import React from 'react';
import { FiBell, FiCheck, FiInfo, FiCheckCircle } from 'react-icons/fi';

const NotificationCard = ({ notification, onMarkRead }) => {
  if (!notification) return null;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all ${
        notification.read_status
          ? 'bg-white border-slate-100 opacity-80'
          : 'bg-blue-50/40 border-blue-100 shadow-subtle'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            notification.read_status ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600 font-bold'
          }`}>
            <FiBell className="w-4 h-4" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">{notification.type}</span>
              {!notification.read_status && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{notification.message}</p>
            <span className="text-[10px] text-slate-400 font-medium block">
              {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {!notification.read_status && onMarkRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 shrink-0 px-2 py-1 rounded-lg hover:bg-blue-50"
          >
            Mark as Read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
