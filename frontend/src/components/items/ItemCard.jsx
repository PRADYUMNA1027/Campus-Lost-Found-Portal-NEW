import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { FiMapPin, FiCalendar, FiArrowRight, FiBox } from 'react-icons/fi';

const ItemCard = ({ item }) => {
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const showImage = item.image_url && !imgError;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden group">
      
      {/* Card Image Container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {showImage ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
            <FiBox className="w-10 h-10 mb-1 opacity-50" />
            <span className="text-xs font-medium text-slate-400">No Photo Uploaded</span>
          </div>
        )}

        {/* Status Badge Tag Overlay */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={item.status} />
        </div>

        {/* Category Tag Overlay */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/75 backdrop-blur-md text-white">
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.item_name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Meta Info: Location & Date */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center space-x-2">
            <FiCalendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{item.date} {item.time ? `at ${item.time}` : ''}</span>
          </div>
        </div>

        {/* Card Footer CTA */}
        <div className="pt-2">
          <Link
            to={`/items/${item.id}`}
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all duration-150 group/btn"
          >
            <span>View Details</span>
            <FiArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ItemCard;
