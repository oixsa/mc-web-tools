'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES } from '../data/tools';
import { Tool, ToolCategoryId } from '../types/tools';
import { ToolCard } from './ToolCard';

interface ExploreToolsProps {
  tools: Tool[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'featured' | 'popular';

export function ExploreTools({
  tools,
  isFavorite,
  onToggleFavorite,
  searchQuery,
  onSearchChange,
}: ExploreToolsProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategoryId>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let list = tools.filter((tool) => {
      const matchesCategory =
        activeCategory === 'all' || tool.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'name-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'featured') {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      return 0;
    });

    return list;
  }, [tools, activeCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setActiveCategory('all');
    onSearchChange('');
    setSortBy('name-asc');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full" id="explore-tools">
      {/* Section Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#1A1210] dark:text-[#F8F4F0]">
            Explore tools
          </h2>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] mt-1">
            Find the right Minecraft tool by category or search.
          </p>
        </div>

        {/* Live Search & Sort Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#918A83] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 34+ tools..."
              className="w-full h-10 pl-9 pr-8 rounded-lg bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0] text-xs sm:text-sm shadow-2xs focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F] focus:ring-2 focus:ring-[#8A4228]/15 dark:focus:ring-[#E07A5F]/15 transition-all placeholder:text-[#918A83]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 text-[#918A83] hover:text-[#1A1210] dark:hover:text-white"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 px-3 pr-8 rounded-lg bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B] text-xs sm:text-sm font-medium shadow-2xs focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F] cursor-pointer appearance-none"
            >
              <option value="name-asc">Sort: Name A–Z</option>
              <option value="name-desc">Sort: Name Z–A</option>
              <option value="featured">Sort: Featured</option>
              <option value="popular">Sort: Most popular</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-2.5 pointer-events-none text-[#918A83] text-[18px]">
              unfold_more
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Touch friendly, horizontally scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] shadow-xs font-semibold'
                  : 'bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B] hover:text-[#1A1210] dark:hover:text-[#F8F4F0] hover:border-[#CBC4BD] dark:hover:border-[#54413A]'
              }`}
            >
              {cat.icon && (
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
              )}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Result Metrics */}
      <div className="flex items-center justify-between text-xs text-[#918A83] dark:text-[#766F69] mb-4">
        <span>
          Showing{' '}
          <strong className="text-[#1A1210] dark:text-[#F8F4F0]">
            {filteredTools.length}
          </strong>{' '}
          of {tools.length} tools
        </span>
        {(searchQuery || activeCategory !== 'all') && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[#8A4228] dark:text-[#E07A5F] hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Tools Catalog Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={isFavorite(tool.id)}
              onToggleFavorite={() => onToggleFavorite(tool.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-10 sm:p-14 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#FBECE6] dark:bg-[#38231C] flex items-center justify-center text-[#8A4228] dark:text-[#E07A5F] mb-4">
            <span className="material-symbols-outlined text-[30px]">search_off</span>
          </div>
          <h3 className="font-headline font-bold text-lg text-[#1A1210] dark:text-[#F8F4F0] mb-1">
            No tools match your search
          </h3>
          <p className="text-xs sm:text-sm text-[#68615A] dark:text-[#A8A19B] max-w-sm mb-5">
            We could not find any tools matching &ldquo;{searchQuery}&rdquo;. Try adjusting keywords or category filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs sm:text-sm font-semibold hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors shadow-xs"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
