'use client';

import Image from 'next/image';
import { FOOTER_SECTIONS } from '../data/navigation';

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#201815] border-t border-[#E2DDD8] dark:border-[#3A2D28] mt-16 sm:mt-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.png"
                alt="kita tools logo"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="font-headline font-bold text-base text-[#1A1210] dark:text-[#F8F4F0]">
                kita{' '}
                <span className="text-[#8A4228] dark:text-[#E07A5F]">tools</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#68615A] dark:text-[#A8A19B] leading-relaxed mb-4">
              Precision web utilities, calculators, and schematics crafted for technical builders and
              voxel architects.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
              <span className="font-mono-meta text-[10px] font-bold text-[#8A4228] dark:text-[#E07A5F]">
                v2.4 STABLE
              </span>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-[#1A1210] dark:text-[#F8F4F0] mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-[#68615A] dark:text-[#A8A19B] hover:text-[#8A4228] dark:hover:text-[#E07A5F] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer & Bottom Utility Row */}
        <div className="pt-6 border-t border-[#E2DDD8] dark:border-[#3A2D28] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#68615A] dark:text-[#A8A19B]">
          <p className="text-center sm:text-left">
            © 2026 kita tools — Not an official Minecraft website. Not approved by or associated with
            Mojang or Microsoft.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/docs"
              className="hover:text-[#8A4228] dark:hover:text-[#E07A5F] transition-colors"
            >
              Documentation
            </a>
            <a
              href="#status"
              className="hover:text-[#8A4228] dark:hover:text-[#E07A5F] transition-colors"
            >
              Status
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8A4228] dark:hover:text-[#E07A5F] transition-colors"
            >
              Source Code
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
