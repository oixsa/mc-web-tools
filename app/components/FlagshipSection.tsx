'use client';

import { Tool } from '../types/tools';
import { ToolCard } from './ToolCard';

interface FlagshipSectionProps {
  flagshipTools: Tool[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export function FlagshipSection({
  flagshipTools,
  isFavorite,
  onToggleFavorite,
}: FlagshipSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#1A1210] dark:text-[#F8F4F0]">
            Flagship tools
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B]">
          The tools we recommend starting with.
        </p>
      </div>

      {/* 4-Column Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {flagshipTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isFavorite={isFavorite(tool.id)}
            onToggleFavorite={() => onToggleFavorite(tool.id)}
          />
        ))}
      </div>
    </section>
  );
}
