'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ToolHeader } from '@/app/components/ToolHeader';
import { Toast } from '@/app/components/Toast';
import { useClipboard } from '@/app/hooks/useClipboard';
import { MINECRAFT_COLORS } from '@/app/lib/minecraft-colors';

interface TextSegment {
  id: string;
  text: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underlined: boolean;
  strikethrough: boolean;
  obfuscated: boolean;
  clickAction: 'none' | 'run_command' | 'suggest_command' | 'open_url' | 'copy_to_clipboard';
  clickValue: string;
  hoverAction: 'none' | 'show_text';
  hoverValue: string;
}

const PRESETS = [
  {
    name: 'Server Welcome & Discord',
    target: '@a',
    segments: [
      {
        id: '1',
        text: '★ Welcome to ',
        color: 'gold',
        bold: true,
        italic: false,
        underlined: false,
        strikethrough: false,
        obfuscated: false,
        clickAction: 'none' as const,
        clickValue: '',
        hoverAction: 'none' as const,
        hoverValue: '',
      },
      {
        id: '2',
        text: 'KITA NETWORK! ',
        color: 'yellow',
        bold: true,
        italic: false,
        underlined: false,
        strikethrough: false,
        obfuscated: false,
        clickAction: 'none' as const,
        clickValue: '',
        hoverAction: 'none' as const,
        hoverValue: '',
      },
      {
        id: '3',
        text: '[Click to Join Discord]',
        color: 'aqua',
        bold: false,
        italic: false,
        underlined: true,
        strikethrough: false,
        obfuscated: false,
        clickAction: 'open_url' as const,
        clickValue: 'https://discord.gg/minecraft',
        hoverAction: 'show_text' as const,
        hoverValue: 'Opens community discord server',
      },
    ],
  },
  {
    name: 'Daily Reward Claim',
    target: '@p',
    segments: [
      {
        id: '1',
        text: '🎁 Daily Reward Ready! ',
        color: 'green',
        bold: true,
        italic: false,
        underlined: false,
        strikethrough: false,
        obfuscated: false,
        clickAction: 'none' as const,
        clickValue: '',
        hoverAction: 'none' as const,
        hoverValue: '',
      },
      {
        id: '2',
        text: '[CLAIM NOW]',
        color: 'gold',
        bold: true,
        italic: false,
        underlined: false,
        strikethrough: false,
        obfuscated: false,
        clickAction: 'run_command' as const,
        clickValue: '/reward claim daily',
        hoverAction: 'show_text' as const,
        hoverValue: 'Click to execute /reward claim daily',
      },
    ],
  },
];

