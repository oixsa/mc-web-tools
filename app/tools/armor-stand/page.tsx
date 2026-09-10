'use client';

import { useMemo, useState } from 'react';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';

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
  sitting: {
    head: [0, 0, 0],
    body: [0, 0, 0],
    leftArm: [-20, 0, 0],
    rightArm: [-20, 0, 0],
    leftLeg: [-90, 20, 0],
    rightLeg: [-90, -20, 0],
  },
  zombie: {
    head: [0, 0, 0],
    body: [0, 0, 0],
    leftArm: [-90, 0, 0],
    rightArm: [-90, 0, 0],
    leftLeg: [15, 0, 0],
    rightLeg: [-15, 0, 0],
  },
};

export default function ArmorStandPage() {
  const [pose, setPose] = useState<StandPose>(DEFAULT_POSE);
  const [showArms, setShowArms] = useState(true);
  const [noBasePlate, setNoBasePlate] = useState(true);
  const [isSmall, setIsSmall] = useState(false);
  const [isInvisible, setIsInvisible] = useState(false);
  const [noGravity, setNoGravity] = useState(false);
  const [customName, setCustomName] = useState('');
  const { copy, toastMessage, showToast } = useClipboard();

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

  const handleCopyCommand = () => {
    copy(summonCommand, 'Copied /summon command!');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Armor Stand Pose Visualizer"
        description="Pose Minecraft armor stands with real-time limb rotation controls, NBT flags (arms, no base, invisible), and generate ready-to-paste /summon commands."
        badge="Utilities & Poses"
        icon="accessibility_new"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Presets & Toggles */}
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs space-y-4">
            <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
              <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">tune</span>
              Preset Poses
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {Object.keys(PRESET_POSES).map((pKey) => (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => {
                    setPose(PRESET_POSES[pKey]);
                    showToast(`Applied "${pKey}" pose!`);
                  }}
                  className="py-2 px-2 rounded-lg border border-[var(--md-sys-color-outline-variant)] text-xs font-semibold capitalize hover:border-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-surface)] transition-colors bg-[var(--md-sys-color-surface-container-lowest)]"
                >
                  {pKey}
                </button>
              ))}
            </div>

            {/* NBT Toggles */}
            <div className="pt-3 border-t border-[var(--md-sys-color-outline-variant)] space-y-2">
              <label className="block text-xs font-bold text-[var(--md-sys-color-on-surface)]">
                Armor Stand Attributes
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[var(--md-sys-color-on-surface)]">
                  <input
                    type="checkbox"
                    checked={showArms}
                    onChange={(e) => setShowArms(e.target.checked)}
                    className="accent-[var(--md-sys-color-primary)] w-4 h-4 rounded"
                  />
                  <span>Show Arms</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[var(--md-sys-color-on-surface)]">
                  <input
                    type="checkbox"
                    checked={noBasePlate}
                    onChange={(e) => setNoBasePlate(e.target.checked)}
                    className="accent-[var(--md-sys-color-primary)] w-4 h-4 rounded"
                  />
                  <span>No Base Plate</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[var(--md-sys-color-on-surface)]">
                  <input
                    type="checkbox"
                    checked={isSmall}
                    onChange={(e) => setIsSmall(e.target.checked)}
                    className="accent-[var(--md-sys-color-primary)] w-4 h-4 rounded"
                  />
                  <span>Small (Baby)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[var(--md-sys-color-on-surface)]">
                  <input
                    type="checkbox"
                    checked={isInvisible}
                    onChange={(e) => setIsInvisible(e.target.checked)}
                    className="accent-[var(--md-sys-color-primary)] w-4 h-4 rounded"
                  />
                  <span>Invisible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[var(--md-sys-color-on-surface)]">
                  <input
                    type="checkbox"
                    checked={noGravity}
                    onChange={(e) => setNoGravity(e.target.checked)}
                    className="accent-[var(--md-sys-color-primary)] w-4 h-4 rounded"
                  />
                  <span>No Gravity (Float)</span>
                </label>
              </div>
            </div>

            {/* Custom Name */}
            <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)]">
              <label className="block text-xs font-semibold mb-1 text-[var(--md-sys-color-on-surface)]">
                Custom Name Tag (Optional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Guard Captain"
                className="w-full h-9 px-3 rounded-lg border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] text-xs font-mono text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:border-[var(--md-sys-color-primary)]"
              />
            </div>
          </div>

          {/* Rotation Sliders */}
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-[var(--md-sys-color-on-surface)]">
              Limb Rotations (Pitch / Yaw / Roll)
            </h3>

            {[
              { key: 'rightArm' as const, label: 'Right Arm' },
              { key: 'leftArm' as const, label: 'Left Arm' },
              { key: 'head' as const, label: 'Head' },
              { key: 'body' as const, label: 'Body' },
              { key: 'rightLeg' as const, label: 'Right Leg' },
              { key: 'leftLeg' as const, label: 'Left Leg' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1.5 pb-2 border-b border-[var(--md-sys-color-outline-variant)]/60 last:border-b-0">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--md-sys-color-on-surface)]">{label}</span>
                  <span className="font-mono text-[11px] text-[var(--md-sys-color-primary)] font-bold">
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
                      <span className="text-[var(--md-sys-color-on-surface-variant)] block truncate">{name}</span>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={pose[key][axis]}
                        onChange={(e) => updateAngle(key, axis, parseInt(e.target.value) || 0)}
                        className="w-full accent-[var(--md-sys-color-primary)]"
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
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-6 shadow-2xs flex flex-col items-center justify-center min-h-[380px] relative">
            <div className="absolute top-4 left-4 text-xs font-bold text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--md-sys-color-primary)]" />
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
                <rect x="-20" y="0" width="40" height="50" rx="4" fill="var(--md-sys-color-primary)" stroke="var(--md-sys-color-outline)" strokeWidth="2" />
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
          <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-[var(--md-sys-color-on-surface)]">
                Minecraft /summon Command
              </h3>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="text-xs font-semibold text-[var(--md-sys-color-primary)] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy Command
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-lowest)] font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all border border-[var(--md-sys-color-outline-variant)]/60 text-[var(--md-sys-color-on-surface)]">
              {summonCommand}
            </pre>

            <button
              type="button"
              onClick={handleCopyCommand}
              className="w-full py-2.5 rounded-xl bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              Copy /summon Command
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
