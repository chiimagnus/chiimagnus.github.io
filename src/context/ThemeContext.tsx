import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { themes, defaultTheme, Theme } from '../data/themes';
import { sampleStopsColor, triangle01, wrap01 } from '../utils/gradientRuntime';

// Utility to convert hex to RGB, needed for CSS variables
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
};

export interface GradientPhase {
  /**
   * raw phase in [0, 1)
   * - continuous cycle
   */
  raw: number;
  /**
   * triangle-wave phase in [0, 1]
   * - matches a common CSS keyframes pattern: 0 -> 1 -> 0
   * - used for background-position driving (back-and-forth motion)
   */
  wave: number;
}

export interface GradientPalette {
  keyLight: string;
  fillLight: string;
  rimLight: string;
  underGlow: string;
  velvetTint: string;
  highlight: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: Theme[];
  /**
   * Read-only accessors for the animated gradient runtime.
   * These MUST NOT trigger React rerenders at 60fps.
   */
  getGradientPhase: () => GradientPhase;
  getGradientPalette: () => GradientPalette;
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
  const gradientStopsRef = useRef<string[]>(theme.colors.gradientStops);
  const gradientPhaseRef = useRef<GradientPhase>({ raw: 0, wave: 0 });
  const gradientPaletteRef = useRef<GradientPalette>({
    keyLight: theme.colors.accent,
    fillLight: theme.colors.secondary,
    rimLight: theme.colors.primary,
    underGlow: theme.colors.accent,
    velvetTint: theme.colors.bottomBarColor,
    highlight: theme.colors.primary,
  });

  /**
   * computeGradientPalette
   * Generate a small palette used by the dice 3D scene from gradient stops and a phase.
   *
   * Note: we sample multiple offsets so lights/materials don't all shift identically.
   */
  const computeGradientPalette = useCallback((stops: string[], phaseWave: number): GradientPalette => {
    const t0 = wrap01(phaseWave);
    return {
      keyLight: sampleStopsColor(stops, t0),
      fillLight: sampleStopsColor(stops, t0 + 0.18),
      rimLight: sampleStopsColor(stops, t0 + 0.42),
      underGlow: sampleStopsColor(stops, t0 + 0.64),
      velvetTint: sampleStopsColor(stops, t0 + 0.12),
      highlight: sampleStopsColor(stops, t0 + 0.3),
    };
  }, []);

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

    // Update gradient runtime inputs (used by the JS animation loop)
    gradientStopsRef.current = colors.gradientStops;
    gradientPaletteRef.current = computeGradientPalette(colors.gradientStops, gradientPhaseRef.current.wave);


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
  }, [computeGradientPalette, theme]);

  /**
   * GradientClock
   * A single requestAnimationFrame loop that drives:
   * - DOM background gradient motion (background-position)
   * - a shared phase/palette for the Three.js dice scene
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

      const raw = wrap01(elapsed / duration);
      const wave = triangle01(raw);
      gradientPhaseRef.current = { raw, wave };

      // Match the original CSS: background-position: 0% 50% -> 100% 50% -> 0% 50%
      document.body.style.backgroundPosition = `${(wave * 100).toFixed(3)}% 50%`;

      const stops = gradientStopsRef.current;
      gradientPaletteRef.current = computeGradientPalette(stops, wave);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [computeGradientPalette]);

  const setTheme = (themeName: string) => {
    const newTheme = themes.find(t => t.name === themeName);
    if (newTheme) {
      setThemeState(newTheme);
    }
  };

  const getGradientPhase = useCallback(() => gradientPhaseRef.current, []);
  const getGradientPalette = useCallback(() => gradientPaletteRef.current, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: themes, getGradientPhase, getGradientPalette }}>
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
