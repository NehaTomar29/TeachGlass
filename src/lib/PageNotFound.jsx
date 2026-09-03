import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-xl text-slate-600 mb-6">Page not found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PageNotFound;
