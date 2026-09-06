'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { QuickLauncherModal } from '@/app/components/QuickLauncherModal';
import { useTheme } from '@/app/hooks/useTheme';

type SphereMode = 'sphere' | 'dome';
type ShellMode = 'hollow' | 'filled';

/**
 * Generates 3D voxel ellipsoid data layer by layer.
 * Returns boolean[y][z][x]
 */
function generateVoxelSphere(
  rx: number,
  ry: number,
  rz: number,
  mode: SphereMode,
  shell: ShellMode
): boolean[][][] {
  const clampRx = Math.max(1, Math.min(48, Math.floor(rx)));
  const clampRy = Math.max(1, Math.min(48, Math.floor(ry)));
  const clampRz = Math.max(1, Math.min(48, Math.floor(rz)));

  const totalY = mode === 'dome' ? clampRy + 1 : clampRy * 2 + 1;
  const sizeZ = clampRz * 2 + 1;
  const sizeX = clampRx * 2 + 1;

  const voxels: boolean[][][] = Array.from({ length: totalY }, () =>
    Array.from({ length: sizeZ }, () => Array(sizeX).fill(false))
  );

  const rxSq = (clampRx + 0.5) * (clampRx + 0.5);
  const rySq = (clampRy + 0.5) * (clampRy + 0.5);
  const rzSq = (clampRz + 0.5) * (clampRz + 0.5);

  const yOffset = mode === 'dome' ? 0 : clampRy;

  for (let y = 0; y < totalY; y++) {
    const dy = y - yOffset;
    for (let z = 0; z < sizeZ; z++) {
      const dz = z - clampRz;
      for (let x = 0; x < sizeX; x++) {
        const dx = x - clampRx;

        const dist = (dx * dx) / rxSq + (dy * dy) / rySq + (dz * dz) / rzSq;

        if (shell === 'filled') {
          if (dist <= 1.0) {
            voxels[y][z][x] = true;
          }
        } else {
          // Hollow: only blocks that have an adjacent air block or are on the boundary
          if (dist <= 1.0) {
            // Test 6 orthogonal neighbors in 3D
            let isSurface = false;
            const neighbors = [
              [dx + 1, dy, dz],
              [dx - 1, dy, dz],
              [dx, dy + 1, dz],
              [dx, dy - 1, dz],
              [dx, dy, dz + 1],
              [dx, dy, dz - 1],
            ];

            for (const [nx, ny, nz] of neighbors) {
              const nDist = (nx * nx) / rxSq + (ny * ny) / rySq + (nz * nz) / rzSq;
              if (nDist > 1.0) {
                isSurface = true;
                break;
              }
            }

            if (isSurface) {
              voxels[y][z][x] = true;
            }
          }
        }
      }
    }
  }

  return voxels;
}

