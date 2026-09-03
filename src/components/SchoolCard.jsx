import React from 'react';
import { Link } from 'react-router-dom';

const SchoolCard = ({ school }) => {
  const { id, name, address, overall_rating, photo_url, total_reviews } = school;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="h-40 bg-slate-100 relative overflow-hidden">
          <img
            src={photo_url || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800"}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 border border-slate-200">
            ★ {overall_rating ? Number(overall_rating).toFixed(1) : 'N/A'} / 5
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-900 text-base line-clamp-1">{name}</h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{address || 'Delhi NCR'}</p>
        </div>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <span className="text-[11px] text-slate-400 font-medium">
          {total_reviews || 0} reviews
        </span>
        <Link
          to={`/school/${id}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
};

export default SchoolCard;
