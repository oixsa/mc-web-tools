'use client';

import { useMemo, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ExploreTools } from './components/ExploreTools';
import { FlagshipSection } from './components/FlagshipSection';
import { Hero } from './components/Hero';
import { getFlagshipTools, TOOLS } from './data/tools';
import { useFavorites } from './hooks/useFavorites';

export default function Home() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  const flagshipTools = useMemo(() => getFlagshipTools(), []);

  return (
    <div className="w-full">
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
    </div>
  );
}
