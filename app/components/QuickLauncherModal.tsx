'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TOOLS } from '../data/tools';
import { Tool } from '../types/tools';

interface QuickLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: Tool) => void;
}

export function QuickLauncherModal({
  isOpen,
  onClose,
  onSelectTool,
}: QuickLauncherModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tools based on query
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return TOOLS.slice(0, 8); // show first 8 tools by default
    }
    return TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    // Reset state & autofocus
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
      } else if (e.key === 'Enter') {
        if (results[selectedIndex]) {
          onSelectTool(results[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectTool]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2DDD8] dark:border-[#3A2D28]">
          <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[22px]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tools, schematics, guides..."
            className="flex-1 bg-transparent border-none text-sm sm:text-base text-[#1A1210] dark:text-[#F8F4F0] placeholder:text-[#918A83] focus:outline-none"
          />
          <kbd className="font-mono-meta text-[10px] bg-[#F7F6F4] dark:bg-[#15100E] px-2 py-0.5 rounded border border-[#E2DDD8] dark:border-[#3A2D28] text-[#918A83]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#E2DDD8]/40 dark:divide-[#3A2D28]/40">
          {results.length > 0 ? (
            results.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#FBECE6] dark:bg-[#38231C] text-[#8A4228] dark:text-[#E07A5F]'
                      : 'hover:bg-[#F7F6F4] dark:hover:bg-[#1B1412] text-[#1A1210] dark:text-[#F8F4F0]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-[20px] text-[#8A4228] dark:text-[#E07A5F] flex-shrink-0">
                      {tool.icon}
                    </span>
                    <div className="truncate">
                      <div className="font-headline font-semibold text-sm truncate">
                        {tool.title}
                      </div>
                      <div className="text-xs text-[#68615A] dark:text-[#A8A19B] truncate">
                        {tool.description}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono-meta text-[10px] text-[#918A83] dark:text-[#766F69] uppercase px-2 py-0.5 rounded bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] ml-2 flex-shrink-0">
                    {tool.category.replace('-', ' ')}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs sm:text-sm text-[#68615A] dark:text-[#A8A19B]">
              No tools matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-[#F7F6F4] dark:bg-[#15100E] border-t border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-between text-[11px] text-[#918A83]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>{TOOLS.length} {TOOLS.length === 1 ? 'tool' : 'tools'} ready</span>
        </div>
      </div>
    </div>
  );
}
