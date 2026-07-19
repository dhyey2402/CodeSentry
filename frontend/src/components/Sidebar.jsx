import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload as UploadIcon, 
  FolderGit2, 
  History, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clearToken } from '../api';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/Tooltip';
import { Logo } from './ui/Logo';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Code', path: '/upload', icon: UploadIcon },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'History', path: '/reviews', icon: History },
];

const bottomNavItems = [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname.startsWith(item.path);

    const content = (
      <NavLink
        to={item.path}
        className={cn(
          "relative flex items-center h-10 px-3 my-1 rounded-md transition-colors group",
          isActive 
            ? "bg-accent/10 text-accent font-medium" 
            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary")} />
        
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="ml-3 truncate whitespace-nowrap overflow-hidden"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
      </NavLink>
    );

    if (!isOpen) {
      return (
        <Tooltip content={item.name} side="right">
          {content}
        </Tooltip>
      );
    }
    return content;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 72 }}
      className="relative z-20 flex flex-col h-full bg-surface border-r border-border shrink-0 transition-all duration-300"
    >
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden text-primary">
          <Logo className="h-6 w-6 flex-shrink-0 text-accent" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden"
              >
                CodeSentry
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-border space-y-1">
        {bottomNavItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
        
        {isOpen ? (
          <button
            onClick={handleLogout}
            className="flex items-center w-full h-10 px-3 my-1 rounded-md text-text-secondary hover:bg-destructive/10 hover:text-destructive transition-colors group"
          >
            <LogOut className="h-5 w-5 flex-shrink-0 text-text-muted group-hover:text-destructive" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        ) : (
          <Tooltip content="Logout" side="right">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full h-10 my-1 rounded-md text-text-secondary hover:bg-destructive/10 hover:text-destructive transition-colors group"
            >
              <LogOut className="h-5 w-5 text-text-muted group-hover:text-destructive" />
            </button>
          </Tooltip>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 flex items-center justify-center h-6 w-6 rounded-full bg-background border border-border shadow-sm text-text-muted hover:text-text-primary z-30 transition-colors"
      >
        {isOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
