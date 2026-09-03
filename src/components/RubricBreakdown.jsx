import React from 'react';
import { RUBRIC_CATEGORIES } from '@/lib/rubric';

const RubricBreakdown = ({ categoryScores = {} }) => {
  return (
    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
      <h3 className="font-bold text-slate-900 text-base">Detailed Rubric Breakdown</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {RUBRIC_CATEGORIES.map((cat) => {
          const score = categoryScores[cat.id] || 0;
          return (
            <div key={cat.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-1.5">
                <span>{cat.title}</span>
                <span className="text-indigo-700 font-bold">{score.toFixed(1)} / 5</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RubricBreakdown;
