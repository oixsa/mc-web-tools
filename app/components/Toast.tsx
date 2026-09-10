'use client';

interface ToastProps {
  message: string | null;
  icon?: string;
}

/**
 * Standard Material 3 Toast Notification banner.
 * Displays temporary feedback with proper accessible roles and smooth entry animation.
 */
export function Toast({ message, icon = 'check_circle' }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span>{message}</span>
    </div>
  );
}
