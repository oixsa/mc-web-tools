'use client';

import Image from 'next/image';
import { FOOTER_SECTIONS } from '../data/navigation';

export function Footer() {
  return (
    <footer className="w-full bg-[var(--md-sys-color-surface-container-low)] border-t border-[var(--md-sys-color-outline-variant)]/40 mt-16 sm:mt-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/logo.png"
                alt="kita tools logo"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="font-headline font-bold text-base text-[var(--md-sys-color-on-surface)]">
                kita{' '}
                <span className="text-[var(--md-sys-color-primary)]">tools</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--md-sys-color-on-surface-variant)] leading-relaxed mb-4">
              Precision web utilities, calculators, and schematics crafted for technical builders and
              voxel architects.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--md-sys-color-primary-container)] border border-[var(--md-sys-color-outline-variant)]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--md-sys-color-primary)]" />
              <span className="font-mono-meta text-[10px] font-bold text-[var(--md-sys-color-on-primary-container)]">
                v2.5 MATERIAL 3
              </span>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-headline font-bold text-xs sm:text-sm text-[var(--md-sys-color-on-surface)] mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)] transition-colors"
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
        <div className="pt-6 border-t border-[var(--md-sys-color-outline-variant)]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--md-sys-color-on-surface-variant)]">
          <p className="text-center sm:text-left">
            © 2026 kita tools. Not an official Minecraft website. Not approved by or associated with
            Mojang or Microsoft.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/about"
              className="hover:text-[var(--md-sys-color-primary)] transition-colors"
            >
              About
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--md-sys-color-primary)] transition-colors"
            >
              Source Code
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
