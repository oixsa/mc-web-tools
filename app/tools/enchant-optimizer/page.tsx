'use client';

import { useMemo, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';

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
    let bestA = 0;
    let bestB = 1;
    let lowestCost = Infinity;

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (i === j) continue;

        const target = items[i];
        const sacrifice = items[j];

        // Books only before main item where possible
        if (target.isMainItem && items.length > 2 && !sacrifice.isMainItem) {
          continue;
        }

        // Calculate anvil costs
        const targetPenalty = (1 << target.penalty) - 1;
        const sacrificePenalty = (1 << sacrifice.penalty) - 1;
        const penaltyCost = targetPenalty + sacrificePenalty;

        let enchantCost = 0;
        for (const e of sacrifice.enchants) {
          const mult = target.isMainItem ? e.itemMultiplier : 1;
          enchantCost += e.maxLevel * mult;
        }

        const opCost = penaltyCost + enchantCost;
        if (opCost < lowestCost) {
          lowestCost = opCost;
          bestA = i;
          bestB = j;
        }
      }
    }

    const target = items[bestA];
    const sacrifice = items[bestB];
    const stepCost = lowestCost;

    if (stepCost >= 40) {
      isTooExpensive = true;
    }
    totalLevels += stepCost;

    const resultName = target.isMainItem
      ? target.name
      : `Combined Book (${[...target.enchants, ...sacrifice.enchants].map((e) => e.name).join(', ')})`;

    steps.push({
      step: stepNum++,
      target: target.name,
      sacrifice: sacrifice.name,
      result: resultName,
      levelCost: stepCost,
      tooExpensive: stepCost >= 40,
    });

    const newItem: IntermediateItem = {
      name: resultName,
      penalty: Math.max(target.penalty, sacrifice.penalty) + 1,
      enchants: [...target.enchants, ...sacrifice.enchants],
      isMainItem: target.isMainItem,
    };

    if (bestA > bestB) {
      items.splice(bestA, 1);
      items.splice(bestB, 1);
    } else {
      items.splice(bestB, 1);
      items.splice(bestA, 1);
    }
    items.push(newItem);
  }

  return { steps, totalLevels, isTooExpensive };
}

export default function EnchantOptimizerPage() {
  const [itemType, setItemType] = useState<string>('sword');
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'sharpness',
    'unbreaking',
    'mending',
    'looting',
  ]);
  const { copy, toastMessage } = useClipboard();

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

  const handleCopyRecipe = () => {
    if (steps.length === 0) return;
    const text = steps.map((s) => `Step ${s.step}: ${s.target} + ${s.sacrifice} -> ${s.result} (${s.levelCost} Levels)`).join('\n') + `\nTotal: ${totalLevels} Levels`;
    copy(text, 'Anvil recipe copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Anvil & Enchantment Optimizer"
        description="Calculate the exact cheapest anvil combining order to bypass prior work penalties and prevent the dreaded 'Too Expensive!' (>39 Levels) survival cap."
        badge="Calculators & Games"
        icon="auto_fix_high"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Item Selector & Enchants Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs space-y-4">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">shield</span>
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
                      ? 'bg-[var(--md-sys-color-primary-container)] border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary-container)] font-bold'
                      : 'border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Enchantments Checklist */}
            <div className="pt-3 border-t border-[var(--md-sys-color-outline-variant)] space-y-2">
              <label className="block text-xs font-bold text-[var(--md-sys-color-on-surface)]">
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
                          ? 'bg-[var(--md-sys-color-primary-container)]/40 border-[var(--md-sys-color-primary)] font-semibold text-[var(--md-sys-color-primary)]'
                          : 'bg-[var(--md-sys-color-surface-container-lowest)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-low)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleEnchant(e.id)}
                          className="accent-[var(--md-sys-color-primary)] w-4 h-4 rounded"
                        />
                        <span>{e.name}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
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
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[var(--md-sys-color-on-surface-variant)]">Optimized Total Cost</div>
                <div className="text-3xl font-headline font-bold text-[var(--md-sys-color-primary)]">
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
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
                <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">format_list_numbered</span>
                Step-by-Step Anvil Recipe
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--md-sys-color-on-surface-variant)]">{steps.length} Operations</span>
                {steps.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCopyRecipe}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] transition-colors border border-[var(--md-sys-color-outline-variant)]"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    Copy Recipe
                  </button>
                )}
              </div>
            </div>

            {steps.length > 0 ? (
              <div className="space-y-3">
                {steps.map((s) => (
                  <div
                    key={s.step}
                    className="p-3.5 rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {s.step}
                      </span>
                      <div>
                        <div className="font-semibold text-sm mb-0.5 flex items-center flex-wrap gap-1">
                          <span className="font-mono text-[var(--md-sys-color-primary)]">{s.target}</span>
                          <span className="text-[var(--md-sys-color-on-surface-variant)]">+</span>
                          <span className="font-mono text-[var(--md-sys-color-on-surface)]">{s.sacrifice}</span>
                        </div>
                        <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
                          Output: {s.result}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
                      <span className="font-mono font-bold bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] px-2.5 py-1 rounded-lg border border-[var(--md-sys-color-outline-variant)]">
                        {s.levelCost} Levels
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[var(--md-sys-color-on-surface-variant)]">
                Select at least 1 enchantment to calculate anvil path.
              </div>
            )}

            <div className="pt-3 border-t border-[var(--md-sys-color-outline-variant)] text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
              Tip: Follow this exact pairing order. Combining books together first before attaching to your gear avoids exponential prior work penalty compounding!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
