'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { QuickLauncherModal } from '@/app/components/QuickLauncherModal';
import { useTheme } from '@/app/hooks/useTheme';

interface Enchantment {
  id: string;
  name: string;
  maxLevel: number;
  weight: number; // Multiplier per level in anvil
  itemMultiplier: number;
  incompatibleWith?: string[];
}

const ALL_ENCHANTMENTS: Record<string, Enchantment[]> = {
  sword: [
    { id: 'sharpness', name: 'Sharpness V', maxLevel: 5, weight: 1, itemMultiplier: 1, incompatibleWith: ['smite', 'bane_of_arthropods'] },
    { id: 'smite', name: 'Smite V', maxLevel: 5, weight: 1, itemMultiplier: 1, incompatibleWith: ['sharpness', 'bane_of_arthropods'] },
    { id: 'bane_of_arthropods', name: 'Bane of Arthropods V', maxLevel: 5, weight: 1, itemMultiplier: 1, incompatibleWith: ['sharpness', 'smite'] },
    { id: 'unbreaking', name: 'Unbreaking III', maxLevel: 3, weight: 1, itemMultiplier: 1 },
    { id: 'mending', name: 'Mending', maxLevel: 1, weight: 2, itemMultiplier: 2 },
    { id: 'looting', name: 'Looting III', maxLevel: 3, weight: 2, itemMultiplier: 2 },
    { id: 'fire_aspect', name: 'Fire Aspect II', maxLevel: 2, weight: 2, itemMultiplier: 2 },
    { id: 'knockback', name: 'Knockback II', maxLevel: 2, weight: 1, itemMultiplier: 1 },
    { id: 'sweeping_edge', name: 'Sweeping Edge III', maxLevel: 3, weight: 2, itemMultiplier: 2 },
  ],
  pickaxe: [
    { id: 'efficiency', name: 'Efficiency V', maxLevel: 5, weight: 1, itemMultiplier: 1 },
    { id: 'unbreaking', name: 'Unbreaking III', maxLevel: 3, weight: 1, itemMultiplier: 1 },
    { id: 'fortune', name: 'Fortune III', maxLevel: 3, weight: 2, itemMultiplier: 2, incompatibleWith: ['silk_touch'] },
    { id: 'silk_touch', name: 'Silk Touch', maxLevel: 1, weight: 4, itemMultiplier: 4, incompatibleWith: ['fortune'] },
    { id: 'mending', name: 'Mending', maxLevel: 1, weight: 2, itemMultiplier: 2 },
  ],
  bow: [
    { id: 'power', name: 'Power V', maxLevel: 5, weight: 1, itemMultiplier: 1 },
    { id: 'unbreaking', name: 'Unbreaking III', maxLevel: 3, weight: 1, itemMultiplier: 1 },
    { id: 'flame', name: 'Flame', maxLevel: 1, weight: 2, itemMultiplier: 2 },
    { id: 'punch', name: 'Punch II', maxLevel: 2, weight: 2, itemMultiplier: 2 },
    { id: 'infinity', name: 'Infinity', maxLevel: 1, weight: 4, itemMultiplier: 4, incompatibleWith: ['mending'] },
    { id: 'mending', name: 'Mending', maxLevel: 1, weight: 2, itemMultiplier: 2, incompatibleWith: ['infinity'] },
  ],
  boots: [
    { id: 'protection', name: 'Protection IV', maxLevel: 4, weight: 1, itemMultiplier: 1, incompatibleWith: ['blast_protection', 'fire_protection', 'projectile_protection'] },
    { id: 'feather_falling', name: 'Feather Falling IV', maxLevel: 4, weight: 1, itemMultiplier: 1 },
    { id: 'depth_strider', name: 'Depth Strider III', maxLevel: 3, weight: 2, itemMultiplier: 2, incompatibleWith: ['frost_walker'] },
    { id: 'frost_walker', name: 'Frost Walker II', maxLevel: 2, weight: 2, itemMultiplier: 2, incompatibleWith: ['depth_strider'] },
    { id: 'unbreaking', name: 'Unbreaking III', maxLevel: 3, weight: 1, itemMultiplier: 1 },
    { id: 'mending', name: 'Mending', maxLevel: 1, weight: 2, itemMultiplier: 2 },
    { id: 'soul_speed', name: 'Soul Speed III', maxLevel: 3, weight: 4, itemMultiplier: 4 },
  ],
  helmet: [
    { id: 'protection', name: 'Protection IV', maxLevel: 4, weight: 1, itemMultiplier: 1, incompatibleWith: ['blast_protection', 'fire_protection', 'projectile_protection'] },
    { id: 'respiration', name: 'Respiration III', maxLevel: 3, weight: 2, itemMultiplier: 2 },
    { id: 'aqua_affinity', name: 'Aqua Affinity', maxLevel: 1, weight: 2, itemMultiplier: 2 },
    { id: 'unbreaking', name: 'Unbreaking III', maxLevel: 3, weight: 1, itemMultiplier: 1 },
    { id: 'mending', name: 'Mending', maxLevel: 1, weight: 2, itemMultiplier: 2 },
  ],
};

