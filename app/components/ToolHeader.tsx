'use client';

import Link from 'next/link';

interface ToolHeaderProps {
  title: string;
  description: string;
  category?: string;
  badge?: string;
  icon?: string;
  children?: React.ReactNode;
}

/**
 * Standardized Material 3 Tool Page Header and Breadcrumb.
 * Unifies navigation hierarchy, title styling, and metadata badges across all tools.
 */
export function ToolHeader({
  title,
  description,
  category,
  badge,
  icon,
  children,
}: ToolHeaderProps) {
  const badgeText = badge || category;

  return (
    <div className="mb-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--md-sys-color-on-surface-variant)] mb-6">
        <Link href="/" className="hover:text-[var(--md-sys-color-primary)] hover:underline transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/#explore-tools" className="hover:text-[var(--md-sys-color-primary)] hover:underline transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="text-[var(--md-sys-color-primary)] font-semibold truncate max-w-[200px] sm:max-w-none">
          {title}
        </span>
      </nav>

      {/* Category / Badge Indicator */}
      {badgeText && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--md-sys-color-primary-container)] border border-[var(--md-sys-color-outline-variant)]/40 text-[11px] font-bold text-[var(--md-sys-color-on-primary-container)] mb-3 uppercase tracking-wider select-none">
          {icon && (
            <span className="material-symbols-outlined text-[15px]">{icon}</span>
          )}
          <span>{badgeText}</span>
        </div>
      )}

      {/* Main Tool Title */}
      <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2 text-[var(--md-sys-color-on-surface)]">
        {title}
      </h1>

      {/* Tool Description */}
      <p className="text-sm sm:text-base text-[var(--md-sys-color-on-surface-variant)] max-w-2xl leading-relaxed">
        {description}
      </p>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
