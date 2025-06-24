import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, defaultTheme, Theme } from '../data/themes';

// Utility to convert hex to RGB, needed for CSS variables
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedThemeName = localStorage.getItem('theme');
      return themes.find(t => t.name === savedThemeName) || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    const { colors } = theme;

    // Set CSS variables
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--bg-gradient', colors.gradient);
    root.style.setProperty('--link-color', colors.primary);
    root.style.setProperty('--hover-color', colors.secondary);


    // Set RGB values for opacity usage
    const primaryRgb = hexToRgb(colors.primary);
    const secondaryRgb = hexToRgb(colors.secondary);
    if (primaryRgb) {
      root.style.setProperty('--primary-color-rgb', primaryRgb);
    }
     if (secondaryRgb) {
      root.style.setProperty('--secondary-color-rgb', secondaryRgb);
    }
    
    // Store theme choice
    localStorage.setItem('theme', theme.name);
  }, [theme]);

  const setTheme = (themeName: string) => {
    const newTheme = themes.find(t => t.name === themeName);
    if (newTheme) {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 