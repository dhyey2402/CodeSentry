import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, FileCode, Upload, User, LayoutDashboard, Settings, Moon, Sun, Monitor } from 'lucide-react';
import { usePreferences } from '../contexts/PreferencesContext';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { preferences, updatePreferences } = usePreferences();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200" 
        onClick={e => e.stopPropagation()}
      >
        <Command label="Global Command Menu" className="w-full h-full flex flex-col">
          <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input 
              autoFocus 
              placeholder="Type a command or search..." 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0 text-text-primary" 
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 text-text-primary">
            <Command.Empty className="py-6 text-center text-sm text-text-muted">No results found.</Command.Empty>
            
            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-text-muted">
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/dashboard'))}
                className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm hover:bg-accent/10 hover:text-accent data-[selected='true']:bg-accent/10 data-[selected='true']:text-accent"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/upload'))}
                className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm hover:bg-accent/10 hover:text-accent data-[selected='true']:bg-accent/10 data-[selected='true']:text-accent"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload Code</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/reviews'))}
                className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm hover:bg-accent/10 hover:text-accent data-[selected='true']:bg-accent/10 data-[selected='true']:text-accent"
              >
                <FileCode className="mr-2 h-4 w-4" />
                <span>All Reviews</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => navigate('/profile'))}
                className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm hover:bg-accent/10 hover:text-accent data-[selected='true']:bg-accent/10 data-[selected='true']:text-accent"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Preferences" className="px-2 py-1.5 text-xs font-medium text-text-muted mt-2 border-t border-border pt-3">
              <Command.Item 
                onSelect={() => runCommand(() => updatePreferences({ theme: 'github-dark' }))}
                className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm hover:bg-accent/10 hover:text-accent data-[selected='true']:bg-accent/10 data-[selected='true']:text-accent"
              >
                <Moon className="mr-2 h-4 w-4" />
                <span>Toggle Dark Theme</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => updatePreferences({ beginner_mode: !preferences?.beginner_mode }))}
                className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm hover:bg-accent/10 hover:text-accent data-[selected='true']:bg-accent/10 data-[selected='true']:text-accent"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Toggle Beginner Mode</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
