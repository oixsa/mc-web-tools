'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { QuickLauncherModal } from '@/app/components/QuickLauncherModal';
import { useTheme } from '@/app/hooks/useTheme';

type EulerTriple = [number, number, number];

interface StandPose {
  head: EulerTriple;
  body: EulerTriple;
  leftArm: EulerTriple;
  rightArm: EulerTriple;
  leftLeg: EulerTriple;
  rightLeg: EulerTriple;
}

const DEFAULT_POSE: StandPose = {
  head: [0, 0, 0],
  body: [0, 0, 0],
  leftArm: [-10, 0, -10],
  rightArm: [-15, 0, 10],
  leftLeg: [-1, 0, -1],
  rightLeg: [1, 0, 1],
};

const PRESET_POSES: Record<string, StandPose> = {
  default: DEFAULT_POSE,
  salute: {
    head: [-5, 0, 0],
    body: [0, 0, 0],
    leftArm: [0, 0, -5],
    rightArm: [-120, 35, 45],
    leftLeg: [0, 0, 0],
    rightLeg: [0, 0, 0],
  },
  pointing: {
    head: [0, 20, 0],
    body: [0, 15, 0],
    leftArm: [-10, 0, -10],
    rightArm: [-90, -20, 0],
    leftLeg: [-5, 0, 0],
    rightLeg: [5, 0, 0],
  },
  guard: {
    head: [-5, 0, 0],
    body: [0, -10, 0],
    leftArm: [-50, 40, -10],
    rightArm: [-60, -35, 20],
    leftLeg: [-20, 0, -10],
    rightLeg: [20, 0, 10],
  },
  running: {
    head: [10, 0, 0],
    body: [15, 0, 0],
    leftArm: [45, 0, 0],
    rightArm: [-45, 0, 0],
    leftLeg: [-45, 0, 0],
    rightLeg: [45, 0, 0],
  },
  zombie: {
    head: [5, 0, 0],
    body: [0, 0, 0],
    leftArm: [-90, 10, 0],
    rightArm: [-90, -10, 0],
    leftLeg: [15, 0, 0],
    rightLeg: [-15, 0, 0],
  },
};

