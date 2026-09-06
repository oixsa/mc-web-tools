'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AboutSection } from '../components/AboutSection';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { QuickLauncherModal } from '../components/QuickLauncherModal';
import { useTheme } from '../hooks/useTheme';

export default function AboutPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F4] dark:bg-[#15100E] text-[#1A1210] dark:text-[#F8F4F0] transition-colors">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 w-full pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">About</span>
          </div>
        </div>

        <AboutSection />
      </main>

      <Footer />

      {isSearchOpen && (
        <QuickLauncherModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectTool={(tool) => {
            window.location.href = tool.href;
          }}
        />
      )}
    </div>
  );
}
