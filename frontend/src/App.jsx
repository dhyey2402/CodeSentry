import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Projects from './pages/Projects';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Layout
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Dummy Auth Check
const isAuthenticated = () => {
  return true; 
};

// Global Ambient Background for the entire app
const AmbientBackground = () => (
  <div className="apple-ambient-bg">
    <div className="ambient-blob-1"></div>
    <div className="ambient-blob-2"></div>
    <div className="ambient-blob-3"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <AmbientBackground />
      {/* Floating layout container */}
      <div className="flex h-screen p-4 gap-4 overflow-hidden text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto rounded-[32px] pb-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<><AmbientBackground /><Login /></>} />
        <Route path="/register" element={<><AmbientBackground /><Register /></>} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* 404 Route */}
        <Route path="*" element={<><AmbientBackground /><NotFound /></>} />
      </Routes>
    </Router>
  );
}

export default App;