export default function ArmorStandPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // States
  const [pose, setPose] = useState<StandPose>(DEFAULT_POSE);
  const [showArms, setShowArms] = useState(true);
  const [noBasePlate, setNoBasePlate] = useState(true);
  const [isSmall, setIsSmall] = useState(false);
  const [isInvisible, setIsInvisible] = useState(false);
  const [noGravity, setNoGravity] = useState(false);
  const [customName, setCustomName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const updateAngle = (part: keyof StandPose, axisIndex: 0 | 1 | 2, val: number) => {
    const clamped = Math.max(-180, Math.min(180, val));
    setPose((prev) => {
      const current = [...prev[part]] as EulerTriple;
      current[axisIndex] = clamped;
      return { ...prev, [part]: current };
    });
  };

  // Compile Summon Command
  const summonCommand = useMemo(() => {
    const tags: string[] = [];

    if (showArms) tags.push('ShowArms:1b');
    if (noBasePlate) tags.push('NoBasePlate:1b');
    if (isSmall) tags.push('Small:1b');
    if (isInvisible) tags.push('Invisible:1b');
    if (noGravity) tags.push('NoGravity:1b');
    if (customName) {
      const escaped = customName.replace(/"/g, '\\"');
      tags.push(`CustomName:'{"text":"${escaped}"}',CustomNameVisible:1b`);
    }

    const poseTags: string[] = [];
    (['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'] as (keyof StandPose)[]).forEach(
      (part) => {
        const angles = pose[part];
        if (angles[0] !== 0 || angles[1] !== 0 || angles[2] !== 0) {
          const capName = part.charAt(0).toUpperCase() + part.slice(1);
          poseTags.push(`${capName}:[${angles[0]}f,${angles[1]}f,${angles[2]}f]`);
        }
      }
    );

    if (poseTags.length > 0) {
      tags.push(`Pose:{${poseTags.join(',')}}`);
    }

    const tagStr = tags.length > 0 ? ` {${tags.join(',')}}` : '';
    return `/summon armor_stand ~ ~ ~${tagStr}`;
  }, [pose, showArms, noBasePlate, isSmall, isInvisible, noGravity, customName]);

  const copyCommand = () => {
    navigator.clipboard.writeText(summonCommand);
    triggerToast('Copied /summon command!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F4] dark:bg-[#15100E] text-[#1A1210] dark:text-[#F8F4F0] transition-colors">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B] mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Tools</span>
          <span>/</span>
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Armor Stand Pose Visualizer</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">accessibility_new</span>
            Utilities &amp; Poses
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Armor Stand Pose Visualizer
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Pose Minecraft armor stands with real-time limb rotation controls, NBT flags (arms, no base, invisible), and generate ready-to-paste <code>/summon</code> commands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Presets & Toggles */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-4">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">tune</span>
                Preset Poses
              </h2>

              <div className="grid grid-cols-3 gap-2">
                {Object.keys(PRESET_POSES).map((pKey) => (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => {
                      setPose(PRESET_POSES[pKey]);
                      triggerToast(`Applied "${pKey}" pose!`);
                    }}
                    className="py-2 px-2 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] text-xs font-semibold capitalize hover:border-[#8A4228] dark:hover:border-[#E07A5F] hover:text-[#8A4228] dark:hover:text-[#E07A5F] transition-colors"
                  >
                    {pKey}
                  </button>
                ))}
              </div>

              {/* NBT Toggles */}
              <div className="pt-3 border-t border-[#E2DDD8] dark:border-[#3A2D28] space-y-2">
                <label className="block text-xs font-bold text-[#1A1210] dark:text-[#F8F4F0]">
                  Armor Stand Attributes
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showArms}
                      onChange={(e) => setShowArms(e.target.checked)}
                      className="accent-[#8A4228] dark:accent-[#E07A5F] w-4 h-4 rounded"
                    />
                    <span>Show Arms</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noBasePlate}
                      onChange={(e) => setNoBasePlate(e.target.checked)}
                      className="accent-[#8A4228] dark:accent-[#E07A5F] w-4 h-4 rounded"
                    />
                    <span>No Base Plate</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSmall}
                      onChange={(e) => setIsSmall(e.target.checked)}
                      className="accent-[#8A4228] dark:accent-[#E07A5F] w-4 h-4 rounded"
                    />
                    <span>Small (Baby)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInvisible}
                      onChange={(e) => setIsInvisible(e.target.checked)}
                      className="accent-[#8A4228] dark:accent-[#E07A5F] w-4 h-4 rounded"
                    />
                    <span>Invisible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noGravity}
                      onChange={(e) => setNoGravity(e.target.checked)}
                      className="accent-[#8A4228] dark:accent-[#E07A5F] w-4 h-4 rounded"
                    />
                    <span>No Gravity (Float)</span>
                  </label>
                </div>
              </div>

              {/* Custom Name */}
              <div className="pt-2 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <label className="block text-xs font-semibold mb-1">Custom Name Tag (Optional)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Guard Captain"
                  className="w-full h-9 px-3 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] text-xs font-mono"
                />
              </div>
            </div>

            {/* Rotation Sliders */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="font-headline font-bold text-sm">Limb Rotations (Pitch / Yaw / Roll)</h3>

              {[
                { key: 'rightArm' as const, label: 'Right Arm' },
                { key: 'leftArm' as const, label: 'Left Arm' },
                { key: 'head' as const, label: 'Head' },
                { key: 'body' as const, label: 'Body' },
                { key: 'rightLeg' as const, label: 'Right Leg' },
                { key: 'leftLeg' as const, label: 'Left Leg' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1.5 pb-2 border-b border-[#E2DDD8]/60 dark:border-[#3A2D28]/60 last:border-b-0">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{label}</span>
                    <span className="font-mono text-[11px] text-[#8A4228] dark:text-[#E07A5F]">
                      [{pose[key][0]}°, {pose[key][1]}°, {pose[key][2]}°]
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { axis: 0 as const, name: 'Pitch (X)' },
                      { axis: 1 as const, name: 'Yaw (Y)' },
                      { axis: 2 as const, name: 'Roll (Z)' },
                    ].map(({ axis, name }) => (
                      <div key={axis} className="text-[10px]">
                        <span className="text-[#918A83] block truncate">{name}</span>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={pose[key][axis]}
                          onChange={(e) => updateAngle(key, axis, parseInt(e.target.value) || 0)}
                          className="w-full accent-[#8A4228] dark:accent-[#E07A5F]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wireframe Preview & Command Output */}
          <div className="lg:col-span-6 space-y-6">
            {/* Visual Mannequin Viewport */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-6 shadow-2xs flex flex-col items-center justify-center min-h-[380px] relative">
              <div className="absolute top-4 left-4 text-xs font-bold text-[#68615A] dark:text-[#A8A19B] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
                Mannequin Preview
              </div>

              {/* 2D Skeletal SVG Preview */}
              <svg width="220" height="260" viewBox="0 0 200 240" className="overflow-visible">
                {/* Base Plate */}
                {!noBasePlate && (
                  <ellipse cx="100" cy="220" rx="40" ry="10" fill="#757575" stroke="#424242" strokeWidth="2" />
                )}

                {/* Left Leg */}
                <g transform={`translate(88, 140) rotate(${pose.leftLeg[0] || 0})`}>
                  <rect x="-6" y="0" width="12" height="70" rx="3" fill="#A2824E" stroke="#735433" strokeWidth="1.5" />
                </g>

                {/* Right Leg */}
                <g transform={`translate(112, 140) rotate(${pose.rightLeg[0] || 0})`}>
                  <rect x="-6" y="0" width="12" height="70" rx="3" fill="#A2824E" stroke="#735433" strokeWidth="1.5" />
                </g>

                {/* Torso */}
                <g transform={`translate(100, 90) rotate(${pose.body[1] || 0})`}>
                  <rect x="-20" y="0" width="40" height="50" rx="4" fill="#8A4228" stroke="#5E2C1A" strokeWidth="2" />
                </g>

                {/* Head */}
                <g transform={`translate(100, 60) rotate(${pose.head[0] || 0})`}>
                  <rect x="-16" y="-30" width="32" height="32" rx="4" fill="#C6B67A" stroke="#8F8254" strokeWidth="2" />
                  {/* Stand neck peg */}
                  <rect x="-4" y="2" width="8" height="12" fill="#735433" />
                </g>

                {/* Left Arm */}
                {showArms && (
                  <g transform={`translate(75, 95) rotate(${pose.leftArm[0] || 0})`}>
                    <rect x="-5" y="0" width="10" height="50" rx="3" fill="#A2824E" stroke="#735433" strokeWidth="1.5" />
                  </g>
                )}

                {/* Right Arm */}
                {showArms && (
                  <g transform={`translate(125, 95) rotate(${pose.rightArm[0] || 0})`}>
                    <rect x="-5" y="0" width="10" height="50" rx="3" fill="#A2824E" stroke="#735433" strokeWidth="1.5" />
                  </g>
                )}
              </svg>

              {customName && (
                <div className="mt-2 px-2 py-0.5 rounded bg-black/60 text-white font-mono text-xs border border-white/20">
                  {customName}
                </div>
              )}
            </div>

            {/* Summon Command Box */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm">Minecraft /summon Command</h3>
                <button
                  type="button"
                  onClick={copyCommand}
                  className="text-xs font-semibold text-[#8A4228] dark:text-[#E07A5F] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Copy Command
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-black/5 dark:bg-black/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all border border-[#E2DDD8]/60 dark:border-[#3A2D28]/60">
                {summonCommand}
              </pre>

              <button
                type="button"
                onClick={copyCommand}
                className="w-full py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-bold hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy /summon Command
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <QuickLauncherModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={(tool) => { window.location.href = tool.href; }}
      />
    </div>
  );
}
