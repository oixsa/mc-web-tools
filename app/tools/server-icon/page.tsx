'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';

export default function ServerIconPage() {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [smoothing, setSmoothing] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toastMessage, showToast } = useToast();

  const processImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const img = document.createElement('img');
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = smoothing;
        ctx.clearRect(0, 0, 64, 64);
        ctx.drawImage(img, 0, 0, 64, 64);
        setIconUrl(canvas.toDataURL('image/png'));
        showToast('Image converted to 64×64 PNG!');
      }
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  };

  const handleDownload = () => {
    if (!iconUrl) return;
    const a = document.createElement('a');
    a.href = iconUrl;
    a.download = 'server-icon.png';
    a.click();
    showToast('Downloaded server-icon.png!');
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Minecraft Server Icon Resizer"
        description="Minecraft requires a 64×64 PNG named server-icon.png. Upload any image to automatically convert and scale it."
        badge="Server & Creator"
        icon="image"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Upload & Controls */}
        <div className="md:col-span-7 flex flex-col gap-5">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-[var(--md-sys-color-outline-variant)]/60 hover:border-[var(--md-sys-color-primary)] rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 bg-[var(--md-sys-color-surface-container-low)] transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="material-symbols-outlined text-[40px] text-[var(--md-sys-color-primary)]">
              upload_file
            </span>
            <div className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
              Click to upload or drag and drop
            </div>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              PNG, JPG, WEBP, GIF, SVG
            </p>
          </div>

          {/* Scaling Options */}
          <div className="p-4 rounded-xl bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--md-sys-color-on-surface)]">
                Image Smoothing
              </div>
              <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
                Disable for sharp pixel art scaling
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSmoothing(!smoothing)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                smoothing ? 'bg-[var(--md-sys-color-primary)]' : 'bg-[var(--md-sys-color-surface-container-high)]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  smoothing ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Preview & Download */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 shadow-2xs">
            <h2 className="text-xs font-mono-meta font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)] mb-4">
              In-Game Server List Preview
            </h2>

            {/* Server List Mockup */}
            <div className="bg-[#0E0E0E] border-2 border-[#222222] rounded-xl p-3 font-mono">
              <div className="flex items-center gap-3">
                {/* 64x64 Icon Container */}
                <div className="w-16 h-16 rounded bg-[#1F1F1F] border border-[#333333] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={iconUrl}
                      alt="Server Icon 64x64 preview"
                      className={`w-16 h-16 ${smoothing ? '' : 'pixelated'}`}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[#666666] text-[28px]">
                      dns
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs text-white font-bold mb-1">
                    <span>KITA SERVER</span>
                    <span className="text-[#AAAAAA] text-[10px]">64/100</span>
                  </div>
                  <div className="text-[11px] text-[#AAAAAA] leading-tight truncate">
                    A Minecraft Server
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden Working Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Download Action */}
            <button
              type="button"
              disabled={!iconUrl}
              onClick={handleDownload}
              className="mt-5 w-full py-2.5 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center justify-center gap-2 shadow-2xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download server-icon.png (64×64)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}