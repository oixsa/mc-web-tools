'use client';

import { Tool } from '../types/tools';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
}: ToolCardProps) {
  return (
    <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#CBC4BD] dark:hover:border-[#54413A]">
      <div>
        {/* Card Thumbnail / Preview Viewport */}
        <div className="relative w-full h-32 sm:h-36 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] mb-3.5 flex items-center justify-center overflow-hidden">
          {/* Favorite Toggle Star */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/85 dark:bg-[#201815]/85 backdrop-blur-xs flex items-center justify-center text-[#918A83] hover:text-[#C27838] dark:hover:text-[#E5A158] shadow-2xs transition-colors z-10"
            aria-label={isFavorite ? `Unfavorite ${tool.title}` : `Favorite ${tool.title}`}
          >
            <span
              className={`material-symbols-outlined text-[17px] ${
                isFavorite
                  ? 'text-[#C27838] dark:text-[#E5A158] filled'
                  : 'text-[#918A83] dark:text-[#766F69]'
              }`}
            >
              star
            </span>
          </button>

          {/* Badge indicator */}
          {tool.badge && (
            <span className="absolute top-2 right-2 font-mono-meta text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FBECE6] dark:bg-[#38231C] text-[#8A4228] dark:text-[#E07A5F] border border-[#E2DDD8] dark:border-[#3A2D28]">
              {tool.badge}
            </span>
          )}

          {/* Center Graphic / Material Icon */}
          <div className="flex flex-col items-center justify-center text-[#8A4228] dark:text-[#E07A5F] group-hover:scale-110 transition-transform duration-200">
            <span className="material-symbols-outlined text-[38px] sm:text-[44px]">
              {tool.icon}
            </span>
            {tool.engineVersion && (
              <span className="font-mono-meta text-[10px] text-[#918A83] dark:text-[#766F69] mt-1">
                {tool.engineVersion}
              </span>
            )}
          </div>
        </div>

        {/* Card Title & Description */}
        <h3 className="font-headline font-bold text-base text-[#1A1210] dark:text-[#F8F4F0] mb-1.5 group-hover:text-[#8A4228] dark:group-hover:text-[#E07A5F] transition-colors">
          {tool.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#68615A] dark:text-[#A8A19B] leading-relaxed line-clamp-2 mb-4">
          {tool.description}
        </p>
      </div>

      {/* Card Footer: Category pill & Direct Launch Action */}
      <div className="pt-3 border-t border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-between">
        <span className="font-mono-meta text-[11px] text-[#918A83] dark:text-[#766F69] capitalize">
          {tool.category.replace('-', ' ')}
        </span>
        <a
          href={tool.href}
          className="w-8 h-8 rounded-full bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] flex items-center justify-center shadow-xs group-hover:bg-[#72341D] dark:group-hover:bg-[#F19178] transition-colors transform group-hover:translate-x-0.5"
          aria-label={`Open ${tool.title}`}
        >
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>
    </div>
  );
}
