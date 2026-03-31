import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { themes, defaultTheme, Theme } from '../data/themes';
import { triangle01, wrap01 } from '../utils/gradientRuntime';

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

  const gradientDurationMsRef = useRef(15000);
  const gradientStartMsRef = useRef<number | null>(null);

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


    // Set body background
    document.body.style.backgroundColor = colors.bottomBarColor;
    document.body.style.backgroundImage = colors.gradient;
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.backgroundRepeat = 'no-repeat';
    // The gradient animation is now driven by JS (GradientClock), not CSS keyframes.
    document.body.classList.remove('bg-gradient-main');

    // Set RGB values for opacity usage
    const primaryRgb = hexToRgb(colors.primary);
    const secondaryRgb = hexToRgb(colors.secondary);
    if (primaryRgb) {
      root.style.setProperty('--primary-color-rgb', primaryRgb);
    }
     if (secondaryRgb) {
      root.style.setProperty('--secondary-color-rgb', secondaryRgb);
    }
    
    // Update theme-color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', colors.topBarColor);
    }
    
    // Store theme choice
    localStorage.setItem('theme', theme.name);
  }, [theme]);

  /**
   * GradientClock
   * A single requestAnimationFrame loop that drives:
   * - DOM background gradient motion (background-position)
   *
    * IMPORTANT: Do not put phase in React state (would rerender the whole app at 60fps).
   */
  useEffect(() => {
    let rafId = 0;
    let cancelled = false;

    const tick = (nowMs: number) => {
      if (cancelled) return;

      if (gradientStartMsRef.current === null) gradientStartMsRef.current = nowMs;
      const elapsed = nowMs - gradientStartMsRef.current;
      const duration = gradientDurationMsRef.current;

      const wave = triangle01(wrap01(elapsed / duration));

      // Match the original CSS: background-position: 0% 50% -> 100% 50% -> 0% 50%
      document.body.style.backgroundPosition = `${(wave * 100).toFixed(3)}% 50%`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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
