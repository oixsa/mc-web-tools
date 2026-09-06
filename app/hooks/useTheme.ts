'use client';

import { useEffect, useState } from 'react';
import { ThemeMode } from '../types/tools';

const STORAGE_KEY = 'kitatools_theme';

/**
 * Custom hook for persistent Light / Dark theme management.
 * Synchronizes with DOM (.dark class & data-theme attribute) and localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine initial theme
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      applyTheme(initial);
    }
    setMounted(true);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.dataset.theme = 'dark';
    } else {
      root.classList.remove('dark');
      root.dataset.theme = 'light';
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    applyTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage write errors (e.g. incognito)
    }
  };

  const setExplicitTheme = (mode: ThemeMode) => {
    setTheme(mode);
    applyTheme(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore
    }
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme: setExplicitTheme,
    mounted,
  };
}