interface AnvilNode {
  name: string;
  isItem: boolean;
  cost: number;
  penalty: number;
  enchantCost: number;
  left?: AnvilNode;
  right?: AnvilNode;
}

interface CombiningStep {
  step: number;
  target: string;
  sacrifice: string;
  result: string;
  levelCost: number;
  tooExpensive: boolean;
}

/**
 * Optimizes enchantment combining order to minimize total levels and avoid >39 limit.
 */
function solveOptimalAnvilOrder(
  itemName: string,
  selectedEnchants: Enchantment[]
): { steps: CombiningStep[]; totalLevels: number; isTooExpensive: boolean } {
  if (selectedEnchants.length === 0) {
    return { steps: [], totalLevels: 0, isTooExpensive: false };
  }

  // Sort enchantments by weight descending
  const sorted = [...selectedEnchants].sort((a, b) => b.weight * b.maxLevel - a.weight * a.maxLevel);

  // Binary tree combination strategy: combine books pairwise first, then apply to item
  const steps: CombiningStep[] = [];
  let totalLevels = 0;
  let isTooExpensive = false;

  interface IntermediateItem {
    name: string;
    penalty: number;
    enchants: Enchantment[];
    isMainItem: boolean;
  }

  const items: IntermediateItem[] = [
    { name: itemName, penalty: 0, enchants: [], isMainItem: true },
    ...sorted.map((e) => ({
      name: `Book (${e.name})`,
      penalty: 0,
      enchants: [e],
      isMainItem: false,
    })),
  ];

  let stepNum = 1;

  // Pairwise combine books
  while (items.length > 1) {
    // Pick the best pair (lowest combined penalty and reasonable enchantment cost)
    let bestA = 0;
    let bestB = 1;
    let lowestCost = Infinity;

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];

        // Prefer combining books with books first, then with main item last
        if (a.isMainItem && items.length > 2 && !b.isMainItem) {
          continue; // wait till books are consolidated
        }

        const penaltyA = Math.pow(2, a.penalty) - 1;
        const penaltyB = Math.pow(2, b.penalty) - 1;
        const enchantWeight = b.enchants.reduce((acc, cur) => acc + cur.weight * cur.maxLevel, 0);

        const cost = penaltyA + penaltyB + enchantWeight;
        if (cost < lowestCost) {
          lowestCost = cost;
          bestA = i;
          bestB = j;
        }
      }
    }

    const itemA = items[bestA];
    const itemB = items[bestB];

    const penaltyA = Math.pow(2, itemA.penalty) - 1;
    const penaltyB = Math.pow(2, itemB.penalty) - 1;
    const enchantCost = itemB.enchants.reduce((acc, cur) => acc + cur.weight * cur.maxLevel, 0);
    const stepCost = penaltyA + penaltyB + enchantCost;

    const tooExpensive = stepCost > 39;
    if (tooExpensive) isTooExpensive = true;
    totalLevels += stepCost;

    const resultName = itemA.isMainItem
      ? `${itemA.name} (+${itemB.enchants.map((e) => e.name).join(', ')})`
      : `Combined Book (${itemA.enchants.length + itemB.enchants.length} Enchants)`;

    steps.push({
      step: stepNum++,
      target: itemA.name,
      sacrifice: itemB.name,
      result: resultName,
      levelCost: stepCost,
      tooExpensive,
    });

    const newItem: IntermediateItem = {
      name: resultName,
      penalty: Math.max(itemA.penalty, itemB.penalty) + 1,
      enchants: [...itemA.enchants, ...itemB.enchants],
      isMainItem: itemA.isMainItem || itemB.isMainItem,
    };

    // Remove old items and add new
    items.splice(bestB, 1);
    items.splice(bestA, 1);
    items.push(newItem);
  }

  return { steps, totalLevels, isTooExpensive };
}

