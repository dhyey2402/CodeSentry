import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-[slide-up_0.6s_ease-out]">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
          <p className="text-[15px] text-white/60">Join CodeSentry today</p>
        </div>

        <div className="apple-glass p-8">
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Full Name" className="apple-input" />
            <input type="email" placeholder="Email" className="apple-input" />
            <input type="password" placeholder="Password" className="apple-input" />
            <div className="pt-4 flex items-center justify-between">
              <Link to="/login" className="text-[14px] text-[#0A84FF] hover:underline font-medium">Sign in instead</Link>
              <button type="submit" className="apple-btn-primary px-8">Next</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
