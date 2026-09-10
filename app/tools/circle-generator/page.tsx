'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/hooks/useTheme';

type FillMode = 'outline' | 'thin' | 'filled';

/**
 * Midpoint / Ellipse rasterization algorithm for Minecraft blocks.
 * Generates a boolean 2D matrix representing blocks.
 */
function generateVoxelCircle(width: number, height: number, mode: FillMode): boolean[][] {
  const w = Math.max(1, Math.min(128, Math.floor(width)));
  const h = Math.max(1, Math.min(128, Math.floor(height)));

  const grid: boolean[][] = Array.from({ length: h }, () => Array(w).fill(false));

  const rx = w / 2;
  const rz = h / 2;
  const rxSq = rx * rx;
  const rzSq = rz * rz;

  for (let z = 0; z < h; z++) {
    for (let x = 0; x < w; x++) {
      const dx = x + 0.5 - rx;
      const dz = z + 0.5 - rz;
      const distSq = (dx * dx) / rxSq + (dz * dz) / rzSq;

      if (mode === 'filled') {
        if (distSq <= 1.0) {
          grid[z][x] = true;
        }
      } else {
        // Outline test: inside outer boundary, but not too deep inside
        if (distSq <= 1.0) {
          // Check if any of 4 orthogonal neighbors are outside
          let isBorder = false;
          const neighbors = [
            [x + 1, z],
            [x - 1, z],
            [x, z + 1],
            [x, z - 1],
          ];

          for (const [nx, nz] of neighbors) {
            if (nx < 0 || nx >= w || nz < 0 || nz >= h) {
              isBorder = true;
              break;
            }
            const ndx = nx + 0.5 - rx;
            const ndz = nz + 0.5 - rz;
            if ((ndx * ndx) / rxSq + (ndz * ndz) / rzSq > 1.0) {
              isBorder = true;
              break;
            }
          }

          if (isBorder) {
            grid[z][x] = true;
          } else if (mode === 'outline') {
            // For standard outline, include diagonal neighbor checks to avoid gaps
            const diagNeighbors = [
              [x + 1, z + 1],
              [x - 1, z + 1],
              [x + 1, z - 1],
              [x - 1, z - 1],
            ];
            for (const [nx, nz] of diagNeighbors) {
              if (nx < 0 || nx >= w || nz < 0 || nz >= h) {
                grid[z][x] = true;
                break;
              }
              const ndx = nx + 0.5 - rx;
              const ndz = nz + 0.5 - rz;
              if ((ndx * ndx) / rxSq + (ndz * ndz) / rzSq > 1.0) {
                grid[z][x] = true;
                break;
              }
            }
          }
        }
      }
    }
  }

  return grid;
}

