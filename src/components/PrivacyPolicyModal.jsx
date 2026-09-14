import React from 'react';
import { PRIVACY_POLICY } from '@/lib/privacyPolicy';

const PrivacyPolicyModal = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  const title = PRIVACY_POLICY?.title || 'Privacy Policy & Terms';
  const sections = PRIVACY_POLICY?.sections || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
        <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
        
        <div className="overflow-y-auto flex-1 text-xs text-slate-600 space-y-3 pr-2 my-2">
          {sections.map((sec, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-slate-800 mb-1">{sec.heading || sec.title}</h4>
              <p>{sec.text || sec.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (onAgree) onAgree();
              if (onClose) onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
