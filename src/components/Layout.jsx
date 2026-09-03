import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-900">
            <span>TeachGlass</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/directory" className="hover:text-indigo-600 transition-colors">School Directory</Link>
            <Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
            <Link to="/review-us" className="hover:text-indigo-600 transition-colors">Review Us</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-200">
                  Verified Teacher
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium px-3 py-2 text-slate-700 hover:text-indigo-600"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} TeachGlass.in — Empowering educators with transparent workplace insights.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;