import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

// UI Components
import { NavigationMenu } from './components/ui/navigation-menu.jsx'

// Pages
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import InstitutionDetail from './pages/InstitutionDetail.jsx'
import ReviewUs from './pages/ReviewUs.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Login from './pages/Login.jsx'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <NavigationMenu />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/institution/:id" element={<InstitutionDetail />} />
              <Route path="/review" element={<ReviewUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
