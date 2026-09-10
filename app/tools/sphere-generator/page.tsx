'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';
import { useTheme } from '@/app/hooks/useTheme';
import { gridToAscii } from '@/app/lib/voxel-utils';

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
  const { isDark } = useTheme();
  const [radius, setRadius] = useState<number>(12);
  const [mode, setMode] = useState<SphereMode>('sphere');
  const [shell, setShell] = useState<ShellMode>('hollow');
  const [currentLayer, setCurrentLayer] = useState<number>(12);
  const [zoom, setZoom] = useState<number>(14);
  const { copy, toastMessage } = useClipboard();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate complete 3D structure
  const voxels = useMemo(() => {
    return generateVoxelSphere(radius, radius, radius, mode, shell);
  }, [radius, mode, shell]);

  const totalLayers = voxels.length;

  const safeCurrentLayer = Math.min(Math.max(0, currentLayer), totalLayers - 1);

  // Block counts
  const layerBlockCount = useMemo(() => {
    const slice = voxels[safeCurrentLayer];
    if (!slice) return 0;
    return slice.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
  }, [voxels, safeCurrentLayer]);

  const totalBlockCount = useMemo(() => {
    let count = 0;
    for (const slice of voxels) {
      for (const row of slice) {
        for (const block of row) {
          if (block) count++;
        }
      }
    }
    return count;
  }, [voxels]);

  // Canvas drawing for current horizontal slice
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const slice = voxels[safeCurrentLayer];
    if (!slice) return;

    const height = slice.length;
    const width = slice[0]?.length || 0;
    const blockSize = zoom;

    canvas.width = width * blockSize;
    canvas.height = height * blockSize;

    // Background
    ctx.fillStyle = isDark ? '#15100E' : '#FFF8F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = isDark ? '#2E221E' : '#EBE0DC';
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
    ctx.strokeStyle = isDark ? 'rgba(255, 181, 157, 0.45)' : 'rgba(144, 75, 50, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, canvas.height);
    ctx.moveTo(0, cz);
    ctx.lineTo(canvas.width, cz);
    ctx.stroke();

    // Render Blocks
    const blockFill = isDark ? '#FFB59D' : '#904B32';
    const blockBorder = isDark ? '#FFDBCF' : '#72341D';

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
    const asciiContent = gridToAscii(slice);
    const text = `# Sphere Layer ${safeCurrentLayer + 1}/${totalLayers} (Radius ${radius}, ${shell})\n# Blocks this layer: ${layerBlockCount}\n\n${asciiContent}\n`;
    copy(text, `Copied Layer ${safeCurrentLayer + 1} ASCII layout!`);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Sphere & Dome 3D Generator"
        description="Build perfectly proportional 3D spheres, observatories, and domes in Minecraft with layer-by-layer slice guides and exact block counts."
        badge="Voxel Shapes"
        icon="sports_baseball"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 shadow-2xs space-y-5">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">view_in_ar</span>
              Configuration
            </h2>

            {/* Radius */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                <span>Radius</span>
                <span className="font-mono text-[var(--md-sys-color-primary)] font-bold">
                  {radius} blocks (Diameter: {radius * 2 + 1})
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="36"
                value={radius}
                onChange={(e) => setRadius(Math.max(2, Math.min(36, parseInt(e.target.value) || 2)))}
                className="w-full accent-[var(--md-sys-color-primary)]"
              />
            </div>

            {/* Mode: Sphere vs Dome */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--md-sys-color-on-surface-variant)]">Geometry</label>
              <div className="grid grid-cols-2 gap-2">
                {(['sphere', 'dome'] as SphereMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg capitalize border transition-all cursor-pointer ${
                      mode === m
                        ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent shadow-xs'
                        : 'border-[var(--md-sys-color-outline-variant)]/40 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]'
                    }`}
                  >
                    {m === 'sphere' ? 'Full Sphere' : 'Hemisphere / Dome'}
                  </button>
                ))}
              </div>
            </div>

            {/* Shell Mode */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--md-sys-color-on-surface-variant)]">Structure Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['hollow', 'filled'] as ShellMode[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShell(s)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg capitalize border transition-all cursor-pointer ${
                      shell === s
                        ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent shadow-xs'
                        : 'border-[var(--md-sys-color-outline-variant)]/40 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]'
                    }`}
                  >
                    {s === 'hollow' ? 'Hollow (Shell)' : 'Solid (Filled)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Layer Navigation Slider */}
            <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]/40">
              <div className="flex justify-between items-center text-xs font-semibold mb-2 text-[var(--md-sys-color-on-surface-variant)]">
                <span>Layer Slice</span>
                <span className="font-mono bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] px-2 py-0.5 rounded font-bold">
                  Y = {safeCurrentLayer + 1} of {totalLayers}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(0, totalLayers - 1)}
                value={safeCurrentLayer}
                onChange={(e) => setCurrentLayer(parseInt(e.target.value))}
                className="w-full accent-[var(--md-sys-color-primary)] mb-3"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={safeCurrentLayer <= 0}
                  onClick={() => setCurrentLayer((prev) => Math.max(0, Math.min(prev, totalLayers - 1) - 1))}
                  className="flex-1 py-1.5 px-2 rounded-lg border border-[var(--md-sys-color-outline-variant)]/40 text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-1 text-[var(--md-sys-color-on-surface)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  Layer Below
                </button>
                <button
                  type="button"
                  disabled={safeCurrentLayer >= totalLayers - 1}
                  onClick={() => setCurrentLayer((prev) => Math.min(totalLayers - 1, Math.min(prev, totalLayers - 1) + 1))}
                  className="flex-1 py-1.5 px-2 rounded-lg border border-[var(--md-sys-color-outline-variant)]/40 text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-1 text-[var(--md-sys-color-on-surface)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  Layer Above
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant)]/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--md-sys-color-on-surface-variant)]">Blocks on This Layer:</span>
                <span className="font-mono font-bold text-[var(--md-sys-color-primary)]">{layerBlockCount} blocks</span>
              </div>
              <div className="flex justify-between text-[var(--md-sys-color-on-surface-variant)]">
                <span>Total Structure Blocks:</span>
                <span className="font-mono font-bold text-[var(--md-sys-color-on-surface)]">{totalBlockCount} blocks</span>
              </div>
              <div className="flex justify-between text-[var(--md-sys-color-on-surface-variant)]">
                <span>Shulker Boxes:</span>
                <span className="font-mono">{(totalBlockCount / (64 * 27)).toFixed(1)} boxes</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleCopyLayer}
              className="w-full py-2 px-3 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-semibold hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              Copy Current Layer ASCII
            </button>
          </div>
        </div>

        {/* Blueprint Canvas Column */}
        <div className="lg:col-span-8">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-4 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-xs text-[var(--md-sys-color-on-surface-variant)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--md-sys-color-primary)]" />
                <span>
                  Horizontal Layer Slice: <strong>Y = {safeCurrentLayer + 1}</strong>
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
                  className="w-20 accent-[var(--md-sys-color-primary)]"
                />
              </div>
            </div>

            {/* Canvas viewport */}
            <div className="w-full overflow-auto rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-black/5 dark:bg-black/40 p-4 flex items-center justify-center min-h-[420px] max-h-[640px]">
              <canvas
                ref={canvasRef}
                className="shadow-md rounded [image-rendering:pixelated]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--md-sys-color-outline)]">
              <span>Build layer by layer from Y=1 upwards in your Minecraft world.</span>
              <span>Max Radius: 36 blocks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
