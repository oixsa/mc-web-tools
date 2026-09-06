'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { QuickLauncherModal } from '@/app/components/QuickLauncherModal';
import { useTheme } from '@/app/hooks/useTheme';

export default function NetherPortalPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mode, setMode] = useState<'overworld-to-nether' | 'nether-to-overworld'>('overworld-to-nether');
  const [x, setX] = useState<number>(100);
  const [y, setY] = useState<number>(64);
  const [z, setZ] = useState<number>(-200);
  const [copied, setCopied] = useState(false);

  // Math calculations
  const targetX = mode === 'overworld-to-nether' ? Math.floor(x / 8) : Math.floor(x * 8);
  const targetY = y;
  const targetZ = mode === 'overworld-to-nether' ? Math.floor(z / 8) : Math.floor(z * 8);

  const tpCommand = `/tp @s ${targetX} ${targetY} ${targetZ}`;

  const copyCommand = () => {
    navigator.clipboard.writeText(tpCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F4] dark:bg-[#15100E] text-[#1A1210] dark:text-[#F8F4F0] transition-colors">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B] mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Tools</span>
          <span>/</span>
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Nether Portal Calculator</span>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] shadow-2xs mb-3">
            <span className="w-2 h-2 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
            <span className="font-mono-meta text-[11px] font-bold uppercase tracking-wider text-[#68615A] dark:text-[#A8A19B]">
              Survival &amp; Travel
            </span>
          </div>
          <h1 className="text-3xl font-headline font-bold tracking-tight mb-2">
            Nether Portal Coordinate Calculator
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B]">
            Minecraft calculates 1 block in the Nether as 8 blocks in the Overworld. Use this tool to build perfectly paired portals.
          </p>
        </div>

        {/* Direction Switcher Tabs */}
        <div className="flex rounded-xl bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] p-1 mb-8 max-w-md">
          <button
            type="button"
            onClick={() => setMode('overworld-to-nether')}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'overworld-to-nether'
                ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] shadow-2xs'
                : 'text-[#68615A] dark:text-[#A8A19B] hover:text-[#1A1210] dark:hover:text-[#F8F4F0]'
            }`}
          >
            Overworld → Nether (÷ 8)
          </button>
          <button
            type="button"
            onClick={() => setMode('nether-to-overworld')}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'nether-to-overworld'
                ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] shadow-2xs'
                : 'text-[#68615A] dark:text-[#A8A19B] hover:text-[#1A1210] dark:hover:text-[#F8F4F0]'
            }`}
          >
            Nether → Overworld (× 8)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] shadow-2xs">
              <h2 className="text-sm font-mono-meta font-bold uppercase text-[#68615A] dark:text-[#A8A19B] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#8A4228] dark:text-[#E07A5F]">
                  location_on
                </span>
                {mode === 'overworld-to-nether' ? 'Source: Overworld Coordinates' : 'Source: Nether Coordinates'}
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#68615A] dark:text-[#A8A19B]">
                    X Coordinate
                  </label>
                  <input
                    type="number"
                    value={x}
                    onChange={(e) => setX(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] font-mono text-sm focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#68615A] dark:text-[#A8A19B]">
                    Y (Height)
                  </label>
                  <input
                    type="number"
                    value={y}
                    onChange={(e) => setY(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] font-mono text-sm focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#68615A] dark:text-[#A8A19B]">
                    Z Coordinate
                  </label>
                  <input
                    type="number"
                    value={z}
                    onChange={(e) => setZ(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] font-mono text-sm focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F]"
                  />
                </div>
              </div>
            </div>

            {/* Portal Tips */}
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#201815]/60 border border-[#E2DDD8] dark:border-[#3A2D28] text-xs text-[#68615A] dark:text-[#A8A19B] space-y-2">
              <div className="font-semibold text-[#1A1210] dark:text-[#F8F4F0] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                  info
                </span>
                Portal Pairing Rules
              </div>
              <p>
                Minecraft searches a <strong>128-block radius</strong> in the destination dimension. If an existing portal is found within that range, it links automatically.
              </p>
              <p>
                To avoid cross-portal interference, place both portals at exactly these coordinates.
              </p>
            </div>
          </div>

          {/* Results Output */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] shadow-2xs">
              <h2 className="text-sm font-mono-meta font-bold uppercase text-[#68615A] dark:text-[#A8A19B] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#8A4228] dark:text-[#E07A5F]">
                  my_location
                </span>
                {mode === 'overworld-to-nether' ? 'Target: Nether Coordinates' : 'Target: Overworld Coordinates'}
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-center">
                  <span className="text-[11px] text-[#68615A] dark:text-[#A8A19B] block">X</span>
                  <span className="text-xl font-bold font-mono text-[#8A4228] dark:text-[#E07A5F]">
                    {targetX}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-center">
                  <span className="text-[11px] text-[#68615A] dark:text-[#A8A19B] block">Y</span>
                  <span className="text-xl font-bold font-mono text-[#1A1210] dark:text-[#F8F4F0]">
                    {targetY}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-center">
                  <span className="text-[11px] text-[#68615A] dark:text-[#A8A19B] block">Z</span>
                  <span className="text-xl font-bold font-mono text-[#8A4228] dark:text-[#E07A5F]">
                    {targetZ}
                  </span>
                </div>
              </div>

              {/* Teleport Command Box */}
              <div className="pt-4 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <div className="text-xs font-semibold text-[#68615A] dark:text-[#A8A19B] mb-2">
                  Teleport Command
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0E0E0E] text-[#AAAAAA] font-mono text-xs">
                  <span className="flex-1 truncate">{tpCommand}</span>
                  <button
                    type="button"
                    onClick={copyCommand}
                    className="px-2.5 py-1 rounded bg-[#222222] hover:bg-[#333333] text-white text-[11px] font-sans font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
