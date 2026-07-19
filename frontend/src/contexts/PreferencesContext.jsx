import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    theme: 'github-dark',
    ai_personality: 'Senior Full Stack Engineer',
    review_mode: 'Balanced',
    beginner_mode: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const user = await api.getCurrentUser();
        if (user.preferences) {
          setPreferences(prev => ({ ...prev, ...user.preferences }));
        }
      } catch (err) {
        console.error("Failed to fetch preferences:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if logged in
    if (localStorage.getItem('token')) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, []);

  const updatePreferences = async (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    try {
      await api.updatePreferences(updated);
    } catch (err) {
      console.error("Failed to update preferences on server", err);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, loading }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
