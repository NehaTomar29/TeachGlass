import React from 'react';

const StatsBar = ({ schoolCount = 0, teacherCount = 0, reviewCount = 0 }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 my-6 shadow-xs">
      <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
        <div>
          <p className="text-xl sm:text-2xl font-black text-indigo-900">{schoolCount}</p>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Schools Listed[cite: 1]</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-indigo-900">{teacherCount}</p>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Verified Teachers[cite: 1]</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-indigo-900">{reviewCount}</p>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Total Reviews[cite: 1]</p>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
