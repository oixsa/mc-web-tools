'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { QuickLauncherModal } from '@/app/components/QuickLauncherModal';
import { useTheme } from '@/app/hooks/useTheme';

type PyramidSetup = 'single' | 'double' | 'quad' | 'six';
type MineralType = 'iron' | 'gold' | 'emerald' | 'diamond' | 'netherite';

interface SetupDetail {
  id: PyramidSetup;
  name: string;
  beaconCount: number;
  layers: number[]; // blocks per layer from top (3x3) to base
  totalBlocks: number;
  description: string;
}

const PYRAMID_SETUPS: SetupDetail[] = [
  {
    id: 'single',
    name: 'Single Beacon (Full Tier 4)',
    beaconCount: 1,
    layers: [9, 25, 49, 81],
    totalBlocks: 164,
    description: '1 Beacon with max range (50 blocks) and Tier II primary buff or Regeneration.',
  },
  {
    id: 'double',
    name: 'Double Beacon',
    beaconCount: 2,
    layers: [12, 30, 56, 90],
    totalBlocks: 188,
    description: '2 Beacons sharing base layers. Allows 2 simultaneous buffs.',
  },
  {
    id: 'quad',
    name: 'Quad (2×2) Beacon',
    beaconCount: 4,
    layers: [16, 36, 64, 100],
    totalBlocks: 216,
    description: 'Compact 4-beacon layout for multi-buff coverage.',
  },
  {
    id: 'six',
    name: 'Full 6-Beacon Complex (All Buffs)',
    beaconCount: 6,
    layers: [20, 42, 72, 110],
    totalBlocks: 244,
    description: 'All 5 primary buffs + Regeneration simultaneously active in your base!',
  },
];

const MINERALS: Record<MineralType, { name: string; hex: string; icon: string }> = {
  iron: { name: 'Iron Ingot', hex: '#D8D8D8', icon: 'Iron' },
  gold: { name: 'Gold Ingot', hex: '#FDF55F', icon: 'Gold' },
  emerald: { name: 'Emerald', hex: '#17DD62', icon: 'Emerald' },
  diamond: { name: 'Diamond', hex: '#4DEDED', icon: 'Diamond' },
  netherite: { name: 'Netherite Ingot', hex: '#443A3B', icon: 'Netherite' },
};

