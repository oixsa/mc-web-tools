import Link from 'next/link';
import { AboutSection } from '../components/AboutSection';

export default function AboutPage() {
  return (
    <div className="w-full pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B]">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">About</span>
        </div>
      </div>

      <AboutSection />
    </div>
  );
}
