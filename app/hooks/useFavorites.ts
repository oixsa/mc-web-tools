'use client';

import { useEffect, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'kitatools_favorites';
const DEFAULT_FAVORITES = ['build-planner', 'circle-generator', 'seed-map'];

/**
 * Custom hook to manage starred / favorited tools persisted in localStorage.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(DEFAULT_FAVORITES);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Fall back to default
    }
    setMounted(true);
  }, []);

  const saveFavorites = (newList: string[]) => {
    setFavorites(newList);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newList));
    } catch {
      // Ignore
    }
  };

  const toggleFavorite = (toolId: string) => {
    if (favorites.includes(toolId)) {
      saveFavorites(favorites.filter((id) => id !== toolId));
    } else {
      saveFavorites([...favorites, toolId]);
    }
  };

  const clearFavorites = () => {
    saveFavorites([]);
  };

  const isFavorite = (toolId: string) => {
    return favorites.includes(toolId);
  };

  return {
    favorites,
    toggleFavorite,
    clearFavorites,
    isFavorite,
    mounted,
  };
}
