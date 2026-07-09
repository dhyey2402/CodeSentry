import React from 'react';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-[68px] shrink-0 apple-panel flex items-center justify-between px-6 z-20">
      
      {/* Search Bar - Integrated Apple Style */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="w-4 h-4 text-white/40" />
          </span>
          <input
            type="text"
            className="w-full bg-black/20 border border-white/10 rounded-[16px] pl-10 pr-4 py-2 text-[15px] text-white placeholder-white/30 focus:outline-none focus:bg-black/40 focus:border-white/20 transition-all shadow-inner"
            placeholder="Search projects..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5">
        
        {/* Notification Bell */}
        <button
          className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer text-white/80 hover:text-white"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#FF375F] border-2 border-transparent shadow-[0_0_8px_rgba(255,55,95,0.6)]"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-white/10" />

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-semibold text-white leading-tight group-hover:opacity-80 transition-opacity">Developer</p>
            <p className="text-[12px] text-white/50">Pro Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5E5CE6] to-[#0A84FF] border border-white/20 flex items-center justify-center text-white font-bold shadow-lg shadow-[#5E5CE6]/20">
            D
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
