import React, { useState, useEffect } from 'react';
import { clearToken, api } from '../api';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Shield, LogOut, Moon, Check, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { usePreferences } from '../contexts/PreferencesContext';
import { cn } from '../lib/utils';

const Profile = () => {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = usePreferences();
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await api.getCurrentUser();
        setCurrentUser(user);
        setFullName(user.full_name || "");
        setEmail(user.email || "");
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const handlePreferenceChange = async (key, value) => {
    setSaving(true);
    await updatePreferences({ [key]: value });
    setSaving(false);
  };

  const handleProfileUpdate = async () => {
    setIsProfileSaving(true);
    setProfileMessage(null);
    try {
      await api.updateProfile({ full_name: fullName });
      setProfileMessage("Profile updated successfully!");
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setProfileMessage("Failed to update profile.");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const themes = [
    { id: 'github-dark', label: 'GitHub Dark', color: '#0d1117' },
    { id: 'github-light', label: 'GitHub Light', color: '#ffffff' },
    { id: 'vscode-dark', label: 'VS Code', color: '#1e1e1e' },
    { id: 'dracula', label: 'Dracula', color: '#282a36' },
    { id: 'nord', label: 'Nord', color: '#2e3440' },
    { id: 'tokyo-night', label: 'Tokyo Night', color: '#1a1b26' },
    { id: 'catppuccin', label: 'Catppuccin', color: '#1e1e2e' },
    { id: 'gruvbox', label: 'Gruvbox', color: '#282828' },
    { id: 'monokai', label: 'Monokai', color: '#272822' },
    { id: 'solarized', label: 'Solarized', color: '#002b36' },
    { id: 'system', label: 'System', color: '#e5e7eb' },
  ];

  const personalities = [
    { id: 'Senior Full Stack Engineer', label: 'Senior Engineer', desc: 'Direct, standard professional review.' },
    { id: 'Friendly Mentor', label: 'Mentor', desc: 'Encouraging, educational, and patient.' },
    { id: 'Strict Security Expert', label: 'Security Expert', desc: 'Hyper-focused on vulnerabilities and zero-trust.' },
    { id: 'Performance Guru', label: 'Performance Guru', desc: 'Obsessed with Big-O notation and optimization.' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-text-muted mt-2">Manage your profile, preferences, and AI behavior.</p>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="w-full flex md:flex-col gap-2">
              <TabsList className="flex flex-row md:flex-col h-auto p-1 bg-surface justify-start items-start">
                <TabsTrigger value="profile" className="w-full justify-start py-2 px-3">
                  <User className="h-4 w-4 mr-2" /> Profile
                </TabsTrigger>
                <TabsTrigger value="preferences" className="w-full justify-start py-2 px-3">
                  <Settings className="h-4 w-4 mr-2" /> Preferences
                </TabsTrigger>
                <TabsTrigger value="ai" className="w-full justify-start py-2 px-3">
                  <Cpu className="h-4 w-4 mr-2" /> AI Settings
                </TabsTrigger>
              </TabsList>
              
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 mt-auto" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="md:col-span-3">
          <TabsContent value="preferences" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Themes</CardTitle>
                <CardDescription>Select a theme for the application. It will apply immediately.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => handlePreferenceChange('theme', t.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all hover:border-accent",
                        preferences?.theme === t.id ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border bg-surface"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full mb-3 shadow-inner" style={{ backgroundColor: t.color }}></div>
                      <span className="font-medium text-sm">{t.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Review Personalities</CardTitle>
                <CardDescription>Customize how the AI talks to you during reviews.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalities.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handlePreferenceChange('ai_personality', p.id)}
                      className={cn(
                        "p-4 border rounded-xl cursor-pointer transition-all hover:border-accent",
                        preferences?.ai_personality === p.id ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border bg-surface"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{p.label}</h4>
                        {preferences?.ai_personality === p.id && <Check className="w-4 h-4 text-accent" />}
                      </div>
                      <p className="text-sm text-text-muted">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Review Mode</CardTitle>
                <CardDescription>Adjust the focus areas of the static analysis and AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Balanced', 'Deep Security', 'High Performance'].map(mode => (
                  <div 
                    key={mode}
                    onClick={() => handlePreferenceChange('review_mode', mode)}
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all",
                      preferences?.review_mode === mode ? "border-accent bg-accent/5" : "border-border bg-surface hover:border-text-muted"
                    )}
                  >
                    <span className="font-medium">{mode}</span>
                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", preferences?.review_mode === mode ? "border-accent" : "border-border")}>
                      {preferences?.review_mode === mode && <div className="w-3 h-3 rounded-full bg-accent" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Beginner Mode</CardTitle>
                <CardDescription>Toggle ELI5 explanations and extensive beginner-friendly comments.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Explain Like I'm New</h4>
                  <p className="text-sm text-text-muted">Break down complex code into simple analogies.</p>
                </div>
                <button 
                  onClick={() => handlePreferenceChange('beginner_mode', !preferences?.beginner_mode)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    preferences?.beginner_mode ? "bg-accent" : "bg-surface-hover border border-border"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm",
                    preferences?.beginner_mode ? "left-[26px]" : "left-0.5"
                  )} />
                </button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information and how others see you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex items-center gap-6">
                  <Avatar fallback={fullName?.charAt(0) || email?.charAt(0) || "U"} size="xl" className="bg-accent/10 text-accent border-accent/20" />
                  <div>
                    <h3 className="font-semibold text-text-primary text-lg">{fullName || 'Developer'}</h3>
                    <p className="text-text-muted text-sm">{email || 'Loading...'}</p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-border/50 pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Full Name</label>
                    <Input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Email Address</label>
                    <Input 
                      value={email} 
                      disabled 
                      className="bg-surface-hover text-text-muted cursor-not-allowed"
                    />
                    <p className="text-[10px] text-text-muted">Email addresses cannot be changed currently.</p>
                  </div>
                  
                  {profileMessage && (
                    <div className="p-3 bg-success/10 text-success text-sm border border-success/20 rounded-md">
                      {profileMessage}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-surface-hover/30 border-t border-border/40 p-4 justify-end">
                <Button 
                  variant="primary" 
                  onClick={handleProfileUpdate}
                  disabled={isProfileSaving}
                >
                  {isProfileSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Profile;
