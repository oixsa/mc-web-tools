'use client';

import Image from 'next/image';
import Link from 'next/link';

export function AboutSection() {
  const categories = [
    {
      icon: 'dns',
      title: 'Server & Content Creators',
      description:
        'Live MOTD generator with RGB hex gradients, 64×64 server icon resizer, tellraw chat JSON builders, and server.properties exports.',
      count: 'Active & Growing',
    },
    {
      icon: 'architecture',
      title: 'Architects & Technical Builders',
      description:
        'Rasterized voxel circle and oval generators, 3D sphere/dome slice planners, and block palette gradient matchers.',
      count: 'Active & Roadmapped',
    },
    {
      icon: 'calculate',
      title: 'Survival & Game Mechanics',
      description:
        'Nether portal coordinate link calculators, anvil enchantment cost optimizers, and coordinate conversion utilities.',
      count: 'Active & Roadmapped',
    },
    {
      icon: 'palette',
      title: 'Art, Palettes & Aesthetics',
      description:
        'Block material transition finders, map art color converters, and banner design visualizers.',
      count: 'In Development',
    },
  ];

  const pillars = [
    {
      badge: '01',
      title: 'One Unified Hub, Zero Clutter',
      description:
        'Stop bookmarking 20 different outdated websites with popups, fake download buttons, and ads. Everything lives right here in one clean interface.',
    },
    {
      badge: '02',
      title: '100% In-Browser & Private',
      description:
        'All calculations, image resizing, and file generations execute locally on your device. Zero telemetry, no login walls, and no server uploads.',
    },
    {
      badge: '03',
      title: 'Java & Bedrock Compatible',
      description:
        'Engineered to support modern 1.16+ RGB hex formats alongside legacy section codes (§ & &) and cross-edition specifications.',
    },
    {
      badge: '04',
      title: 'Modular & Community-Driven',
      description:
        'Built with a modern Next.js + TypeScript architecture, allowing new Minecraft tools and calculators to be continuously added.',
    },
  ];

  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full border-t border-[#E2DDD8] dark:border-[#3A2D28] transition-colors"
    >
      {/* Top Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] shadow-2xs mb-4">
          <span className="w-2 h-2 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
          <span className="font-mono-meta text-[11px] font-bold uppercase tracking-wider text-[#68615A] dark:text-[#A8A19B]">
            About The Project
          </span>
        </div>

        <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1A1210] dark:text-[#F8F4F0] tracking-tight mb-4">
          All Minecraft tools in one web app
        </h2>

        <p className="text-base sm:text-lg text-[#68615A] dark:text-[#A8A19B] leading-relaxed">
          <strong className="text-[#1A1210] dark:text-[#F8F4F0] font-semibold">Kita Tools</strong> was
          built on a simple premise: Minecraft creators, builders, and server administrators shouldn&apos;t have to
          hunt down twenty different single-purpose websites from 2012 just to get their work done. We unite all
          essential Minecraft generators, calculators, and visualizers in one fast, ad-free platform.
        </p>
      </div>

      {/* 4 Tool Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-16">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="p-6 rounded-2xl bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] shadow-2xs hover:border-[#CBC4BD] dark:hover:border-[#54413A] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-center text-[#8A4228] dark:text-[#E07A5F] group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                </div>
                <span className="font-mono-meta text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FBECE6] dark:bg-[#38231C] text-[#8A4228] dark:text-[#E07A5F] border border-[#E2DDD8] dark:border-[#3A2D28]">
                  {cat.count}
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg text-[#1A1210] dark:text-[#F8F4F0] mb-2">
                {cat.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#68615A] dark:text-[#A8A19B] leading-relaxed">
                {cat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 4 Guiding Pillars */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#F7F6F4] dark:bg-[#1B1412] border border-[#E2DDD8] dark:border-[#3A2D28] mb-12">
        <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#1A1210] dark:text-[#F8F4F0] mb-8">
          Why Kita Tools is built differently
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col">
              <span className="font-mono-meta text-xs font-bold text-[#8A4228] dark:text-[#E07A5F] mb-2">
                {pillar.badge}
              </span>
              <h4 className="font-headline font-semibold text-sm sm:text-base text-[#1A1210] dark:text-[#F8F4F0] mb-1.5">
                {pillar.title}
              </h4>
              <p className="text-xs text-[#68615A] dark:text-[#A8A19B] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legal & Community Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28]">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="kita tools logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="text-xs text-[#68615A] dark:text-[#A8A19B]">
            <span className="font-semibold text-[#1A1210] dark:text-[#F8F4F0]">Kita Tools</span> is an open fan project. Not an official Minecraft product, and not approved by or associated with Mojang or Microsoft.
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/#explore-tools"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-bold shadow-xs hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors"
          >
            <span>Browse All Tools</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
