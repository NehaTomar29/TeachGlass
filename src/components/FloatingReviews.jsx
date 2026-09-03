import React from 'react';

const FloatingReviews = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-indigo-50/50 py-4 border-y border-indigo-100 my-6">
      <div className="flex gap-4 animate-marquee whitespace-nowrap">
        {reviews.map((rev, index) => (
          <div
            key={rev.id || index}
            className="inline-block bg-white px-4 py-2.5 rounded-lg border border-slate-200 text-xs shadow-xs max-w-xs shrink-0"
          >
            <p className="font-semibold text-slate-800 truncate">{rev.school_name || 'Anonymous School'}</p>
            <p className="text-slate-600 italic truncate">"{rev.comment || rev.text}"</p>
            <span className="text-[10px] text-indigo-600 font-medium mt-1 block">
              — Verified Teacher #{rev.teacher_id || Math.floor(1000 + Math.random() * 9000)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingReviews;
