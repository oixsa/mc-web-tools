'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { QuickLauncherModal } from '@/app/components/QuickLauncherModal';
import { useTheme } from '@/app/hooks/useTheme';

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

const MINECRAFT_COLORS = [
  { label: 'White', value: 'white', hex: '#FFFFFF' },
  { label: 'Yellow', value: 'yellow', hex: '#FFFF55' },
  { label: 'Gold', value: 'gold', hex: '#FFAA00' },
  { label: 'Red', value: 'red', hex: '#FF5555' },
  { label: 'Dark Red', value: 'dark_red', hex: '#AA0000' },
  { label: 'Aqua', value: 'aqua', hex: '#55FFFF' },
  { label: 'Dark Aqua', value: 'dark_aqua', hex: '#00AAAA' },
  { label: 'Blue', value: 'blue', hex: '#5555FF' },
  { label: 'Dark Blue', value: 'dark_blue', hex: '#0000AA' },
  { label: 'Light Purple', value: 'light_purple', hex: '#FF55FF' },
  { label: 'Dark Purple', value: 'dark_purple', hex: '#AA00AA' },
  { label: 'Green', value: 'green', hex: '#55FF55' },
  { label: 'Dark Green', value: 'dark_green', hex: '#00AA00' },
  { label: 'Gray', value: 'gray', hex: '#AAAAAA' },
  { label: 'Dark Gray', value: 'dark_gray', hex: '#555555' },
  { label: 'Black', value: 'black', hex: '#000000' },
];

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
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

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
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label}!`);
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
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Tellraw &amp; JSON Text Builder</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">chat</span>
            Command Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-2">
            Tellraw &amp; JSON Text Builder
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl">
            Design interactive Minecraft server messages with colors, clickable links, command executions, and hover tooltips for <code>/tellraw</code> and <code>/title</code>.
          </p>
        </div>

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
              const col = MINECRAFT_COLORS.find((c) => c.value === s.color)?.hex || s.color || '#FFFFFF';
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
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">segment</span>
                  Message Segments
                </h2>
                <button
                  type="button"
                  onClick={addSegment}
                  className="px-2.5 py-1 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-bold hover:bg-[#72341D] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Segment
                </button>
              </div>

              {/* Target Selector */}
              <div>
                <label className="block text-xs font-semibold mb-1">Target Selector</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['@a', '@p', '@s', '@r'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTarget(t)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                        target === t
                          ? 'bg-[#FBECE6] dark:bg-[#38231C] border-[#8A4228] dark:border-[#E07A5F] text-[#8A4228] dark:text-[#E07A5F]'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
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
                          ? 'bg-[#FBECE6]/60 dark:bg-[#38231C]/60 border-[#8A4228] dark:border-[#E07A5F] shadow-xs'
                          : 'bg-[#F7F6F4] dark:bg-[#15100E] border-[#E2DDD8] dark:border-[#3A2D28] hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-[#918A83]">#{idx + 1}</span>
                        <div className="truncate font-mono text-xs">
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
                            className="p-1 hover:text-red-500 transition-colors"
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
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs">
              <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#68615A] dark:text-[#A8A19B] mb-3">
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
                    className="w-full text-left p-2.5 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] text-xs font-semibold hover:border-[#8A4228] dark:hover:border-[#E07A5F] transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Segment Properties Editor */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
              <h2 className="font-headline font-bold text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">edit</span>
                Edit Selected Segment
              </h2>

              {/* Text Input */}
              <div>
                <label className="block text-xs font-semibold mb-1">Text String</label>
                <input
                  type="text"
                  value={activeSegment.text}
                  onChange={(e) => updateActiveSegment({ text: e.target.value })}
                  placeholder="Enter message text..."
                  className="w-full h-10 px-3 rounded-xl border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] text-sm focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F]"
                />
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">Color</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {MINECRAFT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => updateActiveSegment({ color: c.value })}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                        activeSegment.color === c.value
                          ? 'border-[#8A4228] dark:border-[#E07A5F] ring-2 ring-amber-500/40'
                          : 'border-[#E2DDD8] dark:border-[#3A2D28]'
                      }`}
                      title={c.label}
                    >
                      <span className="w-4 h-4 rounded-xs" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Styles */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">Text Formats</label>
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
                            ? 'bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] border-transparent'
                            : 'border-[#E2DDD8] dark:border-[#3A2D28] text-[#68615A] dark:text-[#A8A19B]'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Click Event */}
              <div className="pt-2 border-t border-[#E2DDD8] dark:border-[#3A2D28] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold">Click Event (Optional)</label>
                  <select
                    value={activeSegment.clickAction}
                    onChange={(e) =>
                      updateActiveSegment({
                        clickAction: e.target.value as TextSegment['clickAction'],
                      })
                    }
                    className="h-8 px-2 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] text-xs font-mono"
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
                    className="w-full h-9 px-3 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] text-xs font-mono"
                  />
                )}
              </div>

              {/* Hover Event */}
              <div className="pt-2 border-t border-[#E2DDD8] dark:border-[#3A2D28] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold">Hover Tooltip (Optional)</label>
                  <select
                    value={activeSegment.hoverAction}
                    onChange={(e) =>
                      updateActiveSegment({
                        hoverAction: e.target.value as TextSegment['hoverAction'],
                      })
                    }
                    className="h-8 px-2 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] text-xs font-mono"
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
                    className="w-full h-9 px-3 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] bg-[#F7F6F4] dark:bg-[#15100E] text-xs"
                  />
                )}
              </div>
            </div>

            {/* Commands Output Card */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 shadow-2xs space-y-4">
              <h3 className="font-headline font-bold text-sm">Generated In-Game Commands</h3>

              {/* /tellraw */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold">/tellraw Command</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(tellrawCommand, '/tellraw command')}
                    className="text-[#8A4228] dark:text-[#E07A5F] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    Copy
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all">
                  {tellrawCommand}
                </pre>
              </div>

              {/* /title actionbar */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold">/title Actionbar Command</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(actionbarCommand, 'actionbar command')}
                    className="text-[#8A4228] dark:text-[#E07A5F] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    Copy
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all select-all">
                  {actionbarCommand}
                </pre>
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