export default function TellrawEditorPage() {
  // States
  const [target, setTarget] = useState<string>('@a');
  const [segments, setSegments] = useState<TextSegment[]>([
    {
      id: 'seg-1',
      text: 'Welcome to the server! ',
      color: 'gold',
      bold: true,
      italic: false,
      underlined: false,
      strikethrough: false,
      obfuscated: false,
      clickAction: 'none',
      clickValue: '',
      hoverAction: 'none',
      hoverValue: '',
    },
    {
      id: 'seg-2',
      text: '[Click for Website]',
      color: 'aqua',
      bold: false,
      italic: false,
      underlined: true,
      strikethrough: false,
      obfuscated: false,
      clickAction: 'open_url',
      clickValue: 'https://kitatools.com',
      hoverAction: 'show_text',
      hoverValue: 'Visit our official website',
    },
  ]);

  const [activeSegId, setActiveSegId] = useState<string>(segments[0].id);
  const { copy, toastMessage, showToast } = useClipboard();

  const activeSegment = useMemo(
    () => segments.find((s) => s.id === activeSegId) || segments[0],
    [segments, activeSegId]
  );

  const updateActiveSegment = (patch: Partial<TextSegment>) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === activeSegment.id ? { ...s, ...patch } : s))
    );
  };

  const addSegment = () => {
    const newId = `seg-${Date.now()}`;
    const newSeg: TextSegment = {
      id: newId,
      text: ' new text',
      color: 'white',
      bold: false,
      italic: false,
      underlined: false,
      strikethrough: false,
      obfuscated: false,
      clickAction: 'none',
      clickValue: '',
      hoverAction: 'none',
      hoverValue: '',
    };
    setSegments((prev) => [...prev, newSeg]);
    setActiveSegId(newId);
  };

  const removeSegment = (id: string) => {
    if (segments.length <= 1) return;
    setSegments((prev) => prev.filter((s) => s.id !== id));
    if (activeSegId === id) {
      const remaining = segments.filter((s) => s.id !== id);
      setActiveSegId(remaining[0]?.id || '');
    }
  };

  // Compile JSON Object
  const jsonPayload = useMemo(() => {
    const extra = segments.map((s) => {
      const obj: Record<string, unknown> = {
        text: s.text,
      };
      if (s.color && s.color !== 'white') obj.color = s.color;
      if (s.bold) obj.bold = true;
      if (s.italic) obj.italic = true;
      if (s.underlined) obj.underlined = true;
      if (s.strikethrough) obj.strikethrough = true;
      if (s.obfuscated) obj.obfuscated = true;

      if (s.clickAction !== 'none' && s.clickValue) {
        obj.clickEvent = {
          action: s.clickAction,
          value: s.clickValue,
        };
      }

      if (s.hoverAction !== 'none' && s.hoverValue) {
        obj.hoverEvent = {
          action: s.hoverAction,
          contents: s.hoverValue,
        };
      }

      return obj;
    });

    return ['""', ...extra];
  }, [segments]);

  // Generate /tellraw command with proper escaping
  const tellrawCommand = useMemo(() => {
    const jsonStr = JSON.stringify(jsonPayload);
    return `/tellraw ${target} ${jsonStr}`;
  }, [target, jsonPayload]);

  const actionbarCommand = useMemo(() => {
    const jsonStr = JSON.stringify(jsonPayload);
    return `/title ${target} actionbar ${jsonStr}`;
  }, [target, jsonPayload]);

  const copyToClipboard = (text: string, label: string) => {
    copy(text, `Copied ${label}!`);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Toast message={toastMessage} />

      <ToolHeader
        title="Tellraw & JSON Text Builder"
        description="Design interactive Minecraft server messages with colors, clickable links, command executions, and hover tooltips for /tellraw and /title."
        badge="Creator Tool"
        icon="chat"
      />

      {/* Chat Preview Viewport */}
      <div className="mb-8 bg-black/80 border-2 border-black/90 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden font-mono text-sm select-none">
        <div className="text-[11px] font-bold text-[#918A83] uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#55FF55]" />
            In-Game Minecraft Chat Preview
          </span>
          <span>Scale: 100%</span>
        </div>

        <div className="bg-black/60 rounded-lg p-3 min-h-[50px] flex items-center flex-wrap gap-x-0.5 leading-relaxed">
          {segments.map((s) => {
            const col = MINECRAFT_COLORS.find((c) => c.jsonName === s.color)?.hex || s.color || '#FFFFFF';
              return (
                <span
                  key={s.id}
                  title={s.hoverAction === 'show_text' ? `[Hover Tooltip]: ${s.hoverValue}` : undefined}
                  className={`inline-block relative cursor-pointer group ${
                    s.id === activeSegment.id ? 'ring-1 ring-amber-400/80 rounded-xs' : ''
                  }`}
                  onClick={() => setActiveSegId(s.id)}
                  style={{
                    color: col,
                    fontWeight: s.bold ? 'bold' : 'normal',
                    fontStyle: s.italic ? 'italic' : 'normal',
                    textDecoration: `${s.underlined ? 'underline' : ''} ${s.strikethrough ? 'line-through' : ''}`.trim() || 'none',
                    textShadow: '2px 2px 0px #151515',
                  }}
                >
                  {s.text || '<empty>'}
                  {s.hoverAction === 'show_text' && s.hoverValue && (
                    <span className="hidden group-hover:block absolute bottom-full left-0 mb-1 z-30 px-2 py-1 bg-black/90 text-white border border-gray-600 rounded text-xs whitespace-nowrap shadow-lg">
                      {s.hoverValue}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Segments List & Presets */}
          <div className="lg:col-span-5 space-y-6">
            {/* Segments Manager */}
            <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
                  <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">segment</span>
                  Message Segments
                </h2>
                <button
                  type="button"
                  onClick={addSegment}
                  className="px-2.5 py-1 rounded-lg bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Segment
                </button>
              </div>

              {/* Target Selector */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--md-sys-color-on-surface)]">Target Selector</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['@a', '@p', '@s', '@r'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTarget(t)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                        target === t
                          ? 'bg-[var(--md-sys-color-primary-container)] border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary-container)]'
                          : 'border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Segment Cards */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {segments.map((seg, idx) => {
                  const isActive = seg.id === activeSegment.id;
                  return (
                    <div
                      key={seg.id}
                      onClick={() => setActiveSegId(seg.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-[var(--md-sys-color-primary-container)]/40 border-[var(--md-sys-color-primary)] shadow-xs'
                          : 'bg-[var(--md-sys-color-surface-container-lowest)] border-[var(--md-sys-color-outline-variant)] hover:border-[var(--md-sys-color-outline)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-[var(--md-sys-color-on-surface-variant)]">#{idx + 1}</span>
                        <div className="truncate font-mono text-xs text-[var(--md-sys-color-on-surface)]">
                          {seg.text ? `"${seg.text}"` : '<empty>'}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className="w-3 h-3 rounded-xs shadow-xs border border-black/20"
                          style={{
                            backgroundColor:
                              MINECRAFT_COLORS.find((c) => c.value === seg.color)?.hex || '#FFFFFF',
                          }}
                        />
                        {segments.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSegment(seg.id);
                            }}
                            className="p-1 hover:text-[var(--md-sys-color-error)] transition-colors"
                            title="Delete segment"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs">
              <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)] mb-3">
                Load Preset Templates
              </h3>
              <div className="space-y-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setTarget(p.target);
                      setSegments(
                        p.segments.map((s, idx) => ({ ...s, id: `preset-${idx}-${Date.now()}` }))
                      );
                      triggerToast(`Loaded "${p.name}" template!`);
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-[var(--md-sys-color-outline-variant)] text-xs font-semibold hover:border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-surface)] transition-colors bg-[var(--md-sys-color-surface-container-lowest)]"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Segment Properties Editor */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
              <h2 className="font-headline font-bold text-base flex items-center gap-2 text-[var(--md-sys-color-on-surface)]">
                <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-[20px]">edit</span>
                Edit Selected Segment
              </h2>

              {/* Text Input */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--md-sys-color-on-surface)]">Text String</label>
                <input
                  type="text"
                  value={activeSegment.text}
                  onChange={(e) => updateActiveSegment({ text: e.target.value })}
                  placeholder="Enter message text..."
                  className="w-full h-10 px-3 rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] text-sm text-[var(--md-sys-color-on-surface)] focus:outline-none focus:border-[var(--md-sys-color-primary)]"
                />
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface)]">Color</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {MINECRAFT_COLORS.map((c) => (
                    <button
                      key={c.jsonName}
                      type="button"
                      onClick={() => updateActiveSegment({ color: c.jsonName })}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        activeSegment.color === c.jsonName
                          ? 'border-[var(--md-sys-color-primary)] ring-2 ring-[var(--md-sys-color-primary)]/40'
                          : 'border-[var(--md-sys-color-outline-variant)]/40'
                      }`}
                      title={c.name}
                    >
                      <span className="w-4 h-4 rounded-xs" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Styles */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--md-sys-color-on-surface)]">Text Formats</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'bold', label: 'Bold (B)' },
                    { key: 'italic', label: 'Italic (I)' },
                    { key: 'underlined', label: 'Underline (U)' },
                    { key: 'strikethrough', label: 'Strike (S)' },
                    { key: 'obfuscated', label: 'Magic (K)' },
                  ].map((fmt) => {
                    const active = activeSegment[fmt.key as keyof TextSegment] as boolean;
                    return (
                      <button
                        key={fmt.key}
                        type="button"
                        onClick={() => updateActiveSegment({ [fmt.key]: !active })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-transparent'
                            : 'border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Click Event */}
              <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--md-sys-color-on-surface)]">Click Event (Optional)</label>
                  <select
                    value={activeSegment.clickAction}
                    onChange={(e) =>
                      updateActiveSegment({
                        clickAction: e.target.value as TextSegment['clickAction'],
                      })
                    }
                    className="h-8 px-2 rounded-lg border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] text-xs font-mono text-[var(--md-sys-color-on-surface)]"
                  >
                    <option value="none">None</option>
                    <option value="run_command">run_command</option>
                    <option value="suggest_command">suggest_command</option>
                    <option value="open_url">open_url</option>
                    <option value="copy_to_clipboard">copy_to_clipboard</option>
                  </select>
                </div>

                {activeSegment.clickAction !== 'none' && (
                  <input
                    type="text"
                    value={activeSegment.clickValue}
                    onChange={(e) => updateActiveSegment({ clickValue: e.target.value })}
                    placeholder={
                      activeSegment.clickAction === 'open_url'
                        ? 'https://example.com'
                        : '/say Hello world'
                    }
                    className="w-full h-9 px-3 rounded-lg border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] text-xs font-mono text-[var(--md-sys-color-on-surface)]"
                  />
                )}
              </div>

              {/* Hover Event */}
              <div className="pt-2 border-t border-[var(--md-sys-color-outline-variant)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--md-sys-color-on-surface)]">Hover Tooltip (Optional)</label>
                  <select
                    value={activeSegment.hoverAction}
                    onChange={(e) =>
                      updateActiveSegment({
                        hoverAction: e.target.value as TextSegment['hoverAction'],
                      })
                    }
                    className="h-8 px-2 rounded-lg border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] text-xs font-mono text-[var(--md-sys-color-on-surface)]"
                  >
                    <option value="none">None</option>
                    <option value="show_text">show_text</option>
                  </select>
                </div>

                {activeSegment.hoverAction !== 'none' && (
                  <input
                    type="text"
                    value={activeSegment.hoverValue}
                    onChange={(e) => updateActiveSegment({ hoverValue: e.target.value })}
                    placeholder="Enter tooltip text to show on hover..."
                    className="w-full h-9 px-3 rounded-lg border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-lowest)] text-xs text-[var(--md-sys-color-on-surface)]"
                  />
                )}
              </div>
            </div>

            {/* Commands Output Card */}
            <div className="bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="font-headline font-bold text-sm text-[var(--md-sys-color-on-surface)]">Generated In-Game Commands</h3>

              {/* /tellraw */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-[var(--md-sys-color-on-surface)]">/tellraw Command</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(tellrawCommand, '/tellraw command')}
                    className="text-[var(--md-sys-color-primary)] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    Copy
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-[var(--md-sys-color-surface-container-lowest)] font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all border border-[var(--md-sys-color-outline-variant)]/60 text-[var(--md-sys-color-on-surface)]">
                  {tellrawCommand}
                </pre>
              </div>

              {/* /title actionbar */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-[var(--md-sys-color-on-surface)]">/title Actionbar Command</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(actionbarCommand, 'actionbar command')}
                    className="text-[var(--md-sys-color-primary)] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    Copy
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-[var(--md-sys-color-surface-container-lowest)] font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all border border-[var(--md-sys-color-outline-variant)]/60 text-[var(--md-sys-color-on-surface)]">
                  {actionbarCommand}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