export default function SphereGeneratorPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Settings
  const [radius, setRadius] = useState<number>(10);
  const [mode, setMode] = useState<SphereMode>('sphere');
  const [shell, setShell] = useState<ShellMode>('hollow');
  const [currentLayer, setCurrentLayer] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(18);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const voxels = useMemo(
    () => generateVoxelSphere(radius, radius, radius, mode, shell),
    [radius, mode, shell]
  );

  const totalLayers = voxels.length;
  const safeCurrentLayer = Math.min(currentLayer, Math.max(0, totalLayers - 1));

  // Block counts calculation
  const { layerBlockCount, totalBlockCount } = useMemo(() => {
    let layerTotal = 0;
    let grandTotal = 0;

    const slice = voxels[safeCurrentLayer] || [];
    for (const row of slice) {
      for (const cell of row) {
        if (cell) layerTotal++;
      }
    }

    for (const lvl of voxels) {
      for (const row of lvl) {
        for (const cell of row) {
          if (cell) grandTotal++;
        }
      }
    }

    return { layerBlockCount: layerTotal, totalBlockCount: grandTotal };
  }, [voxels, safeCurrentLayer]);

  // Render 2D Layer Slice on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const slice = voxels[safeCurrentLayer];
    if (!slice) return;

    const height = slice.length;
    const width = slice[0]?.length || 0;
    const blockSize = Math.max(6, Math.min(36, zoom));

    canvas.width = width * blockSize;
    canvas.height = height * blockSize;

    // Background
    ctx.fillStyle = isDark ? '#15100E' : '#F7F6F4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = isDark ? '#2A1F1B' : '#E2DDD8';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * blockSize, 0);
      ctx.lineTo(x * blockSize, canvas.height);
      ctx.stroke();
    }
    for (let z = 0; z <= height; z++) {
      ctx.beginPath();
      ctx.moveTo(0, z * blockSize);
      ctx.lineTo(canvas.width, z * blockSize);
      ctx.stroke();
    }

    // Axes
    const cx = Math.floor(width / 2) * blockSize + blockSize / 2;
    const cz = Math.floor(height / 2) * blockSize + blockSize / 2;
    ctx.strokeStyle = isDark ? 'rgba(224, 122, 95, 0.4)' : 'rgba(138, 66, 40, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, canvas.height);
    ctx.moveTo(0, cz);
    ctx.lineTo(canvas.width, cz);
    ctx.stroke();

    // Render Blocks
    const blockFill = isDark ? '#E07A5F' : '#8A4228';
    const blockBorder = isDark ? '#F19178' : '#72341D';

    for (let z = 0; z < height; z++) {
      for (let x = 0; x < width; x++) {
        if (slice[z][x]) {
          ctx.fillStyle = blockFill;
          ctx.fillRect(x * blockSize + 1, z * blockSize + 1, blockSize - 2, blockSize - 2);
          ctx.strokeStyle = blockBorder;
          ctx.lineWidth = 1;
          ctx.strokeRect(x * blockSize + 0.5, z * blockSize + 0.5, blockSize - 1, blockSize - 1);
        }
      }
    }
  }, [voxels, safeCurrentLayer, zoom, isDark]);

  const handleCopyLayer = () => {
    const slice = voxels[safeCurrentLayer];
    if (!slice) return;
    let text = `# Sphere Layer ${safeCurrentLayer + 1}/${totalLayers} (Radius ${radius}, ${shell})\n# Blocks this layer: ${layerBlockCount}\n\n`;
    for (const row of slice) {
      text += row.map((c) => (c ? '██' : '  ')).join('') + '\n';
    }
    navigator.clipboard.writeText(text);
    triggerToast(`Copied Layer ${safeCurrentLayer + 1} ASCII layout!`);
  };

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
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Sphere &amp; Dome 3D Generator</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">sports_baseball</span>
            3D Voxel Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Sphere &amp; Dome 3D Generator
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Build perfectly proportional 3D spheres, observatories, and domes in Minecraft with layer-by-layer slice guides and exact block counts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-5">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">view_in_ar</span>
                Configuration
              </h2>

              {/* Radius */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Radius</span>
                  <span className="font-mono text-[#8A4228] dark:text-[#E07A5F]">
                    {radius} blocks (Diameter: {radius * 2 + 1})
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="36"
                  value={radius}
                  onChange={(e) => setRadius(Math.max(2, Math.min(36, parseInt(e.target.value) || 2)))}
                  className="w-full accent-[#8A4228] dark:accent-[#E07A5F]"
                />
              </div>

              {/* Mode: Sphere vs Dome */}
              <div>
                <label className="block text-xs font-semibold mb-2">Geometry</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['sphere', 'dome'] as SphereMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                        mode === m
                          ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] border-transparent shadow-xs'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {m === 'sphere' ? 'Full Sphere' : 'Hemisphere / Dome'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shell Mode */}
              <div>
                <label className="block text-xs font-semibold mb-2">Structure Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['hollow', 'filled'] as ShellMode[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShell(s)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                        shell === s
                          ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] border-transparent shadow-xs'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {s === 'hollow' ? 'Hollow (Shell)' : 'Solid (Filled)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layer Navigation Slider */}
              <div className="pt-2 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span>Layer Slice</span>
                  <span className="font-mono bg-[#FBECE6] dark:bg-[#38231C] text-[#8A4228] dark:text-[#E07A5F] px-2 py-0.5 rounded font-bold">
                    Y = {safeCurrentLayer + 1} of {totalLayers}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, totalLayers - 1)}
                  value={safeCurrentLayer}
                  onChange={(e) => setCurrentLayer(parseInt(e.target.value))}
                  className="w-full accent-[#8A4228] dark:accent-[#E07A5F] mb-3"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={safeCurrentLayer <= 0}
                    onClick={() => setCurrentLayer((prev) => Math.max(0, Math.min(prev, totalLayers - 1) - 1))}
                    className="flex-1 py-1.5 px-2 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    Layer Below
                  </button>
                  <button
                    type="button"
                    disabled={safeCurrentLayer >= totalLayers - 1}
                    onClick={() => setCurrentLayer((prev) => Math.min(totalLayers - 1, Math.min(prev, totalLayers - 1) + 1))}
                    className="flex-1 py-1.5 px-2 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    Layer Above
                  </button>
                </div>
              </div>

              {/* Statistics */}
              <div className="pt-4 border-t border-[#E2DDD8] dark:border-[#3A2D28] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#68615A] dark:text-[#A8A19B]">Blocks on This Layer:</span>
                  <span className="font-mono font-bold text-[#8A4228] dark:text-[#E07A5F]">{layerBlockCount} blocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68615A] dark:text-[#A8A19B]">Total Structure Blocks:</span>
                  <span className="font-mono font-bold">{totalBlockCount} blocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68615A] dark:text-[#A8A19B]">Shulker Boxes:</span>
                  <span className="font-mono">{(totalBlockCount / (64 * 27)).toFixed(1)} boxes</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleCopyLayer}
                className="w-full py-2 px-3 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-semibold hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy Current Layer ASCII
              </button>
            </div>
          </div>

          {/* Blueprint Canvas Column */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-4 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-3 text-xs text-[#68615A] dark:text-[#A8A19B]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
                  <span>
                    Horizontal Layer Slice: <strong>Y = {currentLayer + 1}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Zoom:</span>
                  <input
                    type="range"
                    min="10"
                    max="28"
                    value={zoom}
                    onChange={(e) => setZoom(parseInt(e.target.value))}
                    className="w-20 accent-[#8A4228] dark:accent-[#E07A5F]"
                  />
                </div>
              </div>

              {/* Canvas viewport */}
              <div className="w-full overflow-auto rounded-xl border border-[#E2DDD8] dark:border-[#3A2D28] bg-black/5 dark:bg-black/40 p-4 flex items-center justify-center min-h-[420px] max-h-[640px]">
                <canvas
                  ref={canvasRef}
                  className="shadow-md rounded [image-rendering:pixelated]"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[#918A83]">
                <span>Build layer by layer from Y=1 upwards in your Minecraft world.</span>
                <span>Max Radius: 36 blocks</span>
              </div>
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
