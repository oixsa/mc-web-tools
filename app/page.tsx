'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExploreTools } from './components/ExploreTools';
import { FavoritesSection } from './components/FavoritesSection';
import { FlagshipSection } from './components/FlagshipSection';
import { Footer } from './components/Footer';
import { GuidesSection } from './components/GuidesSection';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickLauncherModal } from './components/QuickLauncherModal';
import { getFlagshipTools, TOOLS } from './data/tools';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import { Tool } from './types/tools';

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const { favorites, toggleFavorite, clearFavorites, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut listener for Command/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered favorite tool objects
  const favoriteTools = useMemo(() => {
    return favorites
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t): t is Tool => t !== undefined);
  }, [favorites]);

  const flagshipTools = useMemo(() => getFlagshipTools(), []);

  const handleSelectTool = (tool: Tool) => {
    // Navigate or smooth scroll to tool
    window.location.href = tool.href;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Fixed Header with theme toggle & search */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Hero Section with Interactive Build Planner Spotlight */}
        <Hero />

        {/* User Starred / Favorited Tools */}
        <FavoritesSection
          favoriteTools={favoriteTools}
          onToggleFavorite={toggleFavorite}
          onClearFavorites={clearFavorites}
        />

        {/* Flagship Recommended Tools */}
        <FlagshipSection
          flagshipTools={flagshipTools}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        {/* Complete Filterable & Searchable Tool Catalog */}
        <ExploreTools
          tools={TOOLS}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Guides & References Section */}
        <GuidesSection />
      </main>

      {/* Footer Directory & Legal Disclaimer */}
      <Footer />

      {/* Command Palette / ⌘K Search Modal */}
      <QuickLauncherModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}
