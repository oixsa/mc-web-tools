'use client';

import { useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';

export default function NetherPortalPage() {
  const [mode, setMode] = useState<'overworld-to-nether' | 'nether-to-overworld'>('overworld-to-nether');
  const [x, setX] = useState<number>(100);
  const [y, setY] = useState<number>(64);
  const [z, setZ] = useState<number>(-200);
  const { copy, copied, toastMessage } = useClipboard();

  // Math calculations
  const targetX = mode === 'overworld-to-nether' ? Math.floor(x / 8) : Math.floor(x * 8);
  const targetY = y;
  const targetZ = mode === 'overworld-to-nether' ? Math.floor(z / 8) : Math.floor(z * 8);

  const tpCommand = `/tp @s ${targetX} ${targetY} ${targetZ}`;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Nether Portal Coordinate Calculator"
        description="Minecraft calculates 1 block in the Nether as 8 blocks in the Overworld. Use this tool to build perfectly paired portals."
        badge="Survival & Travel"
        icon="calculate"
      />

      {/* Direction Switcher Tabs */}
      <div className="flex rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 p-1 mb-8 max-w-md">
        <button
          type="button"
          onClick={() => setMode('overworld-to-nether')}
          className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'overworld-to-nether'
              ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-2xs'
              : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]'
          }`}
        >
          Overworld → Nether (÷ 8)
        </button>
        <button
          type="button"
          onClick={() => setMode('nether-to-overworld')}
          className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'nether-to-overworld'
              ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-2xs'
              : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]'
          }`}
        >
          Nether → Overworld (× 8)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 shadow-2xs">
            <h2 className="text-sm font-mono-meta font-bold uppercase text-[var(--md-sys-color-on-surface-variant)] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[var(--md-sys-color-primary)]">
                location_on
              </span>
              {mode === 'overworld-to-nether' ? 'Source: Overworld Coordinates' : 'Source: Nether Coordinates'}
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--md-sys-color-on-surface-variant)]">
                  X Coordinate
                </label>
                <input
                  type="number"
                  value={x}
                  onChange={(e) => setX(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 font-mono text-sm focus:outline-none focus:border-[var(--md-sys-color-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--md-sys-color-on-surface-variant)]">
                  Y (Height)
                </label>
                <input
                  type="number"
                  value={y}
                  onChange={(e) => setY(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 font-mono text-sm focus:outline-none focus:border-[var(--md-sys-color-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--md-sys-color-on-surface-variant)]">
                  Z Coordinate
                </label>
                <input
                  type="number"
                  value={z}
                  onChange={(e) => setZ(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 font-mono text-sm focus:outline-none focus:border-[var(--md-sys-color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* Portal Tips */}
          <div className="p-5 rounded-2xl bg-[var(--md-sys-color-surface-container-low)]/60 border border-[var(--md-sys-color-outline-variant)]/40 text-xs text-[var(--md-sys-color-on-surface-variant)] space-y-2">
            <div className="font-semibold text-[var(--md-sys-color-on-surface)] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[var(--md-sys-color-primary)]">
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
          <div className="p-6 rounded-2xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 shadow-2xs">
            <h2 className="text-sm font-mono-meta font-bold uppercase text-[var(--md-sys-color-on-surface-variant)] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[var(--md-sys-color-primary)]">
                my_location
              </span>
              {mode === 'overworld-to-nether' ? 'Target: Nether Coordinates' : 'Target: Overworld Coordinates'}
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 text-center">
                <span className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] block">X</span>
                <span className="text-xl font-bold font-mono text-[var(--md-sys-color-primary)]">
                  {targetX}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 text-center">
                <span className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] block">Y</span>
                <span className="text-xl font-bold font-mono text-[var(--md-sys-color-on-surface)]">
                  {targetY}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 text-center">
                <span className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] block">Z</span>
                <span className="text-xl font-bold font-mono text-[var(--md-sys-color-primary)]">
                  {targetZ}
                </span>
              </div>
            </div>

            {/* Teleport Command Box */}
            <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant)]/40">
              <div className="text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-2">
                Teleport Command
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] font-mono text-xs border border-[var(--md-sys-color-outline-variant)]/30">
                <span className="flex-1 truncate">{tpCommand}</span>
                <button
                  type="button"
                  onClick={() => copy(tpCommand, 'Teleport command copied to clipboard!')}
                  className="px-2.5 py-1 rounded-md bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:brightness-105 text-[11px] font-sans font-semibold transition-all flex items-center gap-1 cursor-pointer"
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
    </div>
  );
}
