'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

interface DyeItem {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
}

const MINECRAFT_DYES: DyeItem[] = [
  { id: 'white_dye', name: 'White Dye', hex: '#F9FFFE', rgb: [249, 255, 254] },
  { id: 'orange_dye', name: 'Orange Dye', hex: '#F9801D', rgb: [249, 128, 29] },
  { id: 'magenta_dye', name: 'Magenta Dye', hex: '#C74EBD', rgb: [199, 78, 189] },
  { id: 'light_blue_dye', name: 'Light Blue Dye', hex: '#3AB3DA', rgb: [58, 179, 218] },
  { id: 'yellow_dye', name: 'Yellow Dye', hex: '#FED83D', rgb: [254, 216, 61] },
  { id: 'lime_dye', name: 'Lime Dye', hex: '#80C71F', rgb: [128, 199, 31] },
  { id: 'pink_dye', name: 'Pink Dye', hex: '#F38BAA', rgb: [243, 139, 170] },
  { id: 'gray_dye', name: 'Gray Dye', hex: '#474F52', rgb: [71, 79, 82] },
  { id: 'light_gray_dye', name: 'Light Gray Dye', hex: '#9D9D97', rgb: [157, 157, 151] },
  { id: 'cyan_dye', name: 'Cyan Dye', hex: '#169C9C', rgb: [22, 156, 156] },
  { id: 'purple_dye', name: 'Purple Dye', hex: '#8932B8', rgb: [137, 50, 184] },
  { id: 'blue_dye', name: 'Blue Dye', hex: '#3C44AA', rgb: [60, 68, 170] },
  { id: 'brown_dye', name: 'Brown Dye', hex: '#835432', rgb: [131, 84, 50] },
  { id: 'green_dye', name: 'Green Dye', hex: '#5E7C16', rgb: [94, 124, 22] },
  { id: 'red_dye', name: 'Red Dye', hex: '#B02E26', rgb: [176, 46, 38] },
  { id: 'black_dye', name: 'Black Dye', hex: '#1D1D21', rgb: [29, 29, 33] },
];

const DEFAULT_LEATHER_RGB: [number, number, number] = [160, 101, 64]; // #A06540

/**
 * Exact Vanilla Minecraft Leather Armor Dye Calculation Algorithm.
 */
function mixDyes(dyes: DyeItem[], startRgb?: [number, number, number]): [number, number, number] {
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

function rgbToHex([r, g, b]: [number, number, number]): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToInt([r, g, b]: [number, number, number]): number {
  return (r << 16) + (g << 8) + b;
}

export default function LeatherDyeCalculatorPage() {
  // States
  const [armorPiece, setArmorPiece] = useState<'helmet' | 'chestplate' | 'leggings' | 'boots'>('chestplate');
  const [selectedDyeIds, setSelectedDyeIds] = useState<string[]>(['blue_dye', 'white_dye']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const addDye = (id: string) => {
    if (selectedDyeIds.length >= 8) {
      triggerToast('Maximum 8 dyes can be combined in a single crafting table!');
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
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B] mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Tools</span>
          <span>/</span>
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Leather Armor Dye Mixer</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">palette</span>
            Art &amp; Customization
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Leather Armor Dye Mixer
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Simulate vanilla Minecraft&apos;s exact dye mixing formula across 5.7 million color combinations with crafting table recipes and <code>/give</code> commands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Crafting Grid & Dyes Selector */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-5">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">palette</span>
                Available Minecraft Dyes (Click to Add)
              </h2>

              {/* Dyes Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {MINECRAFT_DYES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => addDye(d.id)}
                    className="p-1.5 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] flex flex-col items-center gap-1 hover:border-[#8A4228] dark:hover:border-[#E07A5F] hover:scale-105 transition-all text-center"
                    title={`Add ${d.name}`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                      style={{ backgroundColor: d.hex }}
                    />
                    <span className="text-[9px] font-semibold truncate w-full">{d.name.replace(' Dye', '')}</span>
                  </button>
                ))}
              </div>

              {/* Crafting Grid Slots */}
              <div className="pt-3 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold">
                    Crafting Bench Ingredients ({selectedDyeIds.length}/8 Dyes)
                  </label>
                  {selectedDyeIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedDyeIds([])}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Base Armor Piece Slot */}
                  <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-black/40 border border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[24px]">
                      shield
                    </span>
                  </div>

                  {/* Dye Slots */}
                  {activeDyes.map((dye, idx) => (
                    <div
                      key={`${dye.id}-${idx}`}
                      onClick={() => removeDyeAtIndex(idx)}
                      className="w-12 h-12 rounded-xl bg-black/5 dark:bg-black/40 border border-[#E2DDD8] dark:border-[#3A2D28] flex flex-col items-center justify-center cursor-pointer relative group hover:border-red-500 transition-colors"
                      title="Click to remove"
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: dye.hex }}
                      />
                      <span className="text-[8px] truncate max-w-[40px] text-[#918A83] mt-0.5">
                        {dye.name.replace(' Dye', '')}
                      </span>
                      <span className="hidden group-hover:flex absolute inset-0 bg-red-500/80 rounded-xl items-center justify-center text-white text-[10px] font-bold">
                        ✕
                      </span>
                    </div>
                  ))}

                  {Array.from({ length: Math.max(0, 8 - activeDyes.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="w-12 h-12 rounded-xl border border-dashed border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-center text-[#918A83] text-xs"
                    >
                      +
                    </div>
                  ))}
                </div>
              </div>

              {/* Armor Piece Selector */}
              <div className="pt-2 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <label className="block text-xs font-semibold mb-1.5">Armor Piece</label>
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
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        armorPiece === p.id
                          ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] border-transparent'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
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
            {/* Color Preview Card */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-6 shadow-2xs space-y-5">
              <h3 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">check_circle</span>
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

                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-[#918A83]">Hex Color: </span>
                    <strong className="font-mono text-base text-[#8A4228] dark:text-[#E07A5F]">{mixedHex}</strong>
                  </div>
                  <div>
                    <span className="text-[#918A83]">Decimal Color: </span>
                    <strong className="font-mono">{mixedInt}</strong>
                  </div>
                  <div>
                    <span className="text-[#918A83]">RGB Channels: </span>
                    <strong className="font-mono">R:{mixedRgb[0]} G:{mixedRgb[1]} B:{mixedRgb[2]}</strong>
                  </div>
                </div>
              </div>

              {/* /give command */}
              <div className="pt-3 border-t border-[#E2DDD8] dark:border-[#3A2D28] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Minecraft 1.20.5+ Command</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(giveCommand);
                      triggerToast('Copied /give command!');
                    }}
                    className="text-[#8A4228] dark:text-[#E07A5F] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    Copy
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/5 dark:bg-black/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all border border-[#E2DDD8]/60 dark:border-[#3A2D28]/60">
                  {giveCommand}
                </pre>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(giveCommand);
                  triggerToast('Copied /give command!');
                }}
                className="w-full py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-bold hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
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
