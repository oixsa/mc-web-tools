'use client';

import { useMemo, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';
import { colorDistance, hexToRgb } from '@/app/lib/minecraft-colors';

interface BlockData {
  id: string;
  name: string;
  category: string;
  hex: string;
}

const MINECRAFT_BLOCKS: BlockData[] = [
  // Stones & Grays
  { id: 'stone', name: 'Stone', category: 'Stone', hex: '#7D7D7D' },
  { id: 'smooth_stone', name: 'Smooth Stone', category: 'Stone', hex: '#A1A1A1' },
  { id: 'andesite', name: 'Andesite', category: 'Stone', hex: '#878787' },
  { id: 'polished_andesite', name: 'Polished Andesite', category: 'Stone', hex: '#858585' },
  { id: 'cobblestone', name: 'Cobblestone', category: 'Stone', hex: '#5E5E5E' },
  { id: 'stone_bricks', name: 'Stone Bricks', category: 'Stone', hex: '#757575' },
  { id: 'cracked_stone_bricks', name: 'Cracked Stone Bricks', category: 'Stone', hex: '#696969' },
  { id: 'mossy_stone_bricks', name: 'Mossy Stone Bricks', category: 'Stone', hex: '#737868' },
  { id: 'mossy_cobblestone', name: 'Mossy Cobblestone', category: 'Stone', hex: '#586350' },
  { id: 'deepslate', name: 'Deepslate', category: 'Deepslate', hex: '#3E3E43' },
  { id: 'cobbled_deepslate', name: 'Cobbled Deepslate', category: 'Deepslate', hex: '#343439' },
  { id: 'polished_deepslate', name: 'Polished Deepslate', category: 'Deepslate', hex: '#3A3A40' },
  { id: 'deepslate_tiles', name: 'Deepslate Tiles', category: 'Deepslate', hex: '#36363B' },
  { id: 'deepslate_bricks', name: 'Deepslate Bricks', category: 'Deepslate', hex: '#313136' },
  { id: 'blackstone', name: 'Blackstone', category: 'Nether', hex: '#2A252B' },
  { id: 'polished_blackstone', name: 'Polished Blackstone', category: 'Nether', hex: '#242025' },
  { id: 'bedrock', name: 'Bedrock', category: 'Stone', hex: '#161616' },
  { id: 'obsidian', name: 'Obsidian', category: 'Stone', hex: '#120C1F' },
  { id: 'tuff', name: 'Tuff', category: 'Stone', hex: '#6C6D66' },

  // Sand & Warm Neutrals
  { id: 'sand', name: 'Sand', category: 'Sand', hex: '#DBD3A0' },
  { id: 'sandstone', name: 'Sandstone', category: 'Sand', hex: '#D8CE9B' },
  { id: 'smooth_sandstone', name: 'Smooth Sandstone', category: 'Sand', hex: '#E0D6A5' },
  { id: 'birch_planks', name: 'Birch Planks', category: 'Wood', hex: '#C6B67A' },
  { id: 'stripped_birch_log', name: 'Stripped Birch Log', category: 'Wood', hex: '#BFB586' },
  { id: 'oak_planks', name: 'Oak Planks', category: 'Wood', hex: '#A2824E' },
  { id: 'stripped_oak_log', name: 'Stripped Oak Log', category: 'Wood', hex: '#AD915E' },
  { id: 'spruce_planks', name: 'Spruce Planks', category: 'Wood', hex: '#735433' },
  { id: 'dark_oak_planks', name: 'Dark Oak Planks', category: 'Wood', hex: '#422A15' },
  { id: 'mangrove_planks', name: 'Mangrove Planks', category: 'Wood', hex: '#763631' },

  // Terracotta & Red Sand
  { id: 'red_sand', name: 'Red Sand', category: 'Sand', hex: '#BF6721' },
  { id: 'red_sandstone', name: 'Red Sandstone', category: 'Sand', hex: '#B5601D' },
  { id: 'terracotta', name: 'Terracotta', category: 'Terracotta', hex: '#965C42' },
  { id: 'white_terracotta', name: 'White Terracotta', category: 'Terracotta', hex: '#D1B1A1' },
  { id: 'orange_terracotta', name: 'Orange Terracotta', category: 'Terracotta', hex: '#A05325' },
  { id: 'yellow_terracotta', name: 'Yellow Terracotta', category: 'Terracotta', hex: '#BA8523' },
  { id: 'brown_terracotta', name: 'Brown Terracotta', category: 'Terracotta', hex: '#4D3223' },
  { id: 'red_terracotta', name: 'Red Terracotta', category: 'Terracotta', hex: '#8E3C2E' },

  // Copper Family
  { id: 'cut_copper', name: 'Cut Copper', category: 'Copper', hex: '#C06B4F' },
  { id: 'exposed_cut_copper', name: 'Exposed Cut Copper', category: 'Copper', hex: '#9E7A67' },
  { id: 'weathered_cut_copper', name: 'Weathered Cut Copper', category: 'Copper', hex: '#63876D' },
  { id: 'oxidized_cut_copper', name: 'Oxidized Cut Copper', category: 'Copper', hex: '#52A38A' },
  { id: 'prismarine', name: 'Prismarine', category: 'Ocean', hex: '#5C9087' },
  { id: 'dark_prismarine', name: 'Dark Prismarine', category: 'Ocean', hex: '#33584E' },

  // Whites & Quartz
  { id: 'white_concrete', name: 'White Concrete', category: 'Concrete', hex: '#CFD5D6' },
  { id: 'smooth_quartz', name: 'Smooth Quartz', category: 'Stone', hex: '#EBE5DE' },
  { id: 'diorite', name: 'Diorite', category: 'Stone', hex: '#BDBDBD' },
  { id: 'calcite', name: 'Calcite', category: 'Stone', hex: '#DFE0DC' },
  { id: 'snow_block', name: 'Snow Block', category: 'Ice', hex: '#F9FEFE' },
];

const PRESET_GRADIENTS = [
  { name: 'Weathered Castle Wall', start: 'stone_bricks', end: 'deepslate_tiles', length: 5 },
  { name: 'Desert Oasis Sandstone', start: 'sand', end: 'smooth_sandstone', length: 4 },
  { name: 'Oxidized Temple', start: 'cut_copper', end: 'dark_prismarine', length: 6 },
  { name: 'Volcanic Basalt', start: 'cobblestone', end: 'obsidian', length: 5 },
  { name: 'Modern Quartz', start: 'snow_block', end: 'andesite', length: 5 },
];

export default function GradientGeneratorPage() {
  const [startBlockId, setStartBlockId] = useState<string>('stone');
  const [endBlockId, setEndBlockId] = useState<string>('deepslate');
  const [length, setLength] = useState<number>(5);
  const { copy, toastMessage, showToast } = useClipboard();

  const startBlock = useMemo(
    () => MINECRAFT_BLOCKS.find((b) => b.id === startBlockId) || MINECRAFT_BLOCKS[0],
    [startBlockId]
  );
  const endBlock = useMemo(
    () => MINECRAFT_BLOCKS.find((b) => b.id === endBlockId) || MINECRAFT_BLOCKS[9],
    [endBlockId]
  );

  // Calculate optimum transition path
  const gradientChain = useMemo(() => {
    const cStart = hexToRgb(startBlock.hex);
    const cEnd = hexToRgb(endBlock.hex);

    const steps = Math.max(2, Math.min(12, length));
    const result: BlockData[] = [];
    const usedIds = new Set<string>();

    result.push(startBlock);
    usedIds.add(startBlock.id);

    for (let i = 1; i < steps - 1; i++) {
      const t = i / (steps - 1);
      const targetRgb: [number, number, number] = [
        Math.round(cStart[0] + (cEnd[0] - cStart[0]) * t),
        Math.round(cStart[1] + (cEnd[1] - cStart[1]) * t),
        Math.round(cStart[2] + (cEnd[2] - cStart[2]) * t),
      ];

      // Find closest block not already in result
      let bestBlock = MINECRAFT_BLOCKS[0];
      let bestDist = Infinity;

      for (const b of MINECRAFT_BLOCKS) {
        if (b.id === endBlock.id) continue;
        const bRgb = hexToRgb(b.hex);
        const dist = colorDistance(targetRgb, bRgb);
        const penalty = usedIds.has(b.id) ? 25 : 0;
        if (dist + penalty < bestDist) {
          bestDist = dist + penalty;
          bestBlock = b;
        }
      }

      result.push(bestBlock);
      usedIds.add(bestBlock.id);
    }

    result.push(endBlock);
    return result;
  }, [startBlock, endBlock, length]);

  const copyBlockList = () => {
    const text = gradientChain.map((b) => b.name).join(' -> ');
    copy(text, 'Copied block gradient sequence!');
  };

  const copySetblockSequence = () => {
    const cmd = gradientChain
      .map((b, idx) => `/setblock ~${idx} ~ ~ minecraft:${b.id}`)
      .join('\n');
    copy(cmd, 'Copied /setblock sequence!');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Block Gradient & Palette Matcher"
        description="Find natural, organic block transition palettes between any two building materials to elevate your Minecraft walls, terrains, and roofs."
        badge="Art & Colors"
        icon="gradient"
      />

      {/* Live Gradient Visualization Strip */}
      <div className="mb-10 bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--md-sys-color-primary)]" />
            <h2 className="font-headline font-bold text-sm sm:text-base text-[var(--md-sys-color-on-surface)]">
              Generated Gradient Sequence ({gradientChain.length} Blocks)
            </h2>
          </div>
          <button
            type="button"
            onClick={copyBlockList}
            className="text-xs font-semibold text-[var(--md-sys-color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            Copy Names
          </button>
        </div>

        {/* Blocks Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {gradientChain.map((b, idx) => (
            <div
              key={`${b.id}-${idx}`}
              className="p-3 rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container)] flex flex-col items-center text-center space-y-2 group hover:border-[var(--md-sys-color-primary)] transition-all"
            >
              <div className="text-[10px] font-mono text-[var(--md-sys-color-outline)]">Step {idx + 1}</div>
              <div
                className="w-14 h-14 rounded-lg shadow-inner border border-black/20 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: b.hex }}
              />
              <div>
                <div className="font-headline font-bold text-xs truncate max-w-[120px] text-[var(--md-sys-color-on-surface)]">{b.name}</div>
                <div className="font-mono text-[10px] text-[var(--md-sys-color-outline)]">{b.hex}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Smooth color preview bar */}
        <div className="mt-5 h-4 rounded-full overflow-hidden flex border border-[var(--md-sys-color-outline-variant)]/40">
          {gradientChain.map((b, idx) => (
            <div
              key={`bar-${idx}`}
              style={{ backgroundColor: b.hex }}
              className="flex-1 h-full"
              title={b.name}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">tune</span>
              Select Gradient Endpoints
            </h2>

            {/* Start Block Picker */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">Start Material</label>
              <select
                value={startBlockId}
                onChange={(e) => setStartBlockId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] text-xs font-semibold cursor-pointer focus:outline-none focus:border-[var(--md-sys-color-primary)]"
              >
                {MINECRAFT_BLOCKS.map((b) => (
                  <option key={`start-${b.id}`} value={b.id}>
                    {b.name} ({b.category})
                  </option>
                ))}
              </select>
            </div>

            {/* End Block Picker */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">End Material</label>
              <select
                value={endBlockId}
                onChange={(e) => setEndBlockId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] text-xs font-semibold cursor-pointer focus:outline-none focus:border-[var(--md-sys-color-primary)]"
              >
                {MINECRAFT_BLOCKS.map((b) => (
                  <option key={`end-${b.id}`} value={b.id}>
                    {b.name} ({b.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Length Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                <span>Gradient Length</span>
                <span className="font-mono text-[var(--md-sys-color-primary)] font-bold">{length} blocks</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full accent-[var(--md-sys-color-primary)]"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={copyBlockList}
                className="py-2.5 px-3 rounded-full border border-[var(--md-sys-color-outline-variant)]/60 text-xs font-bold text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy List
              </button>
              <button
                type="button"
                onClick={copySetblockSequence}
                className="py-2.5 px-3 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-bold hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                Copy /setblock
              </button>
            </div>
          </div>
        </div>

        {/* Popular Presets */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-3">
            <h3 className="font-headline font-bold text-sm text-[var(--md-sys-color-on-surface)]">Popular Building Gradients</h3>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Curated block progressions tested for high visual appeal on castles, towers, and mountainscapes:
            </p>

            <div className="space-y-2.5 pt-2">
              {PRESET_GRADIENTS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setStartBlockId(p.start);
                    setEndBlockId(p.end);
                    setLength(p.length);
                    showToast(`Applied "${p.name}" preset!`);
                  }}
                  className="w-full p-3 rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container)] hover:border-[var(--md-sys-color-primary)] transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="font-headline font-bold text-xs text-[var(--md-sys-color-on-surface)] group-hover:text-[var(--md-sys-color-primary)] transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
                      {p.length} blocks transition
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[var(--md-sys-color-outline)] group-hover:text-[var(--md-sys-color-primary)] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
