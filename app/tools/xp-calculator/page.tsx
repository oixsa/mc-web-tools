'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

/**
 * Total XP points required from level 0 to target level (Minecraft 1.8+ formulas).
 */
function totalXpForLevel(level: number): number {
  const l = Math.max(0, Math.floor(level));
  if (l <= 16) {
    return l * l + 6 * l;
  }
  if (l <= 31) {
    return Math.floor(2.5 * l * l - 40.5 * l + 360);
  }
  return Math.floor(4.5 * l * l - 162.5 * l + 2220);
}

/**
 * XP points needed to advance from level to level + 1.
 */
function xpToNextLevel(level: number): number {
  const l = Math.max(0, Math.floor(level));
  if (l <= 15) return 2 * l + 7;
  if (l <= 30) return 5 * l - 38;
  return 9 * l - 158;
}

const MOB_XP_VALUES = [
  { name: 'Common Mobs (Zombies, Skeletons, Spiders)', xp: 5, icon: 'pest_control' },
  { name: 'Blazes (Nether Fortress)', xp: 10, icon: 'local_fire_department' },
  { name: 'Endermen (End Farm)', xp: 5, icon: 'visibility' },
  { name: 'Guardians (Ocean Monument)', xp: 10, icon: 'water' },
  { name: 'Piglin Brute (Bastion)', xp: 20, icon: 'shield' },
  { name: 'Ender Dragon (Respawn)', xp: 500, icon: 'flight' },
];

export default function XpCalculatorPage() {
  // States
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [targetLevel, setTargetLevel] = useState<number>(30);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleCurrentChange = (val: number) => {
    const clamped = Math.max(0, Math.min(500, val || 0));
    setCurrentLevel(clamped);
    if (clamped >= targetLevel) {
      setTargetLevel(Math.min(500, clamped + 1));
    }
  };

  const handleTargetChange = (val: number) => {
    const clamped = Math.max(1, Math.min(500, val || 1));
    setTargetLevel(clamped);
    if (clamped <= currentLevel) {
      setCurrentLevel(Math.max(0, clamped - 1));
    }
  };

  const currentTotal = useMemo(() => totalXpForLevel(currentLevel), [currentLevel]);
  const targetTotal = useMemo(() => totalXpForLevel(targetLevel), [targetLevel]);
  const pointsNeeded = Math.max(0, targetTotal - currentTotal);

  const bottlesNeeded = Math.ceil(pointsNeeded / 7); // Bottles o' Enchanting avg 7 XP
  const quartzOreNeeded = Math.ceil(pointsNeeded / 3.5); // Nether Quartz avg 3.5 XP

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B] mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span>Tools</span>
        <span>/</span>
        <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">XP &amp; Level Calculator</span>
      </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">calculate</span>
            Mechanics &amp; Progression
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Experience &amp; Level Calculator
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Calculate exact XP points, mob farm kill counts, and Bottles o&apos; Enchanting needed to reach any target level using official Minecraft 1.8+ formulas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-5">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">tune</span>
                Level Parameters
              </h2>

              {/* Current Level */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Current Level</span>
                  <span className="font-mono text-[#8A4228] dark:text-[#E07A5F] font-bold">Level {currentLevel}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={currentLevel}
                  onChange={(e) => handleCurrentChange(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] font-mono text-sm"
                />
                <span className="text-[11px] text-[#918A83] mt-1 block">
                  Next level needs {xpToNextLevel(currentLevel)} XP points
                </span>
              </div>

              {/* Target Level */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Target Level</span>
                  <span className="font-mono text-[#8A4228] dark:text-[#E07A5F] font-bold">Level {targetLevel}</span>
                </div>
                <input
                  type="number"
                  min={currentLevel + 1}
                  max="1000"
                  value={targetLevel}
                  onChange={(e) => handleTargetChange(parseInt(e.target.value) || currentLevel + 1)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] font-mono text-sm"
                />
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <label className="block text-xs font-semibold mb-2">Quick Level Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '0 -> 30 (Enchanting)', start: 0, end: 30 },
                    { label: '27 -> 30 (Top-up)', start: 27, end: 30 },
                    { label: '30 -> 50', start: 30, end: 50 },
                    { label: '0 -> 100 (Flex)', start: 0, end: 100 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setCurrentLevel(p.start);
                        setTargetLevel(p.end);
                        triggerToast(`Applied "${p.label}"!`);
                      }}
                      className="p-2 text-xs font-semibold rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#8A4228] dark:hover:border-[#E07A5F] transition-colors text-left"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* XP Points Summary Card */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD8] dark:border-[#3A2D28]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#68615A] dark:text-[#A8A19B]">
                    XP Points Needed
                  </span>
                  <div className="text-3xl font-headline font-bold text-[#8A4228] dark:text-[#E07A5F]">
                    {pointsNeeded.toLocaleString()} Points
                  </div>
                </div>

                <div className="text-xs text-[#68615A] dark:text-[#A8A19B] sm:text-right">
                  <div>Start Level Total: <strong>{startTotal.toLocaleString()}</strong></div>
                  <div>Target Level Total: <strong>{endTotal.toLocaleString()}</strong></div>
                </div>
              </div>

              {/* Mob Kills Breakdown Grid */}
              <div className="mt-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#68615A] dark:text-[#A8A19B]">
                  Required Farm Mob Kills
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MOB_XP_VALUES.map((mob) => {
                    const kills = Math.ceil(pointsNeeded / mob.xp);
                    return (
                      <div
                        key={mob.name}
                        className="p-3 rounded-xl border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[18px]">
                            {mob.icon}
                          </span>
                          <span className="truncate max-w-[170px]">{mob.name}</span>
                        </div>
                        <span className="font-mono font-bold text-[#8A4228] dark:text-[#E07A5F]">
                          {kills.toLocaleString()} kills
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Alternatives (Bottles & Mining) */}
              <div className="mt-5 pt-4 border-t border-[#E2DDD8] dark:border-[#3A2D28] grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-center">
                  <div className="text-[#68615A] dark:text-[#A8A19B] mb-1">Bottles o&apos; Enchanting</div>
                  <div className="font-headline font-bold text-lg text-[#8A4228] dark:text-[#E07A5F]">
                    {bottlesNeeded.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#918A83]">~{Math.ceil(bottlesNeeded / 64)} stacks</div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-center">
                  <div className="text-[#68615A] dark:text-[#A8A19B] mb-1">Nether Quartz Ores</div>
                  <div className="font-headline font-bold text-lg text-[#8A4228] dark:text-[#E07A5F]">
                    {quartzOreNeeded.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#918A83]">mined without silk touch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
