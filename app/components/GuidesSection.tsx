'use client';

import { GUIDES } from '../data/guides';

export function GuidesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full border-t border-[#E2DDD8] dark:border-[#3A2D28]" id="guides">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#1A1210] dark:text-[#F8F4F0]">
              Guides
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B]">
            Interactive references with the real numbers behind the game.
          </p>
        </div>
        <a
          href="/guides"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#8A4228] dark:text-[#E07A5F] hover:underline"
        >
          See all guides
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GUIDES.map((guide) => (
          <a
            key={guide.id}
            href={guide.href}
            className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#CBC4BD] dark:hover:border-[#54413A] shadow-2xs hover:shadow-md transition-all flex items-start justify-between group hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-3.5 pr-2">
              <div className="w-10 h-10 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] flex items-center justify-center text-[#8A4228] dark:text-[#E07A5F] flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">{guide.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {guide.badge && (
                    <span className="font-mono-meta text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FBECE6] dark:bg-[#38231C] text-[#8A4228] dark:text-[#E07A5F]">
                      {guide.badge}
                    </span>
                  )}
                  <h3 className="font-headline font-bold text-sm text-[#1A1210] dark:text-[#F8F4F0] group-hover:text-[#8A4228] dark:group-hover:text-[#E07A5F] transition-colors">
                    {guide.title}
                  </h3>
                </div>
                <p className="text-xs text-[#68615A] dark:text-[#A8A19B] leading-relaxed line-clamp-2">
                  {guide.description}
                </p>
              </div>
            </div>

            <span className="material-symbols-outlined text-[#918A83] group-hover:text-[#8A4228] dark:group-hover:text-[#E07A5F] group-hover:translate-x-0.5 transition-all text-[18px] flex-shrink-0 mt-1">
              arrow_forward
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
