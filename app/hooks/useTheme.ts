'use client';

import { useSyncExternalStore } from 'react';
import { ThemeMode } from '../types/tools';

const STORAGE_KEY = 'kitatools_theme';

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', mode === 'dark');
  document.documentElement.dataset.theme = mode;
}

function getSnapshot(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerSnapshot(): ThemeMode {
  return 'light';
}

function subscribe(notify: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', notify);
  window.addEventListener('theme-change', notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('theme-change', notify);
  };
}

/**
 * Custom hook for persistent Light / Dark theme management.
 * Synchronizes with DOM (.dark class & data-theme attribute) and localStorage without cascading renders.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors (e.g. incognito)
    }
    window.dispatchEvent(new Event('theme-change'));
  };

  const setTheme = (mode: ThemeMode) => {
    applyTheme(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore
    }
    window.dispatchEvent(new Event('theme-change'));
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}
