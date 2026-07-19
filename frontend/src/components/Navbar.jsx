import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Moon, Sun, Monitor, Menu } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Generate breadcrumbs based on pathname
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ label: 'Dashboard', href: '/dashboard' }];

    return paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return { label, href: index === paths.length - 1 ? null : href };
    });
  };

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const ThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle (only visible on small screens when we implement responsive sidebar later, or always visible here as a backup) */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Breadcrumbs items={generateBreadcrumbs()} />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="text-text-muted hover:text-text-primary rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={cycleTheme} className="text-text-muted hover:text-text-primary rounded-full">
          <ThemeIcon />
        </Button>

        <div className="h-8 w-px bg-border mx-1 md:mx-2" />

        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium leading-none text-text-primary">Admin User</span>
            <span className="text-xs text-text-muted mt-1">admin@codesentry.ai</span>
          </div>
          <Avatar fallback="A" />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
