import React from 'react';

const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 animate-[slide-up_0.5s_ease-out]">
      <div className="text-center mb-10">
        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#5E5CE6] to-[#0A84FF] border-2 border-white/20 flex items-center justify-center text-4xl font-bold text-white shadow-2xl mb-4">
          D
        </div>
        <h1 className="text-2xl font-bold text-white">Developer</h1>
        <p className="text-[15px] text-white/60">developer@codesentry.com</p>
      </div>

      <div className="apple-glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <span className="text-[15px] font-semibold text-white">Name</span>
          <span className="text-[15px] text-white/60">Developer User</span>
        </div>
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <span className="text-[15px] font-semibold text-white">Email</span>
          <span className="text-[15px] text-white/60">developer@codesentry.com</span>
        </div>
        <div className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors text-[#0A84FF]">
          <span className="text-[15px] font-semibold">Change Password...</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button className="apple-btn-glass text-[#FF375F] hover:bg-[#FF375F]/10 hover:border-[#FF375F]/30">Sign Out</button>
      </div>
    </div>
  );
};

export default Profile;
