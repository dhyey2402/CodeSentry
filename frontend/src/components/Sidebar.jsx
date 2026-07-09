import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Upload, Folder, CheckSquare, User, LogOut, Shield } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Upload Code', path: '/upload', icon: Upload },
    { name: 'Projects', path: '/projects', icon: Folder },
    { name: 'Reviews', path: '/reviews', icon: CheckSquare },
  ];

  return (
    <aside className="apple-panel w-[260px] h-full flex flex-col relative z-20">
      {/* Brand */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md shadow-inner border border-white/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          CodeSentry
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-2">
        <p className="px-3 mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Main Menu
        </p>
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[16px] text-[15px] font-medium transition-all duration-300 ${
                  isActive ? 'bg-white/15 text-white shadow-sm' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mx-4 mb-4 rounded-[20px] bg-white/5 border border-white/10">
        <div className="space-y-1">
          <NavLink
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[15px] font-medium transition-all duration-300 ${
              location.pathname === '/profile' ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <User className="w-[18px] h-[18px]" />
            Profile
          </NavLink>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[15px] font-medium transition-all duration-300 cursor-pointer text-[#FF375F] hover:bg-[#FF375F]/10 border-none bg-transparent"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
