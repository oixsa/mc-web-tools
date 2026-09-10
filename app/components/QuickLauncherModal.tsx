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
    const timer = setTimeout(() => {
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
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, results, selectedIndex, onClose, onSelectTool]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      {/* M3 Dialog Container (28px corner radius & surface-container-high) */}
      <div
        className="w-full max-w-xl bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input (M3 Docked Search) */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--md-sys-color-outline-variant)]/40">
          <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[22px]">
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
            placeholder="Search tools, calculators, generators..."
            className="flex-1 bg-transparent border-none text-sm sm:text-base text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-outline)] focus:outline-none"
          />
          <kbd className="font-mono-meta text-[10px] bg-[var(--md-sys-color-surface-container-lowest)] px-2 py-0.5 rounded-full border border-[var(--md-sys-color-outline-variant)]/60 text-[var(--md-sys-color-outline)] shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2.5 space-y-1">
          {results.length > 0 ? (
            results.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    onSelectTool(tool);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] shadow-2xs'
                      : 'hover:bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-[var(--md-sys-color-on-secondary-container)]/10 text-[var(--md-sys-color-on-secondary-container)]'
                          : 'bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-primary)]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {tool.icon}
                      </span>
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-semibold truncate">
                        {tool.title}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          isSelected
                            ? 'text-[var(--md-sys-color-on-secondary-container)]/80'
                            : 'text-[var(--md-sys-color-on-surface-variant)]'
                        }`}
                      >
                        {tool.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`font-mono-meta text-[10px] capitalize px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-[var(--md-sys-color-on-secondary-container)]/15 text-[var(--md-sys-color-on-secondary-container)] font-bold'
                          : 'bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-outline)]'
                      }`}
                    >
                      {tool.category.replace('-', ' ')}
                    </span>
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isSelected
                          ? 'text-[var(--md-sys-color-on-secondary-container)]'
                          : 'text-[var(--md-sys-color-outline)]'
                      }`}
                    >
                      subdirectory_arrow_left
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-[var(--md-sys-color-on-surface-variant)] text-sm">
              No matching tools found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Dialog Footer Bar with Keyboard Shortcuts */}
        <div className="px-5 py-3 border-t border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container)] flex items-center justify-between text-[11px] text-[var(--md-sys-color-outline)] font-mono-meta">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[var(--md-sys-color-primary)] font-bold">
            Kita Tools
          </span>
        </div>
      </div>
    </div>
  );
}
