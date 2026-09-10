'use client';

import { useMemo, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';

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
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [targetLevel, setTargetLevel] = useState<number>(30);
  const { toastMessage, showToast } = useToast();

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

  const bottlesNeeded = Math.ceil(pointsNeeded / 7);
  const quartzOreNeeded = Math.ceil(pointsNeeded / 3.5);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Experience & Level Calculator"
        description="Calculate exact XP points, mob farm kill counts, and Bottles o' Enchanting needed to reach any target level using official Minecraft 1.8+ formulas."
        badge="Mechanics & Progression"
        icon="calculate"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 shadow-2xs space-y-5">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">tune</span>
              Level Parameters
            </h2>

            {/* Current Level */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                <span>Current Level</span>
                <span className="font-mono text-[var(--md-sys-color-primary)] font-bold">Level {currentLevel}</span>
              </div>
              <input
                type="number"
                min="0"
                max="500"
                value={currentLevel}
                onChange={(e) => handleCurrentChange(parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] font-mono text-sm focus:outline-none focus:border-[var(--md-sys-color-primary)]"
              />
              <span className="text-[11px] text-[var(--md-sys-color-outline)] mt-1 block">
                Next level needs {xpToNextLevel(currentLevel)} XP points
              </span>
            </div>

            {/* Target Level */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface-variant)]">
                <span>Target Level</span>
                <span className="font-mono text-[var(--md-sys-color-primary)] font-bold">Level {targetLevel}</span>
              </div>
              <input
                type="number"
                min={currentLevel + 1}
                max="1000"
                value={targetLevel}
                onChange={(e) => handleTargetChange(parseInt(e.target.value) || currentLevel + 1)}
                className="w-full h-10 px-3 rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] font-mono text-sm focus:outline-none focus:border-[var(--md-sys-color-primary)]"
              />
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]/40">
              <label className="block text-xs font-semibold mb-2 text-[var(--md-sys-color-on-surface-variant)]">
                Quick Level Presets
              </label>
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
                      showToast(`Applied "${p.label}"!`);
                    }}
                    className="p-2 text-xs font-semibold rounded-lg border border-[var(--md-sys-color-outline-variant)]/40 hover:border-[var(--md-sys-color-primary)] transition-colors text-left text-[var(--md-sys-color-on-surface)] cursor-pointer"
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
          <div className="bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/40 rounded-2xl p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--md-sys-color-outline-variant)]/40">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
                  XP Points Needed
                </span>
                <div className="text-3xl font-headline font-bold text-[var(--md-sys-color-primary)]">
                  {pointsNeeded.toLocaleString()} Points
                </div>
              </div>

              <div className="text-xs text-[var(--md-sys-color-on-surface-variant)] sm:text-right">
                <div>Start Level Total: <strong>{currentTotal.toLocaleString()}</strong></div>
                <div>Target Level Total: <strong>{targetTotal.toLocaleString()}</strong></div>
              </div>
            </div>

            {/* Mob Kills Breakdown Grid */}
            <div className="mt-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
                Required Farm Mob Kills
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOB_XP_VALUES.map((mob) => {
                  const kills = Math.ceil(pointsNeeded / mob.xp);
                  return (
                    <div
                      key={mob.name}
                      className="p-3 rounded-xl border border-[var(--md-sys-color-outline-variant)]/40 bg-[var(--md-sys-color-surface-container)] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[18px]">
                          {mob.icon}
                        </span>
                        <span className="truncate max-w-[170px] text-[var(--md-sys-color-on-surface)]">{mob.name}</span>
                      </div>
                      <span className="font-mono font-bold text-[var(--md-sys-color-primary)]">
                        {kills.toLocaleString()} kills
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alternatives (Bottles & Mining) */}
            <div className="mt-5 pt-4 border-t border-[var(--md-sys-color-outline-variant)]/40 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 text-center">
                <div className="text-[var(--md-sys-color-on-surface-variant)] mb-1">Bottles o&apos; Enchanting</div>
                <div className="font-headline font-bold text-lg text-[var(--md-sys-color-primary)]">
                  {bottlesNeeded.toLocaleString()}
                </div>
                <div className="text-[10px] text-[var(--md-sys-color-outline)]">~{Math.ceil(bottlesNeeded / 64)} stacks</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/40 text-center">
                <div className="text-[var(--md-sys-color-on-surface-variant)] mb-1">Nether Quartz Ores</div>
                <div className="font-headline font-bold text-lg text-[var(--md-sys-color-primary)]">
                  {quartzOreNeeded.toLocaleString()}
                </div>
                <div className="text-[10px] text-[var(--md-sys-color-outline)]">mined without silk touch</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
