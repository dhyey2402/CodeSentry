import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Projects from './pages/Projects';
import Reviews from './pages/Reviews';
import Workspace from './pages/Workspace';
import ReviewDetails from './pages/ReviewDetails';
import ReviewReplay from './pages/ReviewReplay';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Layout
import { AppLayout } from './components/AppLayout';
import { CommandPalette } from './components/CommandPalette';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Workspace Route without Layout */}
        <Route path="/reviews/:id/workspace" element={
          <>
            <CommandPalette />
            <Workspace />
          </>
        } />
        
        {/* Protected Routes wrapped in AppLayout */}
        <Route path="/" element={<AppLayout><CommandPalette /><Dashboard /></AppLayout>} />
        <Route path="/dashboard" element={<AppLayout><CommandPalette /><Dashboard /></AppLayout>} />
        <Route path="/upload" element={<AppLayout><CommandPalette /><Upload /></AppLayout>} />
        <Route path="/projects" element={<AppLayout><CommandPalette /><Projects /></AppLayout>} />
        <Route path="/reviews" element={<AppLayout><CommandPalette /><Reviews /></AppLayout>} />
        <Route path="/reviews/:id" element={<AppLayout><CommandPalette /><ReviewDetails /></AppLayout>} />
        <Route path="/reviews/replay" element={<AppLayout><CommandPalette /><ReviewReplay /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><CommandPalette /><Profile /></AppLayout>} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
