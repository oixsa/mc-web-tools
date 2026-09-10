'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, MobileNavbar } from './Navbar';

interface HeaderProps {
  onOpenSearch: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function Header({ onOpenSearch, isDark, toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[var(--md-sys-color-surface)]/95 backdrop-blur-md border-b border-[var(--md-sys-color-outline-variant)]/40 transition-colors duration-200">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Extracted Desktop Navbar */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="kita tools logo"
                width={32}
                height={32}
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline font-extrabold text-lg text-[var(--md-sys-color-on-surface)] tracking-tight">
                kita
              </span>
              <span className="font-headline font-bold text-lg text-[var(--md-sys-color-primary)] transition-colors">
                tools
              </span>
              <span className="hidden sm:inline-block font-mono-meta text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] ml-1">
                M3
              </span>
            </div>
          </Link>

          {/* Desktop Navbar Component */}
          <Navbar />
        </div>

        {/* Right: Quick Search, Social Links & M3 Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* M3 Search Bar / Quick Launcher trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center justify-between gap-3 px-3.5 h-10 w-48 lg:w-64 bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-surface-container-highest)] border border-transparent hover:border-[var(--md-sys-color-outline-variant)] rounded-full text-xs text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] transition-all cursor-pointer shadow-2xs group"
            aria-label="Search tools"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface-variant)] group-hover:text-[var(--md-sys-color-primary)] text-[18px] transition-colors">
                search
              </span>
              <span>Quick launcher...</span>
            </div>
            <kbd className="font-mono-meta text-[10px] bg-[var(--md-sys-color-surface-container-lowest)] px-2 py-0.5 rounded-full border border-[var(--md-sys-color-outline-variant)]/60 text-[var(--md-sys-color-outline)] shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)] transition-colors"
            aria-label="Search tools"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)] transition-colors"
            aria-label="GitHub Repository"
          >
            <span className="material-symbols-outlined text-[20px]">code</span>
          </a>

          {/* Theme Switcher Toggle (M3 Tonal Icon Button) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/40 transition-all cursor-pointer"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-[20px] transition-transform duration-200 hover:rotate-12">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)] transition-colors ml-1"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Component */}
      <MobileNavbar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
