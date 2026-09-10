'use client';

import { useMemo, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';

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
  const [setupId, setSetupId] = useState<PyramidSetup>('single');
  const [activeTiers, setActiveTiers] = useState<number>(4);
  const [mineral, setMineral] = useState<MineralType>('iron');
  const { copy, toastMessage } = useClipboard();

  const currentSetup = useMemo(
    () => PYRAMID_SETUPS.find((s) => s.id === setupId) || PYRAMID_SETUPS[0],
    [setupId]
  );

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

  const handleCopySummary = () => {
    const summary = `Beacon Setup: ${currentSetup.name} (Tier ${activeTiers})\nTotal Blocks: ${calculatedBlocks}\nTotal Ingots: ${rawIngots} (${stacks} stacks + ${remainderIngots})\nShulkers: ${shulkers}\nRange: ${beaconRange}`;
    copy(summary, 'Copied beacon materials summary!');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Beacon Pyramid & Mineral Calculator"
        description="Plan single and multi-beacon pyramids with exact block totals, ingot requirements, stack counts, and shulker box storage breakdowns."
        badge="Mechanics & Calculators"
        icon="diamond"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs space-y-5">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">tune</span>
              Beacon Setup Configuration
            </h2>

            {/* Pyramid Layout */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--md-sys-color-on-surface)]">Pyramid Layout</label>
              <div className="grid grid-cols-2 gap-2">
                {PYRAMID_SETUPS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSetupId(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      setupId === s.id
                        ? 'bg-[var(--md-sys-color-primary-container)] border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary-container)] font-semibold'
                        : 'bg-[var(--md-sys-color-surface-container-lowest)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:border-[var(--md-sys-color-outline)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">{s.name}</div>
                    <div className="text-[10px] text-[var(--md-sys-color-on-surface-variant)] mt-0.5">{s.beaconCount} Beacon(s)</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Height */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface)]">
                <span>Pyramid Tiers</span>
                <span className="font-mono text-[var(--md-sys-color-primary)] font-bold">
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
                        ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent'
                        : 'border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                    }`}
                  >
                    Tier {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Mineral Type */}
            <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]">
              <label className="block text-xs font-semibold mb-2 text-[var(--md-sys-color-on-surface)]">Mineral Material</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(Object.keys(MINERALS) as MineralType[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMineral(m)}
                    className={`p-2 rounded-lg border text-xs font-semibold capitalize flex flex-col items-center gap-1 transition-all ${
                      mineral === m
                        ? 'bg-[var(--md-sys-color-primary-container)] border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary-container)]'
                        : 'border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
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
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 sm:p-6 shadow-2xs">
            <h3 className="text-xs font-bold text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider mb-4">
              Materials Gathering Checklist
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline-variant)]">
                <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">Mineral Blocks</div>
                <div className="text-2xl font-headline font-bold text-[var(--md-sys-color-primary)]">
                  {calculatedBlocks}
                </div>
                <div className="text-[10px] text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
                  {blockStacks} stacks + {blockRemainder}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline-variant)]">
                <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">Total Ingots / Gems</div>
                <div className="text-2xl font-headline font-bold text-[var(--md-sys-color-primary)]">
                  {rawIngots}
                </div>
                <div className="text-[10px] text-[var(--md-sys-color-on-surface-variant)] mt-0.5">9 per block</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline-variant)]">
                <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">Ingot Stacks</div>
                <div className="text-2xl font-headline font-bold text-[var(--md-sys-color-on-surface)]">
                  {stacks}
                </div>
                <div className="text-[10px] text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
                  + {remainderIngots} loose
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline-variant)]">
                <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">Shulker Boxes</div>
                <div className="text-2xl font-headline font-bold text-emerald-600 dark:text-emerald-400">
                  {shulkers}
                </div>
                <div className="text-[10px] text-[var(--md-sys-color-on-surface-variant)] mt-0.5">full storage boxes</div>
              </div>
            </div>

            {/* Layer-by-Layer Block Breakdown */}
            <div className="mt-6 pt-5 border-t border-[var(--md-sys-color-outline-variant)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
                Layer Construction Order (Top to Bottom)
              </h4>

              <div className="space-y-2 text-xs">
                {currentSetup.layers.slice(0, activeTiers).map((blocks, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline-variant)]"
                  >
                    <span className="font-semibold text-[var(--md-sys-color-on-surface)]">
                      Layer {idx + 1} ({idx === 0 ? 'Directly below Beacon' : `Tier ${idx + 1}`})
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[var(--md-sys-color-primary)]">{blocks} Blocks</span>
                      <span className="font-mono text-[var(--md-sys-color-on-surface-variant)]">({blocks * 9} Ingots)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Summary Button */}
            <button
              type="button"
              onClick={handleCopySummary}
              className="w-full mt-5 py-2.5 rounded-xl bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              Copy Materials Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
