'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';
import { useTheme } from '@/app/hooks/useTheme';
import { gridToAscii } from '@/app/lib/voxel-utils';

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
  const [width, setWidth] = useState<number>(25);
  const [height, setHeight] = useState<number>(25);
  const [linked, setLinked] = useState<boolean>(true);
  const [fillMode, setFillMode] = useState<FillMode>('outline');
  const [zoom, setZoom] = useState<number>(14);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; z: number } | null>(null);
  const { copy, toastMessage, showToast } = useClipboard();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const grid = useMemo(() => {
    return generateVoxelCircle(width, height, fillMode);
  }, [width, height, fillMode]);

  const blockCount = useMemo(() => {
    return grid.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
  }, [grid]);

  const handleWidthChange = (val: number) => {
    const clamped = Math.max(1, Math.min(96, val));
    setWidth(clamped);
    if (linked) setHeight(clamped);
  };

  const handleHeightChange = (val: number) => {
    const clamped = Math.max(1, Math.min(96, val));
    setHeight(clamped);
    if (linked) setWidth(clamped);
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockSize = zoom;
    const canvasWidth = width * blockSize;
    const canvasHeight = height * blockSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Background
    ctx.fillStyle = isDark ? '#15100E' : '#FFF8F6';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid lines
    ctx.strokeStyle = isDark ? '#2E221E' : '#EBE0DC';
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
    ctx.strokeStyle = isDark ? 'rgba(255, 181, 157, 0.45)' : 'rgba(144, 75, 50, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, canvasHeight);
    ctx.moveTo(0, cz);
    ctx.lineTo(canvasWidth, cz);
    ctx.stroke();

    // Render Blocks
    const blockFill = isDark ? '#FFB59D' : '#904B32';
    const blockBorder = isDark ? '#FFDBCF' : '#72341D';

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
    const asciiContent = gridToAscii(grid);
    const text = `# Voxel Circle: ${width}x${height} (${fillMode})\n# Total Blocks: ${blockCount}\n\n${asciiContent}\n`;
    copy(text, 'Copied ASCII layout to clipboard!');
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `circle-${width}x${height}-${fillMode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Downloaded PNG template!');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Voxel Circle & Oval Generator"
        description="Design rasterized Minecraft circles, domes, and ellipses block-by-block with exact quadrant symmetry and live block calculations."
        badge="Voxel Shapes"
        icon="category"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 shadow-2xs space-y-5">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">tune</span>
              Dimensions &amp; Style
            </h2>

            {/* Diameter Controls */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                  <span>Width (X Diameter)</span>
                  <span className="font-mono text-[var(--md-sys-color-primary)] font-bold">{width} blocks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="96"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                  className="w-full accent-[var(--md-sys-color-primary)]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                  <span>Height (Z Diameter)</span>
                  <span className="font-mono text-[var(--md-sys-color-primary)] font-bold">{height} blocks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="96"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                  className="w-full accent-[var(--md-sys-color-primary)]"
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
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  linked
                    ? 'bg-[var(--md-sys-color-primary-container)] border-[var(--md-sys-color-outline-variant)]/40 text-[var(--md-sys-color-on-primary-container)]'
                    : 'border-[var(--md-sys-color-outline-variant)]/40 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{linked ? 'link' : 'link_off'}</span>
                {linked ? 'Circle (1:1 Ratio Locked)' : 'Oval / Ellipse (Free Ratio)'}
              </button>
            </div>

            {/* Fill Mode */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--md-sys-color-on-surface-variant)]">Border Style</label>
              <div className="grid grid-cols-3 gap-2">
                {(['outline', 'thin', 'filled'] as FillMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFillMode(m)}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg capitalize border transition-all cursor-pointer ${
                      fillMode === m
                        ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent shadow-xs'
                        : 'border-[var(--md-sys-color-outline-variant)]/40 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Control */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                <span>Grid Zoom</span>
                <span className="font-mono text-[var(--md-sys-color-outline)]">{zoom}px</span>
              </div>
              <input
                type="range"
                min="6"
                max="36"
                value={zoom}
                onChange={(e) => setZoom(parseInt(e.target.value))}
                className="w-full accent-[var(--md-sys-color-primary)]"
              />
            </div>

            {/* Block Statistics */}
            <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant)]/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--md-sys-color-on-surface-variant)]">Total Blocks:</span>
                <span className="font-mono font-bold text-[var(--md-sys-color-primary)] text-sm">{blockCount} blocks</span>
              </div>
              <div className="flex justify-between text-[var(--md-sys-color-on-surface-variant)]">
                <span>Full Stacks:</span>
                <span className="font-mono">{Math.floor(blockCount / 64)} stacks + {blockCount % 64}</span>
              </div>
              <div className="flex justify-between text-[var(--md-sys-color-on-surface-variant)]">
                <span>Per Quadrant (approx):</span>
                <span className="font-mono">{Math.round(blockCount / 4)} blocks</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleExportAscii}
                className="py-2 px-3 rounded-full border border-[var(--md-sys-color-outline-variant)]/60 text-xs font-semibold text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy ASCII
              </button>
              <button
                type="button"
                onClick={handleDownloadPng}
                className="py-2 px-3 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-semibold hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Save PNG
              </button>
            </div>
          </div>
        </div>

        {/* Grid Canvas Column */}
        <div className="lg:col-span-8">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-4 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--md-sys-color-primary)]" />
                <span>Blueprint Viewport ({width} × {height})</span>
              </div>
              <div className="font-mono">
                {hoverCoord ? `Offset: X=${hoverCoord.x}, Z=${hoverCoord.z}` : 'Hover over grid to inspect coordinate'}
              </div>
            </div>

            {/* Scrollable Canvas Container */}
            <div className="w-full overflow-auto rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-black/5 dark:bg-black/40 p-4 flex items-center justify-center min-h-[420px] max-h-[640px]">
              <canvas
                ref={canvasRef}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={() => setHoverCoord(null)}
                className="shadow-md rounded cursor-crosshair [image-rendering:pixelated]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--md-sys-color-outline)]">
              <span>Tip: Center crosshairs indicate coordinate origin. Adjust zoom if building large structures.</span>
              <span>Max: 96×96</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
