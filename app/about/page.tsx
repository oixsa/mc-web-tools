import Link from 'next/link';
import { AboutSection } from '../components/AboutSection';

export default function AboutPage() {
  return (
    <div className="w-full pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[var(--md-sys-color-on-surface-variant)]">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-[var(--md-sys-color-primary)] font-semibold">About</span>
        </div>
      </div>

      <AboutSection />
    </div>
  );
}
