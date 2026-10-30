import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: (origin?: { x: number; y: number }) => void;
  setTheme: (dark: boolean, origin?: { x: number; y: number }) => void;
} | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = window.localStorage.getItem('origin-hotel-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    window.localStorage.setItem('origin-hotel-theme', isDark ? 'dark' : 'light');

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'origin-hotel-theme' && e.newValue) {
        setIsDark(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [isDark]);

  const changeTheme = useCallback((dark: boolean, origin?: { x: number; y: number }) => {
    const root = document.documentElement;
    const applyTheme = () => {
      root.classList.toggle('dark', dark);
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      root.style.colorScheme = dark ? 'dark' : 'light';
      setIsDark(dark);
      window.localStorage.setItem('origin-hotel-theme', dark ? 'dark' : 'light');
    };

    if (origin) {
      root.style.setProperty('--theme-origin-x', `${origin.x}px`);
      root.style.setProperty('--theme-origin-y', `${origin.y}px`);
    }

    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => flushSync(applyTheme));
    } else {
      flushSync(applyTheme);
    }
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme: (origin?: { x: number; y: number }) => changeTheme(!isDark, origin),
      setTheme: (dark: boolean, origin?: { x: number; y: number }) => changeTheme(dark, origin),
    }),
    [changeTheme, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
