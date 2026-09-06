'use client';

import { Tool } from '../types/tools';
import { ToolCard } from './ToolCard';

interface FavoritesSectionProps {
  favoriteTools: Tool[];
  onToggleFavorite: (id: string) => void;
  onClearFavorites: () => void;
}

export function FavoritesSection({
  favoriteTools,
  onToggleFavorite,
  onClearFavorites,
}: FavoritesSectionProps) {
  if (favoriteTools.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full" id="favorites-section">
      <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs transition-colors">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#C27838] dark:text-[#E5A158] text-[24px] filled">
              star
            </span>
            <div>
              <h2 className="font-headline font-bold text-lg sm:text-xl text-[#1A1210] dark:text-[#F8F4F0]">
                Your favorites
              </h2>
              <p className="text-xs sm:text-sm text-[#68615A] dark:text-[#A8A19B]">
                Tools you starred, saved on this device.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClearFavorites}
            className="text-xs sm:text-sm font-medium text-[#68615A] dark:text-[#A8A19B] hover:text-[#BA1A1A] dark:hover:text-[#FFB4AB] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">clear_all</span>
            Clear all
          </button>
        </div>

        {/* Favorite Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={true}
              onToggleFavorite={() => onToggleFavorite(tool.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
