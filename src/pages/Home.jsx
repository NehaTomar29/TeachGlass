import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FloatingReviews from '@/components/FloatingReviews';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';

// Defensive Local Error Boundary to catch component crashes
class ComponentBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Home Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 my-4 bg-amber-50 border border-amber-200 rounded-md text-center">
          <p className="text-sm font-medium text-amber-800">
            {this.props.fallbackText || "This section is temporarily unavailable."}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Home = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
            TeachGlass
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Transparent insights and reviews for schools and educators.
          </p>
        </div>

        {/* Search Bar - Wrapped in Error Guard */}
        <section className="mb-10">
          <ComponentBoundary fallbackText="Search feature is currently loading or unavailable.">
            <SearchBar onAddSchoolClick={() => setIsPrivacyOpen(true)} />
          </ComponentBoundary>
        </section>

        {/* Floating Reviews / Ticker - Wrapped in Error Guard */}
        <section className="mb-10">
          <ComponentBoundary fallbackText="Reviews feed currently unavailable.">
            <FloatingReviews />
          </ComponentBoundary>
        </section>

        {/* Privacy Modal */}
        <ComponentBoundary fallbackText="">
          <PrivacyPolicyModal 
            isOpen={isPrivacyOpen} 
            onClose={() => setIsPrivacyOpen(false)} 
            onAgree={() => setIsPrivacyOpen(false)} 
          />
        </ComponentBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} TeachGlass. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
