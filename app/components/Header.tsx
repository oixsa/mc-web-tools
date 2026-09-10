'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV_ITEMS } from '../data/navigation';

interface HeaderProps {
  onOpenSearch: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function Header({ onOpenSearch, isDark, toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 dark:bg-[#201815]/90 backdrop-blur-md border-b border-[#E2DDD8] dark:border-[#3A2D28] transition-colors duration-200">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
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
            <span className="font-headline font-bold text-lg text-[#1A1210] dark:text-[#F8F4F0] tracking-tight">
              kita{' '}
              <span className="text-[#8A4228] dark:text-[#E07A5F] transition-colors">
                tools
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href === '/#explore-tools' && pathname === '/');
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#EFECE9] dark:bg-[#261D19] text-[#1A1210] dark:text-[#F8F4F0] font-semibold'
                      : 'text-[#68615A] dark:text-[#A8A19B] hover:text-[#1A1210] dark:hover:text-[#F8F4F0] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick Search, Utilities, Theme Switcher & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Launcher / Search trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center justify-between gap-3 px-3 h-10 w-48 lg:w-64 bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-lg text-xs text-[#68615A] dark:text-[#A8A19B] hover:border-[#CBC4BD] dark:hover:border-[#54413A] hover:text-[#1A1210] dark:hover:text-[#F8F4F0] transition-all"
            aria-label="Search tools"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#918A83] text-[18px]">
                search
              </span>
              <span>Quick launcher...</span>
            </div>
            <kbd className="font-mono-meta text-[10px] bg-white dark:bg-[#201815] px-1.5 py-0.5 rounded border border-[#E2DDD8] dark:border-[#3A2D28] text-[#918A83] shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Icon */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#68615A] dark:text-[#A8A19B] hover:bg-[#F7F6F4] dark:hover:bg-[#261D19] transition-colors"
            aria-label="Search tools"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* GitHub Icon */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex w-9 h-9 rounded-lg items-center justify-center text-[#68615A] dark:text-[#A8A19B] hover:text-[#1A1210] dark:hover:text-[#F8F4F0] hover:bg-[#F7F6F4] dark:hover:bg-[#261D19] transition-colors"
            aria-label="GitHub Repository"
          >
            <span className="material-symbols-outlined text-[20px]">code</span>
          </a>

          {/* Discord Icon */}
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex w-9 h-9 rounded-lg items-center justify-center text-[#68615A] dark:text-[#A8A19B] hover:text-[#1A1210] dark:hover:text-[#F8F4F0] hover:bg-[#F7F6F4] dark:hover:bg-[#261D19] transition-colors"
            aria-label="Community Discord"
          >
            <span className="material-symbols-outlined text-[20px]">forum</span>
          </a>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#68615A] dark:text-[#A8A19B] hover:text-[#8A4228] dark:hover:text-[#E07A5F] hover:bg-[#F7F6F4] dark:hover:bg-[#261D19] border border-transparent hover:border-[#E2DDD8] dark:hover:border-[#3A2D28] transition-all"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDark ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#68615A] dark:text-[#A8A19B] hover:bg-[#F7F6F4] dark:hover:bg-[#261D19] transition-colors ml-1"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-[#E2DDD8] dark:border-[#3A2D28] bg-white dark:bg-[#201815] shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1">
            {MAIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#1A1210] dark:text-[#F8F4F0] hover:bg-[#F7F6F4] dark:hover:bg-[#261D19] transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-[#918A83] text-[16px]">
                  arrow_forward
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-between text-xs text-[#68615A] dark:text-[#A8A19B]">
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">code</span>
                GitHub
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">forum</span>
                Discord
              </a>
            </div>
            <span className="font-mono-meta text-[11px] text-[#8A4228] dark:text-[#E07A5F] font-bold">
              v2.4 Active
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
