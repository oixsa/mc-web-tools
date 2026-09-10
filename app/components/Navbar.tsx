'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV_ITEMS } from '../data/navigation';
import { useTheme } from '../hooks/useTheme';

export interface NavbarProps {
  onOpenSearch?: () => void;
  isDark?: boolean;
  toggleTheme?: () => void;
  className?: string;
}

/**
 * Desktop Material 3 Navigation Links Component.
 * Displays navigation links with M3 tonal active indicators.
 */
export function NavLinks({ className = '' }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={`hidden md:flex items-center gap-1.5 text-sm font-medium ${className}`}
      aria-label="Main Navigation"
    >
      {MAIN_NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === '/#explore-tools' && pathname === '/');
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-150 ${
              isActive
                ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold shadow-2xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile Material 3 Navigation Drawer Component.
 * Displays responsive full-width navigation drawer with active state pills.
 */
export function MobileNavbar({ isOpen, onClose }: MobileNavbarProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container-low)] px-4 pt-3 pb-5 shadow-xl animate-in slide-in-from-top-2 duration-150">
      <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center justify-between ${
                isActive
                  ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                  : 'text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)]'
              }`}
            >
              <span>{item.label}</span>
              <span className="material-symbols-outlined text-[var(--md-sys-color-outline)] text-[18px]">
                arrow_forward
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/40 flex items-center justify-between text-xs text-[var(--md-sys-color-on-surface-variant)]">
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/oixsa/kita-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            GitHub
          </a>
        </div>
        <span className="font-mono-meta text-[11px] text-[var(--md-sys-color-primary)] font-bold">
          v2.5 M3
        </span>
      </div>
    </div>
  );
}

/**
 * Complete Material 3 Top Navigation Bar Component.
 * Integrates brand identity, navigation links, quick search launcher,
 * GitHub repository shortcut, theme switcher, and mobile drawer.
 */
export function Navbar({
  onOpenSearch,
  isDark: propIsDark,
  toggleTheme: propToggleTheme,
  className = '',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const themeHook = useTheme();

  const isDark = propIsDark !== undefined ? propIsDark : themeHook.isDark;
  const toggleTheme = propToggleTheme || themeHook.toggleTheme;

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 bg-[var(--md-sys-color-surface)]/95 backdrop-blur-md border-b border-[var(--md-sys-color-outline-variant)]/40 transition-colors duration-200 ${className}`}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Desktop Navigation */}
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

          {/* Desktop Navigation Links */}
          <NavLinks />
        </div>

        {/* Right: Quick Search, GitHub Link & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger Button (Desktop) */}
          {onOpenSearch && (
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
          )}

          {/* Search Trigger Button (Mobile) */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)] transition-colors"
              aria-label="Search tools"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/oixsa/kita-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)] transition-colors"
            aria-label="GitHub Repository"
          >
            <span className="material-symbols-outlined text-[20px]">code</span>
          </a>

          {/* Theme Switcher Button */}
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

          {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Drawer Menu */}
      <MobileNavbar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}

export default Navbar;
