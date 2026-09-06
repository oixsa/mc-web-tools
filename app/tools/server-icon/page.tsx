'use client';

import { ChangeEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { QuickLauncherModal } from '@/app/components/QuickLauncherModal';
import { useTheme } from '@/app/hooks/useTheme';

export default function ServerIconPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [smoothing, setSmoothing] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = (file: File) => {
    if (!file.type.startsWith('image/')) return;

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
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F4] dark:bg-[#15100E] text-[#1A1210] dark:text-[#F8F4F0] transition-colors">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B] mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Tools</span>
          <span>/</span>
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Server Icon Resizer</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold tracking-tight mb-2">
            Minecraft Server Icon Resizer
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B]">
            Minecraft requires a 64×64 PNG named <code className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] font-mono text-xs">server-icon.png</code>. Upload any image to automatically convert and scale it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Upload & Controls */}
          <div className="md:col-span-7 flex flex-col gap-5">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#8A4228] dark:hover:border-[#E07A5F] rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#201815] transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="material-symbols-outlined text-[40px] text-[#8A4228] dark:text-[#E07A5F]">
                upload_file
              </span>
              <div className="text-sm font-semibold">
                Click to upload or drag and drop
              </div>
              <p className="text-xs text-[#68615A] dark:text-[#A8A19B]">
                PNG, JPG, WEBP, GIF, SVG
              </p>
            </div>

            {/* Scaling Options */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Image Smoothing</div>
                <div className="text-xs text-[#68615A] dark:text-[#A8A19B]">
                  Disable for sharp pixel art scaling
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmoothing(!smoothing)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  smoothing ? 'bg-[#8A4228] dark:bg-[#E07A5F]' : 'bg-[#E2DDD8] dark:bg-[#3A2D28]'
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
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5">
              <h2 className="text-xs font-mono-meta font-bold uppercase tracking-wider text-[#68615A] dark:text-[#A8A19B] mb-4">
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
                className="mt-5 w-full py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-[#15100E] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download server-icon.png (64×64)
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isSearchOpen && (
        <QuickLauncherModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectTool={(tool) => {
            window.location.href = tool.href;
          }}
        />
      )}
    </div>
  );
}