export default function BeaconCalculatorPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // States
  const [setupId, setSetupId] = useState<PyramidSetup>('single');
  const [activeTiers, setActiveTiers] = useState<number>(4); // 1, 2, 3, or 4 tiers
  const [mineral, setMineral] = useState<MineralType>('iron');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const currentSetup = useMemo(
    () => PYRAMID_SETUPS.find((s) => s.id === setupId) || PYRAMID_SETUPS[0],
    [setupId]
  );

  // Calculate blocks based on selected tier count
  const calculatedBlocks = useMemo(() => {
    return currentSetup.layers.slice(0, activeTiers).reduce((acc, cur) => acc + cur, 0);
  }, [currentSetup, activeTiers]);

  const rawIngots = calculatedBlocks * 9;
  const stacks = Math.floor(rawIngots / 64);
  const remainderIngots = rawIngots % 64;
  const shulkers = (rawIngots / (64 * 27)).toFixed(2);
  const blockStacks = Math.floor(calculatedBlocks / 64);
  const blockRemainder = calculatedBlocks % 64;

  const beaconRange = useMemo(() => {
    switch (activeTiers) {
      case 1:
        return '20 blocks';
      case 2:
        return '30 blocks';
      case 3:
        return '40 blocks';
      case 4:
        return '50 blocks';
      default:
        return '50 blocks';
    }
  }, [activeTiers]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F4] dark:bg-[#15100E] text-[#1A1210] dark:text-[#F8F4F0] transition-colors">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B] mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Tools</span>
          <span>/</span>
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Beacon Pyramid &amp; Mineral Calculator</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">diamond</span>
            Mechanics &amp; Calculators
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Beacon Pyramid &amp; Mineral Calculator
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Plan single and multi-beacon pyramids with exact block totals, ingot requirements, stack counts, and shulker box storage breakdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-5">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">tune</span>
                Beacon Setup Configuration
              </h2>

              {/* Pyramid Layout */}
              <div>
                <label className="block text-xs font-semibold mb-2">Pyramid Layout</label>
                <div className="grid grid-cols-2 gap-2">
                  {PYRAMID_SETUPS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSetupId(s.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        setupId === s.id
                          ? 'bg-[#FBECE6] dark:bg-[#38231C] border-[#8A4228] dark:border-[#E07A5F] text-[#8A4228] dark:text-[#E07A5F] font-semibold'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B] hover:border-gray-400'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.name}</div>
                      <div className="text-[10px] text-[#918A83] mt-0.5">{s.beaconCount} Beacon(s)</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier Height */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Pyramid Tiers</span>
                  <span className="font-mono text-[#8A4228] dark:text-[#E07A5F] font-bold">
                    Tier {activeTiers} (Range: {beaconRange})
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setActiveTiers(tier)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                        activeTiers === tier
                          ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] border-transparent'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
                      }`}
                    >
                      Tier {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mineral Type */}
              <div className="pt-2 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <label className="block text-xs font-semibold mb-2">Mineral Material</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(Object.keys(MINERALS) as MineralType[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMineral(m)}
                      className={`p-2 rounded-lg border text-xs font-semibold capitalize flex flex-col items-center gap-1 transition-all ${
                        mineral === m
                          ? 'bg-[#FBECE6] dark:bg-[#38231C] border-[#8A4228] dark:border-[#E07A5F] text-[#8A4228] dark:text-[#E07A5F]'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-xs border border-black/20" style={{ backgroundColor: MINERALS[m].hex }} />
                      <span className="text-[11px] truncate">{m}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Metrics Card */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <h3 className="text-xs font-bold text-[#68615A] dark:text-[#A8A19B] uppercase tracking-wider mb-4">
                Materials Gathering Checklist
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  <div className="text-xs text-[#68615A] dark:text-[#A8A19B]">Mineral Blocks</div>
                  <div className="text-2xl font-headline font-bold text-[#8A4228] dark:text-[#E07A5F]">
                    {calculatedBlocks}
                  </div>
                  <div className="text-[10px] text-[#918A83] mt-0.5">
                    {blockStacks} stacks + {blockRemainder}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  <div className="text-xs text-[#68615A] dark:text-[#A8A19B]">Total Ingots / Gems</div>
                  <div className="text-2xl font-headline font-bold text-[#8A4228] dark:text-[#E07A5F]">
                    {rawIngots}
                  </div>
                  <div className="text-[10px] text-[#918A83] mt-0.5">9 per block</div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  <div className="text-xs text-[#68615A] dark:text-[#A8A19B]">Ingot Stacks</div>
                  <div className="text-2xl font-headline font-bold">
                    {stacks}
                  </div>
                  <div className="text-[10px] text-[#918A83] mt-0.5">
                    + {remainderIngots} loose
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  <div className="text-xs text-[#68615A] dark:text-[#A8A19B]">Shulker Boxes</div>
                  <div className="text-2xl font-headline font-bold text-emerald-600 dark:text-emerald-400">
                    {shulkers}
                  </div>
                  <div className="text-[10px] text-[#918A83] mt-0.5">full storage boxes</div>
                </div>
              </div>

              {/* Layer-by-Layer Block Breakdown */}
              <div className="mt-6 pt-5 border-t border-[#E2DDD8] dark:border-[#3A2D28] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#68615A] dark:text-[#A8A19B]">
                  Layer Construction Order (Top to Bottom)
                </h4>

                <div className="space-y-2 text-xs">
                  {currentSetup.layers.slice(0, activeTiers).map((blocks, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]"
                    >
                      <span className="font-semibold">
                        Layer {idx + 1} ({idx === 0 ? 'Directly below Beacon' : `Tier ${idx + 1}`})
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[#8A4228] dark:text-[#E07A5F]">{blocks} Blocks</span>
                        <span className="font-mono text-[#918A83]">({blocks * 9} Ingots)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy Summary Button */}
              <button
                type="button"
                onClick={() => {
                  const summary = `Beacon Setup: ${currentSetup.name} (Tier ${activeTiers})\nTotal Blocks: ${calculatedBlocks}\nTotal Ingots: ${rawIngots} (${stacks} stacks + ${remainderIngots})\nShulkers: ${shulkers}\nRange: ${beaconRange}`;
                  navigator.clipboard.writeText(summary);
                  triggerToast('Copied beacon materials summary!');
                }}
                className="w-full mt-5 py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-bold hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy Materials Checklist
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <QuickLauncherModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={(tool) => { window.location.href = tool.href; }}
      />
    </div>
  );
}
