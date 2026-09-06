'use client';

import { useEffect, useMemo, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ExploreTools } from './components/ExploreTools';
import { FlagshipSection } from './components/FlagshipSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickLauncherModal } from './components/QuickLauncherModal';
import { getFlagshipTools, TOOLS } from './data/tools';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import { Tool } from './types/tools';

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
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

  const flagshipTools = useMemo(() => getFlagshipTools(), []);

  const handleSelectTool = (tool: Tool) => {
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
        {/* Hero Section with Interactive Server MOTD Generator Spotlight */}
        <Hero />

        {/* Flagship Recommended Tools (displayed when multiple flagship tools exist) */}
        {flagshipTools.length > 1 && (
          <FlagshipSection
            flagshipTools={flagshipTools}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* Complete Filterable & Searchable Active Tool Catalog */}
        <ExploreTools
          tools={TOOLS}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* About Kita Tools Section */}
        <AboutSection />
      </main>

      {/* Footer Directory & Legal Disclaimer */}
      <Footer />

      {/* Command Palette / ⌘K Search Modal */}
      {isSearchOpen && (
        <QuickLauncherModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectTool={handleSelectTool}
        />
      )}
    </div>
  );
}
