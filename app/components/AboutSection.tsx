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
      count: 'Active & Ready',
    },
    {
      icon: 'calculate',
      title: 'Survival & Game Mechanics',
      description:
        'Nether portal coordinate link calculators, anvil enchantment cost optimizers, and coordinate conversion utilities.',
      count: 'Active & Ready',
    },
    {
      icon: 'palette',
      title: 'Art, Palettes & Aesthetics',
      description:
        'Block material transition finders, firework rocket particle simulations, and leather armor dye mixing calculators.',
      count: 'Active & Ready',
    },
  ];

  const pillars = [
    {
      badge: '01',
      title: 'One Unified Hub, Zero Clutter',
      description:
        'Stop bookmarking twenty different outdated websites with popups and intrusive ads. Everything lives in one clean Material 3 interface.',
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
        'Engineered to support modern 1.16+ RGB hex formats alongside legacy section codes (§ and &) and cross-edition specifications.',
    },
    {
      badge: '04',
      title: 'Modular & Type-Safe Architecture',
      description:
        'Built with Next.js App Router, TypeScript, and Material 3 design tokens, allowing new Minecraft tools to be added with ease.',
    },
  ];

  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full border-t border-[var(--md-sys-color-outline-variant)]/40 transition-colors"
    >
      {/* Top Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/50 shadow-2xs mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--md-sys-color-primary)]" />
          <span className="font-mono-meta text-[11px] font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
            About The Project
          </span>
        </div>

        <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-[var(--md-sys-color-on-surface)] tracking-tight mb-4">
          All Minecraft tools in one web app
        </h2>

        <p className="text-base sm:text-lg text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
          <strong className="text-[var(--md-sys-color-on-surface)] font-semibold">Kita Tools</strong> was
          built on a simple premise: Minecraft creators, builders, and server administrators should not have to
          hunt down twenty different single-purpose websites from 2012 just to get their work done. We unite all
          essential Minecraft generators, calculators, and visualizers in one fast, ad-free platform.
        </p>
      </div>

      {/* 4 Tool Domain Cards (M3 Elevated Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-16">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="p-6 rounded-[24px] bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 shadow-2xs hover:bg-[var(--md-sys-color-surface-container)] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/30 flex items-center justify-center text-[var(--md-sys-color-primary)] group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                </div>
                <span className="font-mono-meta text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] border border-[var(--md-sys-color-outline-variant)]/40">
                  {cat.count}
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg text-[var(--md-sys-color-on-surface)] mb-2">
                {cat.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
                {cat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 4 Guiding Pillars (M3 Surface Container Block) */}
      <div className="p-6 sm:p-10 rounded-[28px] bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 mb-12">
        <h3 className="font-headline font-bold text-xl sm:text-2xl text-[var(--md-sys-color-on-surface)] mb-8">
          Why Kita Tools is built differently
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col">
              <span className="font-mono-meta text-xs font-bold text-[var(--md-sys-color-primary)] mb-2">
                {pillar.badge}
              </span>
              <h4 className="font-headline font-semibold text-sm sm:text-base text-[var(--md-sys-color-on-surface)] mb-1.5">
                {pillar.title}
              </h4>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legal & Community Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-[24px] bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40">
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
          <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
            <span className="font-semibold text-[var(--md-sys-color-on-surface)]">Kita Tools</span> is an open fan project. Not an official Minecraft product, and not approved by or associated with Mojang or Microsoft.
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/#explore-tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-bold shadow-2xs hover:brightness-105 active:scale-98 transition-all"
          >
            <span>Browse All Tools</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
