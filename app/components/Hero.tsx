'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <div className="relative w-full overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16 border-b border-[#E2DDD8] dark:border-[#3A2D28] transition-colors duration-200">
      {/* Background ambient radial glows */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#8A4228]/12 dark:bg-[#E07A5F]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -left-20 w-80 h-80 bg-[#4E4844]/10 dark:bg-[#A8A19B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & Fast CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Version & Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] shadow-2xs mb-6">
              <span className="w-2 h-2 rounded-full bg-[#8A4228] dark:bg-[#E07A5F] animate-pulse" />
              <span className="font-mono-meta text-[11px] font-bold text-[#68615A] dark:text-[#A8A19B] uppercase tracking-wider">
                kita tools v2.4
              </span>
              <span className="text-[#918A83]">•</span>
              <span className="text-xs font-semibold text-[#8A4228] dark:text-[#E07A5F]">
                Server MOTD Generator active
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl text-[#1A1210] dark:text-[#F8F4F0] tracking-tight leading-[1.15] mb-5">
              All Minecraft tools in{' '}
              <span className="text-[#8A4228] dark:text-[#E07A5F] underline decoration-[#8A4228]/25 dark:decoration-[#E07A5F]/35 decoration-wavy">
                one web app
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[#68615A] dark:text-[#A8A19B] mb-8 leading-relaxed max-w-xl">
              Precision generators, calculators, and server utilities crafted for Minecraft builders, admins, and technical creators.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                href="/tools/motd-editor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-sm font-semibold shadow-md shadow-[#8A4228]/20 dark:shadow-[#E07A5F]/25 hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">dns</span>
                Open MOTD Generator
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <a
                href="#explore-tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0] text-sm font-semibold shadow-2xs hover:bg-[#EFECE9] dark:hover:bg-[#261D19] hover:border-[#CBC4BD] dark:hover:border-[#54413A] transition-all"
              >
                Browse Catalog
                <span className="material-symbols-outlined text-[#68615A] dark:text-[#A8A19B] text-[16px]">
                  expand_more
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Server MOTD Generator Spotlight Card */}
          <div className="lg:col-span-6 w-full" id="featured-tool">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl shadow-xl p-5 sm:p-6 transition-all hover:border-[#CBC4BD] dark:hover:border-[#54413A]">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2DDD8] dark:border-[#3A2D28]">
                <div className="flex items-center gap-2">
                  <span className="font-mono-meta text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FBECE6] dark:bg-[#38231C] text-[#8A4228] dark:text-[#E07A5F]">
                    Featured tool
                  </span>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-[#1A1210] dark:text-[#F8F4F0]">
                    Server MOTD Generator
                  </h3>
                </div>
                <span className="text-xs text-[#918A83] dark:text-[#766F69] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                    check_circle
                  </span>
                  Active &amp; Ready
                </span>
              </div>

              {/* Spotlight Viewport Mockup (In-game Server List Simulation) */}
              <div className="bg-[#0E0E0E] border-2 border-[#222222] rounded-xl p-3.5 sm:p-4 mb-4 font-mono">
                <div className="flex items-start gap-3">
                  {/* Mini Server Icon */}
                  <div className="w-12 h-12 rounded bg-[#1F1F1F] border border-[#333333] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[26px]">
                      dns
                    </span>
                  </div>

                  {/* Server Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
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
                    <div className="bg-black/60 rounded p-2 text-xs space-y-0.5 leading-tight">
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

              {/* 4 Feature Capability Tiles */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-[#1A1210] dark:text-[#F8F4F0]">
                    <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                      palette
                    </span>
                    16 Colors &amp; Styles
                  </div>
                  <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] leading-tight">
                    Standard &amp;0-&amp;f colors, bold, italic.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-[#1A1210] dark:text-[#F8F4F0]">
                    <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                      gradient
                    </span>
                    RGB Hex Gradients
                  </div>
                  <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] leading-tight">
                    Smooth 1.16+ hex color transitions.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-[#1A1210] dark:text-[#F8F4F0]">
                    <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                      description
                    </span>
                    server.properties
                  </div>
                  <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] leading-tight">
                    Ready-to-paste escaped Unicode.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-[#1A1210] dark:text-[#F8F4F0]">
                    <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                      download
                    </span>
                    YAML (.yml) Export
                  </div>
                  <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] leading-tight">
                    Download config.yml with 1 click.
                  </p>
                </div>
              </div>

              {/* Direct Launch Link */}
              <Link
                href="/tools/motd-editor"
                className="w-full py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors"
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
