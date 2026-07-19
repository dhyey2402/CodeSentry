import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getToken } from '../api';
import { cn } from '../lib/utils';

export const AppLayout = ({ children }) => {
  const isAuthenticated = !!getToken();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className={cn(
          "flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 transition-all duration-300",
          !isSidebarOpen && "pl-4 md:pl-6 lg:pl-8" // Ensure padding is consistent when sidebar is closed
        )}>
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
