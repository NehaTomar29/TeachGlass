import React from 'react';
import { Link } from 'react-router-dom';

const UserNotRegisteredError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Teacher Verification Required</h2>
        <p className="text-sm text-slate-600 mb-6">
          You must be a verified teacher to perform this action. Please sign up or submit your verification details.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Sign Up
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
