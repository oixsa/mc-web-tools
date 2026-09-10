'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QuickLauncherModal } from './QuickLauncherModal';
import { useTheme } from '../hooks/useTheme';
import { Tool } from '../types/tools';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  // Global keyboard shortcut listener for Command/Ctrl + K
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

  const handleSelectTool = (tool: Tool) => {
    router.push(tool.href);
    setIsSearchOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] transition-colors duration-200">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
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