export default function CircleGeneratorPage() {
  const { isDark } = useTheme();

  // Settings
  const [width, setWidth] = useState<number>(17);
  const [height, setHeight] = useState<number>(17);
  const [linked, setLinked] = useState<boolean>(true);
  const [fillMode, setFillMode] = useState<FillMode>('outline');
  const [zoom, setZoom] = useState<number>(16); // px per block
  const [hoverCoord, setHoverCoord] = useState<{ x: number; z: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleWidthChange = (val: number) => {
    const clamped = Math.max(1, Math.min(128, val || 1));
    setWidth(clamped);
    if (linked) setHeight(clamped);
  };

  const handleHeightChange = (val: number) => {
    const clamped = Math.max(1, Math.min(128, val || 1));
    setHeight(clamped);
    if (linked) setWidth(clamped);
  };

  const grid = useMemo(() => generateVoxelCircle(width, height, fillMode), [width, height, fillMode]);

  const blockCount = useMemo(() => {
    let count = 0;
    for (const row of grid) {
      for (const cell of row) {
        if (cell) count++;
      }
    }
    return count;
  }, [grid]);

  // Draw on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockSize = Math.max(4, Math.min(48, zoom));
    const canvasWidth = width * blockSize;
    const canvasHeight = height * blockSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Background
    ctx.fillStyle = isDark ? '#15100E' : '#F7F6F4';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid lines
    ctx.strokeStyle = isDark ? '#2E221E' : '#E2DDD8';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * blockSize, 0);
      ctx.lineTo(x * blockSize, canvasHeight);
      ctx.stroke();
    }
    for (let z = 0; z <= height; z++) {
      ctx.beginPath();
      ctx.moveTo(0, z * blockSize);
      ctx.lineTo(canvasWidth, z * blockSize);
      ctx.stroke();
    }

    // Center crosshair lines
    const cx = (width / 2) * blockSize;
    const cz = (height / 2) * blockSize;
    ctx.strokeStyle = isDark ? 'rgba(224, 122, 95, 0.35)' : 'rgba(138, 66, 40, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, canvasHeight);
    ctx.moveTo(0, cz);
    ctx.lineTo(canvasWidth, cz);
    ctx.stroke();

    // Render Blocks
    const blockFill = isDark ? '#E07A5F' : '#8A4228';
    const blockBorder = isDark ? '#F19178' : '#72341D';

    for (let z = 0; z < height; z++) {
      for (let x = 0; x < width; x++) {
        if (grid[z][x]) {
          ctx.fillStyle = blockFill;
          ctx.fillRect(x * blockSize + 1, z * blockSize + 1, blockSize - 2, blockSize - 2);
          ctx.strokeStyle = blockBorder;
          ctx.lineWidth = 1;
          ctx.strokeRect(x * blockSize + 0.5, z * blockSize + 0.5, blockSize - 1, blockSize - 1);
        }
      }
    }
  }, [grid, width, height, zoom, isDark]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleZ = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseZ = (e.clientY - rect.top) * scaleZ;
    const blockX = Math.floor(mouseX / zoom);
    const blockZ = Math.floor(mouseZ / zoom);
    if (blockX >= 0 && blockX < width && blockZ >= 0 && blockZ < height) {
      setHoverCoord({ x: blockX - Math.floor(width / 2), z: blockZ - Math.floor(height / 2) });
    } else {
      setHoverCoord(null);
    }
  };

  const handleExportAscii = () => {
    let ascii = `# Voxel Circle: ${width}x${height} (${fillMode})\n# Total Blocks: ${blockCount}\n\n`;
    for (const row of grid) {
      ascii += row.map((c) => (c ? '██' : '  ')).join('') + '\n';
    }
    navigator.clipboard.writeText(ascii);
    triggerToast('Copied ASCII layout to clipboard!');
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `circle-${width}x${height}-${fillMode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    triggerToast('Downloaded PNG template!');
  };

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
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Voxel Circle &amp; Oval Generator</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">category</span>
            Voxel Shapes
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Voxel Circle &amp; Oval Generator
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Design rasterized Minecraft circles, domes, and ellipses block-by-block with exact quadrant symmetry and live block calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-5">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">tune</span>
                Dimensions &amp; Style
              </h2>

              {/* Diameter Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span>Width (X Diameter)</span>
                    <span className="font-mono text-[#8A4228] dark:text-[#E07A5F]">{width} blocks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="96"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                    className="w-full accent-[#8A4228] dark:accent-[#E07A5F]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span>Height (Z Diameter)</span>
                    <span className="font-mono text-[#8A4228] dark:text-[#E07A5F]">{height} blocks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="96"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                    className="w-full accent-[#8A4228] dark:accent-[#E07A5F]"
                  />
                </div>

                {/* Aspect Lock */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !linked;
                    setLinked(next);
                    if (next) setHeight(width);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-colors ${
                    linked
                      ? 'bg-[#FBECE6] dark:bg-[#38231C] border-[#8A4228] dark:border-[#E07A5F] text-[#8A4228] dark:text-[#E07A5F]'
                      : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{linked ? 'link' : 'link_off'}</span>
                  {linked ? 'Circle (1:1 Ratio Locked)' : 'Oval / Ellipse (Free Ratio)'}
                </button>
              </div>

              {/* Fill Mode */}
              <div>
                <label className="block text-xs font-semibold mb-2">Border Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['outline', 'thin', 'filled'] as FillMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFillMode(m)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg capitalize border transition-all ${
                        fillMode === m
                          ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] border-transparent shadow-xs'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Control */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Grid Zoom</span>
                  <span className="font-mono text-[#918A83]">{zoom}px</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="36"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value))}
                  className="w-full accent-[#8A4228] dark:accent-[#E07A5F]"
                />
              </div>

              {/* Block Statistics */}
              <div className="pt-4 border-t border-[#E2DDD8] dark:border-[#3A2D28] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#68615A] dark:text-[#A8A19B]">Total Blocks:</span>
                  <span className="font-mono font-bold text-[#8A4228] dark:text-[#E07A5F] text-sm">{blockCount} blocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68615A] dark:text-[#A8A19B]">Full Stacks:</span>
                  <span className="font-mono">{Math.floor(blockCount / 64)} stacks + {blockCount % 64}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68615A] dark:text-[#A8A19B]">Per Quadrant (approx):</span>
                  <span className="font-mono">{Math.round(blockCount / 4)} blocks</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleExportAscii}
                  className="py-2 px-3 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] text-xs font-semibold hover:border-[#8A4228] dark:hover:border-[#E07A5F] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Copy ASCII
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="py-2 px-3 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-semibold hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Save PNG
                </button>
              </div>
            </div>
          </div>

          {/* Grid Canvas Column */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-4 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-3 text-xs text-[#68615A] dark:text-[#A8A19B]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
                  <span>Blueprint Viewport ({width} × {height})</span>
                </div>
                <div className="font-mono">
                  {hoverCoord ? `Offset: X=${hoverCoord.x}, Z=${hoverCoord.z}` : 'Hover over grid to inspect coordinate'}
                </div>
              </div>

              {/* Scrollable Canvas Container */}
              <div className="w-full overflow-auto rounded-xl border border-[#E2DDD8] dark:border-[#3A2D28] bg-black/5 dark:bg-black/40 p-4 flex items-center justify-center min-h-[420px] max-h-[640px]">
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseLeave={() => setHoverCoord(null)}
                  className="shadow-md rounded cursor-crosshair [image-rendering:pixelated]"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[#918A83]">
                <span>Tip: Orange lines indicate center axes. Adjust zoom if building large structures.</span>
                <span>Max: 96×96</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
