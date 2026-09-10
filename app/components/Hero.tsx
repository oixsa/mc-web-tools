'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <div className="relative w-full overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16 border-b border-[var(--md-sys-color-outline-variant)]/40 transition-colors duration-200">
      {/* Background ambient tonal glows */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[var(--md-sys-color-primary)]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -left-20 w-80 h-80 bg-[var(--md-sys-color-secondary)]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & Fast CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Version & Announcement Pill (M3 Assist Chip) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/50 shadow-2xs mb-6 select-none">
              <span className="w-2 h-2 rounded-full bg-[var(--md-sys-color-primary)] animate-pulse" />
              <span className="font-mono-meta text-[11px] font-bold text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">
                kita tools v2.5
              </span>
              <span className="text-[var(--md-sys-color-outline)]">•</span>
              <span className="text-xs font-semibold text-[var(--md-sys-color-primary)]">
                Material 3 Design System
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl text-[var(--md-sys-color-on-surface)] tracking-tight leading-[1.15] mb-4">
              All Minecraft tools in{' '}
              <span className="text-[var(--md-sys-color-primary)] underline decoration-[var(--md-sys-color-primary)]/30 decoration-wavy">
                one web app
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[var(--md-sys-color-on-surface-variant)] mb-8 leading-relaxed max-w-xl">
              Precision voxel shape generators, server MOTD designers, and gameplay calculators crafted for Minecraft builders and technical creators.
            </p>

            {/* Call to Action Buttons (M3 Filled & Outlined Buttons) */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                href="/tools/motd-editor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-sm font-semibold shadow-xs hover:brightness-105 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">dns</span>
                Open MOTD Generator
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <a
                href="#explore-tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline)]/60 text-[var(--md-sys-color-on-surface)] text-sm font-semibold hover:bg-[var(--md-sys-color-surface-container-high)] active:scale-[0.98] transition-all"
              >
                Browse All Tools
                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface-variant)] text-[16px]">
                  expand_more
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Server MOTD Generator Spotlight Card (M3 Elevated Card) */}
          <div className="lg:col-span-6 w-full" id="featured-tool">
            <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/50 rounded-[24px] shadow-sm p-5 sm:p-6 transition-all hover:bg-[var(--md-sys-color-surface-container)] hover:shadow-md">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--md-sys-color-outline-variant)]/40">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono-meta text-[10px] uppercase font-bold px-2.5 py-1 rounded-md bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]">
                    Featured tool
                  </span>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-[var(--md-sys-color-on-surface)]">
                    Server MOTD Generator
                  </h3>
                </div>
                <span className="text-xs text-[var(--md-sys-color-outline)] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[var(--md-sys-color-primary)]">
                    check_circle
                  </span>
                  Active &amp; Ready
                </span>
              </div>

              {/* Spotlight Viewport Mockup (In-game Server List Simulation) */}
              <div className="bg-[#0E0E0E] border-2 border-[#262626] rounded-2xl p-4 mb-4 font-mono shadow-inner">
                <div className="flex items-start gap-3">
                  {/* Mini Server Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#383838] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[26px]">
                      dns
                    </span>
                  </div>

                  {/* Server Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white text-xs font-bold tracking-wider">
                        KITA NETWORK
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-[#AAAAAA]">
                        <span>42/100</span>
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 h-1 bg-[#55FF55]" />
                          <span className="w-0.5 h-1.5 bg-[#55FF55]" />
                          <span className="w-0.5 h-2 bg-[#55FF55]" />
                          <span className="w-0.5 h-2.5 bg-[#55FF55]" />
                        </div>
                      </div>
                    </div>

                    {/* 2-line MOTD text */}
                    <div className="bg-black/70 rounded-lg p-2.5 text-xs space-y-1 leading-tight border border-white/5">
                      <div className="text-[#FFAA00] font-bold">
                        ★ KITA NETWORK <span className="text-[#AAAAAA]">[1.20 - 1.21]</span> <span className="text-[#55FF55]">ONLINE</span>
                      </div>
                      <div className="text-[#FFFF55]">
                        ➤ <span className="text-white">Custom Quests</span> <span className="text-[#555555]">|</span> <span className="text-[#55FFFF]">Economy</span> <span className="text-[#555555]">|</span> <span className="text-[#55FF55]">SMP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Feature Capability Tiles (M3 Surface Containers) */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/30">
                  <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[var(--md-sys-color-on-surface)]">
                    <span className="material-symbols-outlined text-[16px] text-[var(--md-sys-color-primary)]">
                      palette
                    </span>
                    16 Colors &amp; Styles
                  </div>
                  <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] leading-tight">
                    Standard &amp;0-&amp;f colors, bold, italic.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/30">
                  <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[var(--md-sys-color-on-surface)]">
                    <span className="material-symbols-outlined text-[16px] text-[var(--md-sys-color-primary)]">
                      gradient
                    </span>
                    RGB Hex Gradients
                  </div>
                  <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] leading-tight">
                    Smooth 1.16+ hex color transitions.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/30">
                  <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[var(--md-sys-color-on-surface)]">
                    <span className="material-symbols-outlined text-[16px] text-[var(--md-sys-color-primary)]">
                      description
                    </span>
                    server.properties
                  </div>
                  <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] leading-tight">
                    Ready-to-paste escaped Unicode.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/30">
                  <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[var(--md-sys-color-on-surface)]">
                    <span className="material-symbols-outlined text-[16px] text-[var(--md-sys-color-primary)]">
                      download
                    </span>
                    YAML (.yml) Export
                  </div>
                  <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] leading-tight">
                    Download config.yml with 1 click.
                  </p>
                </div>
              </div>

              {/* Direct Launch Link (M3 Filled Button) */}
              <Link
                href="/tools/motd-editor"
                className="w-full py-3 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs hover:brightness-105 active:scale-[0.98] transition-all"
              >
                <span>Launch Server MOTD Generator</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
