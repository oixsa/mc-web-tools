'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV_ITEMS } from '../data/navigation';

interface NavbarProps {
  className?: string;
}

/**
 * Desktop Material 3 Navigation Bar Component.
 * Displays navigation links with M3 tonal active indicators.
 */
export function Navbar({ className = '' }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`hidden md:flex items-center gap-1.5 text-sm font-medium ${className}`}
      aria-label="Main Navigation"
    >
      {MAIN_NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === '/#explore-tools' && pathname === '/');
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-150 ${
              isActive
                ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold shadow-2xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile Material 3 Navigation Drawer Component.
 * Displays responsive full-width navigation drawer with active state pills.
 */
export function MobileNavbar({ isOpen, onClose }: MobileNavbarProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container-low)] px-4 pt-3 pb-5 shadow-xl animate-in slide-in-from-top-2 duration-150">
      <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center justify-between ${
                isActive
                  ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold'
                  : 'text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)]'
              }`}
            >
              <span>{item.label}</span>
              <span className="material-symbols-outlined text-[var(--md-sys-color-outline)] text-[18px]">
                arrow_forward
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/40 flex items-center justify-between text-xs text-[var(--md-sys-color-on-surface-variant)]">
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            GitHub
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">forum</span>
            Discord
          </a>
        </div>
        <span className="font-mono-meta text-[11px] text-[var(--md-sys-color-primary)] font-bold">
          v2.5 M3
        </span>
      </div>
    </div>
  );
}

export default Navbar;
