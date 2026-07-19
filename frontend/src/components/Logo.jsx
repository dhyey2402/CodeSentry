import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5E5CE6" /> {/* Indigo */}
        <stop offset="100%" stopColor="#0A84FF" /> {/* Blue */}
      </linearGradient>
      <linearGradient id="logo-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#BF5AF2" /> {/* Purple */}
        <stop offset="100%" stopColor="#32D74B" /> {/* Green accent */}
      </linearGradient>
    </defs>
    
    {/* Background Shield Outline (Sentry) */}
    <path 
      d="M50 8 L85 22 V50 C85 75 50 92 50 92 C50 92 15 75 15 50 V22 L50 8 Z" 
      stroke="url(#logo-gradient)" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Inner Code Brackets (Code) */}
    <path 
      d="M38 38 L25 50 L38 62 M62 38 L75 50 L62 62" 
      stroke="#ffffff" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      opacity="0.9"
    />
    
    {/* Center Slash (Code) */}
    <path 
      d="M55 35 L45 65" 
      stroke="url(#logo-gradient-light)" 
      strokeWidth="8" 
      strokeLinecap="round" 
    />
  </svg>
);

export default Logo;
