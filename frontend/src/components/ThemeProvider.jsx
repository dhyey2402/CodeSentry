import React, { createContext, useContext, useEffect, useState } from "react";

import { usePreferences } from '../contexts/PreferencesContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { preferences, updatePreferences } = usePreferences();
  const theme = preferences?.theme || 'github-dark';

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove all possible theme classes
    root.className = '';

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      updatePreferences({ theme: newTheme });
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
