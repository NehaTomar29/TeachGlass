// src/App.jsx
import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client.js'
import { Toaster } from './components/ui/sonner.jsx'

import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import AboutUs from './pages/AboutUs.jsx'
import SchoolDirectory from './pages/SchoolDirectory.jsx'
import SchoolProfile from './pages/SchoolProfile.jsx'
import RatingPage from './pages/RatingPage.jsx'
import ReviewUs from './pages/ReviewUs.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import OAuthConsent from './pages/OAuthConsent.jsx'
import PageNotFound from './lib/PageNotFound.jsx'

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center my-12">
          <h2 className="text-xl font-bold text-red-600 mb-2">Rendering Error Detected</h2>
          <pre className="text-xs bg-red-50 text-red-800 p-4 rounded border border-red-200 text-left overflow-auto max-w-xl mx-auto">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/explore" element={<SchoolDirectory />} />
              <Route path="/school/:id" element={<SchoolProfile />} />
              <Route path="/rate" element={<RatingPage />} />
              <Route path="/review" element={<ReviewUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/oauth/consent" element={<OAuthConsent />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  )
}

export default App
