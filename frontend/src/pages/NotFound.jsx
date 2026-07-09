import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-[120px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-2 leading-none">
        404
      </h1>
      <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
      <p className="text-[15px] text-white/60 mb-10 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="apple-btn-glass">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
