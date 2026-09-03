import React from 'react';

const VerificationCard = ({ request, onApprove, onReject }) => {
  const { id, teacher_name, school_name, employee_status, id_card_url, created_at } = request;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-slate-900 text-sm">{teacher_name || 'Anonymous Applicant'}</h4>
          <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
            Pending
          </span>
        </div>
        <p className="text-xs text-slate-600 font-medium">School: <span className="text-slate-900">{school_name}</span></p>
        <p className="text-xs text-slate-600">Status: <span className="text-slate-900">{employee_status}</span></p>
        <p className="text-[10px] text-slate-400 mt-1">Submitted: {new Date(created_at).toLocaleDateString()}</p>

        {id_card_url && (
          <div className="mt-3">
            <a
              href={id_card_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:underline font-medium flex items-center gap-1"
            >
              View Document/ID Proof ↗
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onApprove(id)}
          className="flex-1 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-md hover:bg-emerald-700 transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(id)}
          className="flex-1 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-md hover:bg-rose-700 transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default VerificationCard;