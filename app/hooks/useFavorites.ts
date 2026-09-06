'use client';

import { useSyncExternalStore } from 'react';

const FAVORITES_STORAGE_KEY = 'kitatools_favorites';

function getFavoritesSnapshot(): string {
  if (typeof window === 'undefined') return '[]';
  try {
    return localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]';
  } catch {
    return '[]';
  }
}

function getServerSnapshot(): string {
  return '[]';
}

function subscribe(notify: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', notify);
  window.addEventListener('favorites-change', notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('favorites-change', notify);
  };
}

/**
 * Custom hook to manage starred / favorited tools persisted in localStorage.
 * Uses useSyncExternalStore to eliminate cascading setState renders.
 */
export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getFavoritesSnapshot, getServerSnapshot);
  let favorites: string[] = [];
  try {
    favorites = JSON.parse(raw);
  } catch {
    favorites = [];
  }

  const saveFavorites = (newList: string[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newList));
    } catch {
      // Ignore storage errors
    }
    window.dispatchEvent(new Event('favorites-change'));
  };

  const toggleFavorite = (toolId: string) => {
    if (favorites.includes(toolId)) {
      saveFavorites(favorites.filter((id) => id !== toolId));
    } else {
      saveFavorites([...favorites, toolId]);
    }
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