export default function EnchantOptimizerPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [itemType, setItemType] = useState<string>('sword');
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'sharpness',
    'unbreaking',
    'mending',
    'looting',
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const availableEnchants = useMemo(() => ALL_ENCHANTMENTS[itemType] || [], [itemType]);

  const handleToggleEnchant = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      const toAdd = availableEnchants.find((e) => e.id === id);
      if (!toAdd) return;

      // Deselect incompatible enchants
      let next = [...selectedIds];
      if (toAdd.incompatibleWith) {
        next = next.filter((currentId) => !toAdd.incompatibleWith?.includes(currentId));
      }
      next.push(id);
      setSelectedIds(next);
    }
  };

  const selectedEnchantments = useMemo(() => {
    return availableEnchants.filter((e) => selectedIds.includes(e.id));
  }, [availableEnchants, selectedIds]);

  const { steps, totalLevels, isTooExpensive } = useMemo(() => {
    const itemNames: Record<string, string> = {
      sword: 'Diamond / Netherite Sword',
      pickaxe: 'Diamond / Netherite Pickaxe',
      bow: 'Bow',
      boots: 'Diamond / Netherite Boots',
      helmet: 'Diamond / Netherite Helmet',
    };
    return solveOptimalAnvilOrder(itemNames[itemType] || 'Gear Item', selectedEnchantments);
  }, [itemType, selectedEnchantments]);

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
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Anvil &amp; Enchantment Optimizer</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">auto_fix_high</span>
            Calculators &amp; Games
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Anvil &amp; Enchantment Optimizer
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Calculate the exact cheapest anvil combining order to bypass prior work penalties and prevent the dreaded &ldquo;Too Expensive!&rdquo; (&gt;39 Levels) survival cap.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Item Selector & Enchants Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-4">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">shield</span>
                Select Gear Type
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {[
                  { id: 'sword', label: 'Sword', icon: 'colorize' },
                  { id: 'pickaxe', label: 'Pickaxe', icon: 'construction' },
                  { id: 'bow', label: 'Bow', icon: 'adjust' },
                  { id: 'boots', label: 'Boots', icon: 'airline_seat_legroom_extra' },
                  { id: 'helmet', label: 'Helmet', icon: 'face' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setItemType(item.id);
                      setSelectedIds(
                        (ALL_ENCHANTMENTS[item.id] || []).slice(0, 3).map((e) => e.id)
                      );
                    }}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      itemType === item.id
                        ? 'bg-[#FBECE6] dark:bg-[#38231C] border-[#8A4228] dark:border-[#E07A5F] text-[#8A4228] dark:text-[#E07A5F]'
                        : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Enchantments Checklist */}
              <div className="pt-3 border-t border-[#E2DDD8] dark:border-[#3A2D28] space-y-2">
                <label className="block text-xs font-bold text-[#1A1210] dark:text-[#F8F4F0]">
                  Desired Enchantments ({selectedIds.length} Selected)
                </label>

                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {availableEnchants.map((e) => {
                    const isChecked = selectedIds.includes(e.id);
                    return (
                      <label
                        key={e.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                          isChecked
                            ? 'bg-[#FBECE6]/50 dark:bg-[#38231C]/50 border-[#8A4228] dark:border-[#E07A5F] font-semibold text-[#8A4228] dark:text-[#E07A5F]'
                            : 'bg-[#F7F6F4] dark:bg-[#15100E] border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleEnchant(e.id)}
                            className="accent-[#8A4228] dark:accent-[#E07A5F] w-4 h-4 rounded"
                          />
                          <span>{e.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-[#918A83]">
                          Tier {e.maxLevel}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results: Optimized Path */}
          <div className="lg:col-span-7 space-y-6">
            {/* Summary Banner */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#68615A] dark:text-[#A8A19B]">Optimized Total Cost</div>
                  <div className="text-3xl font-headline font-bold text-[#8A4228] dark:text-[#E07A5F]">
                    {totalLevels} Levels
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isTooExpensive ? (
                    <div className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      Too Expensive!
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      100% Survival Safe (&lt;39)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step-by-Step Combining Order */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">format_list_numbered</span>
                  Step-by-Step Anvil Recipe
                </h3>
                <span className="text-xs text-[#918A83]">{steps.length} Anvil Operations</span>
              </div>

              {steps.length > 0 ? (
                <div className="space-y-3">
                  {steps.map((s) => (
                    <div
                      key={s.step}
                      className="p-3.5 rounded-xl border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {s.step}
                        </span>
                        <div>
                          <div className="font-semibold text-sm mb-0.5 flex items-center flex-wrap gap-1">
                            <span className="font-mono text-[#8A4228] dark:text-[#E07A5F]">{s.target}</span>
                            <span className="text-[#918A83]">+</span>
                            <span className="font-mono">{s.sacrifice}</span>
                          </div>
                          <div className="text-[11px] text-[#68615A] dark:text-[#A8A19B]">
                            Output: {s.result}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
                        <span className="font-mono font-bold bg-white dark:bg-[#201815] px-2.5 py-1 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28]">
                          {s.levelCost} Levels
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#68615A] dark:text-[#A8A19B]">
                  Select at least 1 enchantment to calculate anvil path.
                </div>
              )}

              <div className="pt-3 border-t border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] text-[#918A83]">
                Tip: Follow this exact pairing order. Combining books together first before attaching to your gear avoids exponential prior work penalty compounding!
              </div>
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
