'use client';

import { useState } from 'react';

export function Hero() {
  const [currentLayer, setCurrentLayer] = useState(42);
  const totalLayers = 96;

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
                New Build Planner released
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl text-[#1A1210] dark:text-[#F8F4F0] tracking-tight leading-[1.15] mb-5">
              Minecraft tools for{' '}
              <span className="text-[#8A4228] dark:text-[#E07A5F] underline decoration-[#8A4228]/25 dark:decoration-[#E07A5F]/35 decoration-wavy">
                builders &amp; creators
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[#68615A] dark:text-[#A8A19B] mb-8 leading-relaxed max-w-xl">
              Plan builds, generate shapes, create map art, explore seeds, and export useful files
              without leaving the page.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10 w-full sm:w-auto">
              <a
                href="#build-planner"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-sm font-semibold shadow-md shadow-[#8A4228]/20 dark:shadow-[#E07A5F]/25 hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">architecture</span>
                Open Build Planner
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
              <a
                href="#explore-tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0] text-sm font-semibold shadow-2xs hover:bg-[#EFECE9] dark:hover:bg-[#261D19] hover:border-[#CBC4BD] dark:hover:border-[#54413A] transition-all"
              >
                Browse Tools
                <span className="material-symbols-outlined text-[#68615A] dark:text-[#A8A19B] text-[16px]">
                  expand_more
                </span>
              </a>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-3 gap-4 w-full p-4 bg-white/80 dark:bg-[#201815]/80 backdrop-blur-sm border border-[#E2DDD8] dark:border-[#3A2D28] rounded-xl shadow-2xs">
              <div className="flex flex-col">
                <span className="font-headline text-xl sm:text-2xl text-[#8A4228] dark:text-[#E07A5F] font-bold">
                  34+
                </span>
                <span className="text-xs text-[#68615A] dark:text-[#A8A19B]">Browser tools</span>
              </div>
              <div className="flex flex-col border-x border-[#E2DDD8] dark:border-[#3A2D28] px-3 sm:px-4">
                <span className="font-headline text-xl sm:text-2xl text-[#1A1210] dark:text-[#F8F4F0] font-bold">
                  100%
                </span>
                <span className="text-xs text-[#68615A] dark:text-[#A8A19B]">Client-side &amp; free</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-xl sm:text-2xl text-[#8A4228] dark:text-[#E07A5F] font-bold">
                  1.20+
                </span>
                <span className="text-xs text-[#68615A] dark:text-[#A8A19B]">Java &amp; Bedrock</span>
              </div>
            </div>
          </div>

          {/* Right Column: Build Planner Interactive Spotlight Card */}
          <div className="lg:col-span-6 w-full" id="build-planner">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl shadow-xl p-5 sm:p-6 transition-all hover:border-[#CBC4BD] dark:hover:border-[#54413A]">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2DDD8] dark:border-[#3A2D28]">
                <div className="flex items-center gap-2">
                  <span className="font-mono-meta text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FBECE6] dark:bg-[#38231C] text-[#8A4228] dark:text-[#E07A5F]">
                    Featured tool
                  </span>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-[#1A1210] dark:text-[#F8F4F0]">
                    Build Planner
                  </h3>
                </div>
                <span className="text-xs text-[#918A83] dark:text-[#766F69] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                    check_circle
                  </span>
                  v2.4 Active
                </span>
              </div>

              {/* Spotlight Viewport Mockup (Isometric 3D Stage + Materials List) */}
              <div className="bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-xl p-3 sm:p-4 mb-4">
                {/* Stage Header Info */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#BA1A1A]/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C27838]/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8A4228]/70" />
                    <span className="font-mono-meta text-[11px] text-[#918A83] dark:text-[#766F69] ml-1.5 truncate max-w-[140px] sm:max-w-none">
                      cathedral_spire_v3.litematic
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentLayer(Math.max(1, currentLayer - 1))}
                      className="px-1 py-0.5 rounded bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[10px] text-[#68615A] dark:text-[#A8A19B] hover:text-[#1A1210] dark:hover:text-white"
                    >
                      -
                    </button>
                    <span className="font-mono-meta px-2 py-0.5 text-[10px] font-bold rounded bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0]">
                      Layer {currentLayer}/{totalLayers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentLayer(Math.min(totalLayers, currentLayer + 1))}
                      className="px-1 py-0.5 rounded bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[10px] text-[#68615A] dark:text-[#A8A19B] hover:text-[#1A1210] dark:hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Viewport Simulation Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Isometric Stage */}
                  <div className="sm:col-span-7 bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-lg p-3 flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-center text-[10px] text-[#918A83]">
                      <span className="font-mono-meta text-[#68615A] dark:text-[#A8A19B]">
                        3D LAYER ROTATE
                      </span>
                      <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                    </div>

                    {/* Isometric SVG Tower Art */}
                    <div className="flex items-center justify-center py-2">
                      <svg className="w-24 h-24 text-[#8A4228] dark:text-[#E07A5F]" viewBox="0 0 120 120" fill="none">
                        {/* Base grid */}
                        <path
                          d="M60 20 L105 45 L60 70 L15 45 Z"
                          fill="currentColor"
                          fillOpacity="0.12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M15 45 L15 75 L60 100 L60 70 Z"
                          fill="currentColor"
                          fillOpacity="0.85"
                        />
                        <path
                          d="M105 45 L105 75 L60 100 L60 70 Z"
                          fill="currentColor"
                          fillOpacity="0.6"
                        />
                        {/* Internal layered spire */}
                        <path
                          d="M60 5 L85 20 L60 35 L35 20 Z"
                          fill="#C27838"
                          stroke="#72341D"
                          strokeWidth="1.2"
                        />
                        <path d="M35 20 L35 45 L60 60 L60 35 Z" fill="#D98A4E" />
                        <path d="M85 20 L85 45 L60 60 L60 35 Z" fill="#8A4228" />
                        {/* Highlights */}
                        <circle cx="60" cy="50" fill="#FFFFFF" r="3" />
                        <circle cx="48" cy="42" fill="#FFFFFF" r="2.5" />
                        <circle cx="72" cy="42" fill="#FFFFFF" r="2.5" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#68615A] dark:text-[#A8A19B]">
                      <span>Dims: 32×48×32</span>
                      <span className="font-bold text-[#8A4228] dark:text-[#E07A5F]">
                        1,842 Blocks
                      </span>
                    </div>
                  </div>

                  {/* Materials Need Mini Breakdown */}
                  <div className="sm:col-span-5 flex flex-col justify-between bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-lg p-2.5">
                    <div className="font-mono-meta text-[10px] uppercase font-bold text-[#918A83] pb-1 border-b border-[#E2DDD8] dark:border-[#3A2D28]">
                      Materials Need
                    </div>
                    <div className="space-y-1.5 py-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#1A1210] dark:text-[#F8F4F0] truncate">
                          <span className="w-2 h-2 rounded-2xs bg-stone-700 inline-block" />
                          Deepslate
                        </span>
                        <span className="font-mono-meta text-[10px] font-bold">840</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#1A1210] dark:text-[#F8F4F0] truncate">
                          <span className="w-2 h-2 rounded-2xs bg-amber-800 inline-block" />
                          Dark Oak
                        </span>
                        <span className="font-mono-meta text-[10px] font-bold">462</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#1A1210] dark:text-[#F8F4F0] truncate">
                          <span className="w-2 h-2 rounded-2xs bg-amber-600 inline-block" />
                          Copper Bulbs
                        </span>
                        <span className="font-mono-meta text-[10px] font-bold">184</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#1A1210] dark:text-[#F8F4F0] truncate">
                          <span className="w-2 h-2 rounded-2xs bg-stone-400 inline-block" />
                          Cut Copper
                        </span>
                        <span className="font-mono-meta text-[10px] font-bold">96</span>
                      </div>
                    </div>
                    <div className="pt-1 border-t border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-between text-[10px] text-[#918A83]">
                      <span>
                        Shulkers: <strong className="text-[#1A1210] dark:text-[#F8F4F0]">2.8</strong>
                      </span>
                      <span className="text-[#8A4228] dark:text-[#E07A5F] font-bold">Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Feature Capability Tiles */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#CBC4BD] dark:hover:border-[#54413A] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-[#1A1210] dark:text-[#F8F4F0]">
                    <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                      visibility
                    </span>
                    Inspect in 3D
                  </div>
                  <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] leading-tight">
                    Open .litematic, .schem, and NBT builds.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#CBC4BD] dark:hover:border-[#54413A] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-[#1A1210] dark:text-[#F8F4F0]">
                    <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                      inventory_2
                    </span>
                    Material breakdown
                  </div>
                  <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] leading-tight">
                    Break builds into craftable materials.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#CBC4BD] dark:hover:border-[#54413A] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-[#1A1210] dark:text-[#F8F4F0]">
                    <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                      grid_view
                    </span>
                    Shulker planning
                  </div>
                  <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] leading-tight">
                    Plan pack orders slot by slot.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#CBC4BD] dark:hover:border-[#54413A] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-[#1A1210] dark:text-[#F8F4F0]">
                    <span className="material-symbols-outlined text-[16px] text-[#8A4228] dark:text-[#E07A5F]">
                      checklist
                    </span>
                    Shopping list
                  </div>
                  <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] leading-tight">
                    Track gathering with running totals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
