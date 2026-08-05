import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import JobListingPage from './pages/JobListingPage';
import JobDetailPage from './pages/JobDetailPage';
import AuthPage from './pages/AuthPage';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-viewport">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<JobListingPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Role-based dashboard routes */}
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<JobListingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
