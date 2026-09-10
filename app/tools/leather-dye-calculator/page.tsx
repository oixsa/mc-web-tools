'use client';

import { useMemo, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';
import {
  MINECRAFT_DYES,
  MinecraftDye,
  rgbToHex,
  rgbToInt,
} from '@/app/lib/minecraft-colors';

const DEFAULT_LEATHER_RGB: [number, number, number] = [160, 101, 64]; // #A06540

/**
 * Exact Vanilla Minecraft Leather Armor Dye Calculation Algorithm.
 */
function mixDyes(dyes: MinecraftDye[], startRgb?: [number, number, number]): [number, number, number] {
  if (dyes.length === 0) return startRgb || DEFAULT_LEATHER_RGB;

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let maxComponent = 0;
  let count = 0;

  if (startRgb) {
    totalR += startRgb[0];
    totalG += startRgb[1];
    totalB += startRgb[2];
    maxComponent = Math.max(maxComponent, startRgb[0], startRgb[1], startRgb[2]);
    count++;
  }

  for (const d of dyes) {
    totalR += d.rgb[0];
    totalG += d.rgb[1];
    totalB += d.rgb[2];
    maxComponent = Math.max(maxComponent, d.rgb[0], d.rgb[1], d.rgb[2]);
    count++;
  }

  const avgR = totalR / count;
  const avgG = totalG / count;
  const avgB = totalB / count;

  const maxAvg = Math.max(avgR, avgG, avgB);
  if (maxAvg === 0) return [0, 0, 0];

  const gain = maxComponent / maxAvg;

  return [
    Math.min(255, Math.floor(avgR * gain)),
    Math.min(255, Math.floor(avgG * gain)),
    Math.min(255, Math.floor(avgB * gain)),
  ];
}

export default function LeatherDyeCalculatorPage() {
  const [armorPiece, setArmorPiece] = useState<'helmet' | 'chestplate' | 'leggings' | 'boots'>('chestplate');
  const [selectedDyeIds, setSelectedDyeIds] = useState<string[]>(['blue_dye', 'white_dye']);
  const { copy, toastMessage, showToast } = useClipboard();

  const addDye = (id: string) => {
    if (selectedDyeIds.length >= 8) {
      showToast('Maximum 8 dyes can be combined in a single crafting table!');
      return;
    }
    setSelectedDyeIds((prev) => [...prev, id]);
  };

  const removeDyeAtIndex = (index: number) => {
    setSelectedDyeIds((prev) => prev.filter((_, idx) => idx !== index));
  };

  const activeDyes = useMemo(
    () => selectedDyeIds.map((id) => MINECRAFT_DYES.find((d) => d.id === id)!).filter(Boolean),
    [selectedDyeIds]
  );

  const mixedRgb = useMemo(() => mixDyes(activeDyes), [activeDyes]);
  const mixedHex = useMemo(() => rgbToHex(mixedRgb), [mixedRgb]);
  const mixedInt = useMemo(() => rgbToInt(mixedRgb), [mixedRgb]);

  // Modern /give command
  const giveCommand = useMemo(() => {
    return `/give @p leather_${armorPiece}[dyed_color=${mixedInt}] 1`;
  }, [armorPiece, mixedInt]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Leather Armor Dye Mixer"
        description="Simulate vanilla Minecraft's exact dye mixing formula across 5.7 million color combinations with crafting table recipes and /give commands."
        badge="Art & Customization"
        icon="palette"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Crafting Grid & Dyes Selector */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 shadow-2xs space-y-5">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">palette</span>
              Available Minecraft Dyes (Click to Add)
            </h2>

            {/* Dyes Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {MINECRAFT_DYES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => addDye(d.id)}
                  className="p-1.5 rounded-lg border border-[var(--md-sys-color-outline-variant)]/40 flex flex-col items-center gap-1 hover:border-[var(--md-sys-color-primary)] hover:scale-105 transition-all text-center cursor-pointer"
                  title={`Add ${d.name}`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: d.hex }}
                  />
                  <span className="text-[9px] font-semibold truncate w-full text-[var(--md-sys-color-on-surface)]">
                    {d.name.replace(' Dye', '')}
                  </span>
                </button>
              ))}
            </div>

            {/* Crafting Grid Slots */}
            <div className="pt-3 border-t border-[var(--md-sys-color-outline-variant)]/40">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">
                  Crafting Bench Ingredients ({selectedDyeIds.length}/8 Dyes)
                </label>
                {selectedDyeIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedDyeIds([])}
                    className="text-[11px] text-[var(--md-sys-color-error)] hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Base Armor Piece Slot */}
                <div className="w-12 h-12 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[24px]">
                    shield
                  </span>
                </div>

                {/* Dye Slots */}
                {activeDyes.map((dye, idx) => (
                  <div
                    key={`${dye.id}-${idx}`}
                    onClick={() => removeDyeAtIndex(idx)}
                    className="w-12 h-12 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 flex flex-col items-center justify-center cursor-pointer relative group hover:border-[var(--md-sys-color-error)] transition-colors"
                    title="Click to remove"
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                      style={{ backgroundColor: dye.hex }}
                    />
                    <span className="text-[8px] truncate max-w-[40px] text-[var(--md-sys-color-outline)] mt-0.5">
                      {dye.name.replace(' Dye', '')}
                    </span>
                    <span className="hidden group-hover:flex absolute inset-0 bg-[var(--md-sys-color-error)]/80 rounded-xl items-center justify-center text-white text-[10px] font-bold">
                      ✕
                    </span>
                  </div>
                ))}

                {Array.from({ length: Math.max(0, 8 - activeDyes.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-12 h-12 rounded-xl border border-dashed border-[var(--md-sys-color-outline-variant)]/60 flex items-center justify-center text-[var(--md-sys-color-outline)] text-xs"
                  >
                    +
                  </div>
                ))}
              </div>
            </div>

            {/* Armor Piece Selector */}
            <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]/40">
              <label className="block text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                Armor Piece
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'helmet' as const, label: 'Helmet' },
                  { id: 'chestplate' as const, label: 'Chestplate' },
                  { id: 'leggings' as const, label: 'Leggings' },
                  { id: 'boots' as const, label: 'Boots' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setArmorPiece(p.id)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      armorPiece === p.id
                        ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent'
                        : 'border-[var(--md-sys-color-outline-variant)]/40 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Color Preview & Command Output */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-6 shadow-2xs space-y-5">
            <h3 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">check_circle</span>
              Mixed Armor Color Result
            </h3>

            <div className="flex items-center gap-5">
              {/* Large Color Swatch with Armor Silhouette */}
              <div
                className="w-24 h-24 rounded-2xl border-2 border-black/20 shadow-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ backgroundColor: mixedHex }}
              >
                <span className="material-symbols-outlined text-white/90 text-[48px] drop-shadow-md">
                  shield
                </span>
              </div>

              <div className="space-y-1 text-xs text-[var(--md-sys-color-on-surface-variant)]">
                <div>
                  <span className="text-[var(--md-sys-color-outline)]">Hex Color: </span>
                  <strong className="font-mono text-base text-[var(--md-sys-color-primary)]">{mixedHex}</strong>
                </div>
                <div>
                  <span className="text-[var(--md-sys-color-outline)]">Decimal Color: </span>
                  <strong className="font-mono text-[var(--md-sys-color-on-surface)]">{mixedInt}</strong>
                </div>
                <div>
                  <span className="text-[var(--md-sys-color-outline)]">RGB Channels: </span>
                  <strong className="font-mono text-[var(--md-sys-color-on-surface)]">R:{mixedRgb[0]} G:{mixedRgb[1]} B:{mixedRgb[2]}</strong>
                </div>
              </div>
            </div>

            {/* /give command */}
            <div className="pt-3 border-t border-[var(--md-sys-color-outline-variant)]/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--md-sys-color-on-surface)]">Minecraft 1.20.5+ Command</span>
                <button
                  type="button"
                  onClick={() => copy(giveCommand, 'Copied /give command!')}
                  className="text-[var(--md-sys-color-primary)] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  Copy
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all border border-[var(--md-sys-color-outline-variant)]/30">
                {giveCommand}
              </pre>
            </div>

            <button
              type="button"
              onClick={() => copy(giveCommand, 'Copied /give command!')}
              className="w-full py-2.5 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-bold hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              Copy /give Command
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
