'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { QuickLauncherModal } from '../../components/QuickLauncherModal';
import { useTheme } from '../../hooks/useTheme';
import { Tool } from '../../types/tools';

// --- Standard Minecraft Color Definitions ---
interface MinecraftColor {
  code: string;
  name: string;
  hex: string;
  shadowHex: string;
}

const MINECRAFT_COLORS: MinecraftColor[] = [
  { code: '0', name: 'Black', hex: '#000000', shadowHex: '#000000' },
  { code: '1', name: 'Dark Blue', hex: '#0000AA', shadowHex: '#00002A' },
  { code: '2', name: 'Dark Green', hex: '#00AA00', shadowHex: '#002A00' },
  { code: '3', name: 'Dark Aqua', hex: '#00AAAA', shadowHex: '#002A2A' },
  { code: '4', name: 'Dark Red', hex: '#AA0000', shadowHex: '#2A0000' },
  { code: '5', name: 'Dark Purple', hex: '#AA00AA', shadowHex: '#2A002A' },
  { code: '6', name: 'Gold', hex: '#FFAA00', shadowHex: '#2A2A00' },
  { code: '7', name: 'Gray', hex: '#AAAAAA', shadowHex: '#2A2A2A' },
  { code: '8', name: 'Dark Gray', hex: '#555555', shadowHex: '#151515' },
  { code: '9', name: 'Blue', hex: '#5555FF', shadowHex: '#15153F' },
  { code: 'a', name: 'Green', hex: '#55FF55', shadowHex: '#153F15' },
  { code: 'b', name: 'Aqua', hex: '#55FFFF', shadowHex: '#153F3F' },
  { code: 'c', name: 'Red', hex: '#FF5555', shadowHex: '#3F1515' },
  { code: 'd', name: 'Light Purple', hex: '#FF55FF', shadowHex: '#3F153F' },
  { code: 'e', name: 'Yellow', hex: '#FFFF55', shadowHex: '#3F3F15' },
  { code: 'f', name: 'White', hex: '#FFFFFF', shadowHex: '#3F3F3F' },
];

const FORMAT_CODES = [
  { code: 'l', name: 'Bold', label: 'B', style: 'font-bold' },
  { code: 'o', name: 'Italic', label: 'I', style: 'italic' },
  { code: 'n', name: 'Underline', label: 'U', style: 'underline' },
  { code: 'm', name: 'Strikethrough', label: 'S', style: 'line-through' },
  { code: 'k', name: 'Magic', label: '?', style: 'magic' },
  { code: 'r', name: 'Reset', label: '↺', style: 'reset' },
];

const POPULAR_SYMBOLS = ['★', '✦', '►', '➤', '»', '«', '⚔', '⛏', '⚡', '❤', '✔', '✖', '♦', '•', '|', '❖'];

interface Preset {
  name: string;
  line1: string;
  line2: string;
}

const PRESETS: Preset[] = [
  {
    name: 'RPG Survival SMP',
    line1: '&6&lKITA NETWORK &7[1.20 - 1.21.x] &r&a★ ONLINE',
    line2: '&e➤ &fCustom Dungeons &8| &bEconomy &8| &aQuests',
  },
  {
    name: 'Vanilla Crossplay',
    line1: '&b&lVANILLA CRAFT &8» &fJava & Bedrock Crossplay',
    line2: '&7Pure Vanilla Survival &8• &eNo Griefing &8• &aJoin Now!',
  },
  {
    name: 'Skyblock & Minigames',
    line1: '&d&lHYPER CLOUD &8| &eSeason 4 is LIVE! &c[NEW]',
    line2: '&fCustom Islands &7&l» &6BedWars &8• &aDuels &8• &bParkour',
  },
  {
    name: 'Hardcore / Anarchy',
    line1: '&4&lDOOM SMP &8[HARDCORE ANARCHY] &r&c☠ NO RULES',
    line2: '&7High Performance 1.21 &8• &4PVP Enabled &8• &fSurvive',
  },
];

export default function MotdEditorPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Editor states
  const [serverName, setServerName] = useState('A Minecraft Server');
  const [playerCount, setPlayerCount] = useState('42 / 100');
  const [line1, setLine1] = useState('&6&lKITA NETWORK &8[1.20 - 1.21.x] &r&a★ ONLINE');
  const [line2, setLine2] = useState('&e➤ &fCustom Dungeons &8| &bEconomy &8| &aQuests');
  const [activeLine, setActiveLine] = useState<1 | 2>(1);

  // Gradient generator states
  const [gradientText, setGradientText] = useState('KITA NETWORK');
  const [gradientStart, setGradientStart] = useState('#FFAA00');
  const [gradientEnd, setGradientEnd] = useState('#FF5555');

  // Copy toast state
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Obfuscated characters randomizer tick for preview
  const [randomTick, setRandomTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setRandomTick((t) => (t + 1) % 100);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  // Show toast notification
  const triggerToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => {
      setCopyToast(null);
    }, 2500);
  };

  // Insert code into current active line
  const insertCode = (codeStr: string) => {
    if (activeLine === 1) {
      const input = input1Ref.current;
      if (!input) {
        setLine1((prev) => prev + codeStr);
        return;
      }
      const start = input.selectionStart || line1.length;
      const end = input.selectionEnd || line1.length;
      const updated = line1.substring(0, start) + codeStr + line1.substring(end);
      setLine1(updated);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + codeStr.length, start + codeStr.length);
      }, 10);
    } else {
      const input = input2Ref.current;
      if (!input) {
        setLine2((prev) => prev + codeStr);
        return;
      }
      const start = input.selectionStart || line2.length;
      const end = input.selectionEnd || line2.length;
      const updated = line2.substring(0, start) + codeStr + line2.substring(end);
      setLine2(updated);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + codeStr.length, start + codeStr.length);
      }, 10);
    }
  };

  // Generate Hex Color Gradient between 2 RGB points
  const generateGradient = () => {
    if (!gradientText) return;
    const hexToRgb = (hex: string) => {
      const cleaned = hex.replace('#', '');
      return {
        r: parseInt(cleaned.substring(0, 2), 16) || 0,
        g: parseInt(cleaned.substring(2, 4), 16) || 0,
        b: parseInt(cleaned.substring(4, 6), 16) || 0,
      };
    };

    const c1 = hexToRgb(gradientStart);
    const c2 = hexToRgb(gradientEnd);
    const len = gradientText.length;
    let output = '';

    for (let i = 0; i < len; i++) {
      const ratio = len <= 1 ? 0 : i / (len - 1);
      const r = Math.round(c1.r + (c2.r - c1.r) * ratio)
        .toString(16)
        .padStart(2, '0');
      const g = Math.round(c1.g + (c2.g - c1.g) * ratio)
        .toString(16)
        .padStart(2, '0');
      const b = Math.round(c1.b + (c2.b - c1.b) * ratio)
        .toString(16)
        .padStart(2, '0');
      // Modern Minecraft hex format: &#RRGGBB
      output += `&#${r}${g}${b}${gradientText[i]}`;
    }

    insertCode(output);
    triggerToast('Gradient inserted into active line!');
  };

  // Center Line helper (pads leading spaces)
  const centerLine = (targetLine: 1 | 2) => {
    const raw = (targetLine === 1 ? line1 : line2).replace(/(&|§)[0-9a-fk-or]/gi, '').replace(/&#[0-9a-f]{6}/gi, '');
    const maxChars = 52;
    const diff = Math.max(0, Math.floor((maxChars - raw.length) / 2));
    const padding = ' '.repeat(diff);
    if (targetLine === 1) {
      setLine1(padding + line1.trimStart());
    } else {
      setLine2(padding + line2.trimStart());
    }
    triggerToast(`Line ${targetLine} centered!`);
  };

  // --- Parser for Minecraft Code to HTML with Obfuscation ---
  interface ParsedSpan {
    text: string;
    color: string;
    shadowColor: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    magic: boolean;
  }

  const parseMinecraftText = (rawText: string): ParsedSpan[] => {
    // Normalize § to &
    const normalized = rawText.replace(/§/g, '&');
    const spans: ParsedSpan[] = [];

    let currentColor = '#AAAAAA'; // default gray
    let currentShadow = '#2A2A2A';
    let isBold = false;
    let isItalic = false;
    let isUnderline = false;
    let isStrikethrough = false;
    let isMagic = false;

    let i = 0;
    while (i < normalized.length) {
      // Check for hex code: &#RRGGBB
      if (normalized[i] === '&' && normalized[i + 1] === '#' && i + 8 <= normalized.length) {
        const hex = normalized.substring(i + 2, i + 8);
        if (/^[0-9a-fA-F]{6}$/.test(hex)) {
          currentColor = `#${hex}`;
          currentShadow = '#151515';
          i += 8;
          continue;
        }
      }

      // Check for standard code: &x
      if (normalized[i] === '&' && i + 1 < normalized.length) {
        const code = normalized[i + 1].toLowerCase();
        const foundColor = MINECRAFT_COLORS.find((c) => c.code === code);
        if (foundColor) {
          currentColor = foundColor.hex;
          currentShadow = foundColor.shadowHex;
          // Color code resets formatting styles in vanilla MC
          isBold = false;
          isItalic = false;
          isUnderline = false;
          isStrikethrough = false;
          isMagic = false;
          i += 2;
          continue;
        }

        if (code === 'l') {
          isBold = true;
          i += 2;
          continue;
        }
        if (code === 'o') {
          isItalic = true;
          i += 2;
          continue;
        }
        if (code === 'n') {
          isUnderline = true;
          i += 2;
          continue;
        }
        if (code === 'm') {
          isStrikethrough = true;
          i += 2;
          continue;
        }
        if (code === 'k') {
          isMagic = true;
          i += 2;
          continue;
        }
        if (code === 'r') {
          currentColor = '#AAAAAA';
          currentShadow = '#2A2A2A';
          isBold = false;
          isItalic = false;
          isUnderline = false;
          isStrikethrough = false;
          isMagic = false;
          i += 2;
          continue;
        }
      }

      // Plain character
      let char = normalized[i];
      if (isMagic) {
        // Random characters for magic obfuscation
        const magicChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        char = magicChars[(char.charCodeAt(0) + randomTick) % magicChars.length];
      }

      spans.push({
        text: char,
        color: currentColor,
        shadowColor: currentShadow,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strikethrough: isStrikethrough,
        magic: isMagic,
      });
      i++;
    }

    return spans;
  };

  const parsedLine1 = useMemo(() => parseMinecraftText(line1), [line1, randomTick]);
  const parsedLine2 = useMemo(() => parseMinecraftText(line2), [line2, randomTick]);

  // Export conversions
  const exportServerProperties = () => {
    // Converts to unicode escapes \u00A7
    const convert = (str: string) => {
      let res = str.replace(/&([0-9a-fk-or])/gi, '\\u00A7$1');
      res = res.replace(/§([0-9a-fk-or])/gi, '\\u00A7$1');
      // Hex codes: &#RRGGBB -> \u00A7x\u00A7R\u00A7R...
      res = res.replace(/&#([0-9a-fA-F]{6})/g, (_, hex) => {
        return (
          '\\u00A7x' +
          hex
            .split('')
            .map((c: string) => `\\u00A7${c.toLowerCase()}`)
            .join('')
        );
      });
      return res;
    };
    return `motd=${convert(line1)}\\n${convert(line2)}`;
  };

  const exportSectionSigns = () => {
    return `${line1.replace(/&/g, '§')}\n${line2.replace(/&/g, '§')}`;
  };

  const exportAmpersands = () => {
    return `${line1.replace(/§/g, '&')}\n${line2.replace(/§/g, '&')}`;
  };

  const exportJsonFormat = () => {
    return JSON.stringify(
      {
        text: `${line1}\n${line2}`.replace(/(&|§)[0-9a-fk-or]/gi, ''),
        extra: [
          { text: line1.replace(/(&|§)[0-9a-fk-or]/gi, '') },
          { text: '\n' },
          { text: line2.replace(/(&|§)[0-9a-fk-or]/gi, '') },
        ],
      },
      null,
      2
    );
  };

  const exportYamlFormat = () => {
    const escapedL1 = line1.replace(/'/g, "''");
    const escapedL2 = line2.replace(/'/g, "''");
    return `# BungeeCord / Waterfall config.yml
listeners:
- host: 0.0.0.0:25565
  max_players: 100
  motd: '${escapedL1}\\n${escapedL2}'

# Spigot / Paper / CleanMOTD format
motd:
  line1: '${escapedL1}'
  line2: '${escapedL2}'
`;
  };

  const downloadYamlFile = () => {
    const content = exportYamlFormat();
    const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast('Downloaded config.yml!');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F4] dark:bg-[#15100E] text-[#1A1210] dark:text-[#F8F4F0] transition-colors duration-200">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Floating Toast Notification */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {copyToast}
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#68615A] dark:text-[#A8A19B] mb-6">
          <Link href="/" className="hover:text-[#8A4228] dark:hover:text-[#E07A5F] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Home
          </Link>
          <span>/</span>
          <span className="text-[#8A4228] dark:text-[#E07A5F] font-semibold">Server MOTD Generator</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBECE6] dark:bg-[#38231C] border border-[#E2DDD8] dark:border-[#3A2D28] text-[11px] font-bold text-[#8A4228] dark:text-[#E07A5F] mb-3 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px]">dns</span>
            Creator Tool
          </div>
          <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Minecraft Server{' '}
            <span className="text-[#8A4228] dark:text-[#E07A5F] underline decoration-[#8A4228]/25 dark:decoration-[#E07A5F]/35 decoration-wavy">
              MOTD Generator
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#68615A] dark:text-[#A8A19B] max-w-2xl leading-relaxed">
            Craft custom colored, formatted, and RGB gradient MOTDs for your Minecraft server. Live
            in-game multiplayer server list preview with 1-click export for <code>server.properties</code>, BungeeCord, and Paper.
          </p>
        </div>

        {/* ============================================================ */}
        {/* LIVE IN-GAME SERVER LIST PREVIEW WIDGET                       */}
        {/* ============================================================ */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68615A] dark:text-[#A8A19B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8A4228] dark:bg-[#E07A5F]" />
              Live In-Game Multiplayer Preview
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#918A83] hidden sm:inline">Minecraft 1.20 - 1.21 UI</span>
            </div>
          </div>

          {/* Authentic Minecraft Server Entry Viewport */}
          <div className="rounded-2xl p-4 sm:p-6 bg-[#0E0E0E] border-4 border-[#222222] shadow-2xl relative overflow-hidden font-mono">
            {/* Minecraft Dark Background Pixel Grid pattern */}
            <div className="flex items-start gap-4">
              {/* Server Icon (64x64) */}
              <div className="relative w-16 h-16 rounded-xs bg-[#1F1F1F] border-2 border-[#333333] flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Server Icon"
                  width={48}
                  height={48}
                  className="object-contain pixelated"
                />
                <span className="absolute bottom-0 right-0 bg-black/80 text-[9px] text-[#55FF55] px-1 font-mono">
                  64px
                </span>
              </div>

              {/* Server Info Details */}
              <div className="flex-1 min-w-0">
                {/* Title & Ping/Player Count Row */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#FFFFFF] text-sm sm:text-base font-bold tracking-wider truncate drop-shadow-[2px_2px_0_#2A2A2A]">
                    {serverName || 'A Minecraft Server'}
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    {/* Player Count */}
                    <span className="text-[#AAAAAA] drop-shadow-[2px_2px_0_#2A2A2A]">
                      {playerCount}
                    </span>
                    {/* 5-bar Green Ping Icon */}
                    <div className="flex items-end gap-0.5 h-3.5" title="Ping: 18ms">
                      <span className="w-1 h-1 bg-[#55FF55]" />
                      <span className="w-1 h-1.5 bg-[#55FF55]" />
                      <span className="w-1 h-2 bg-[#55FF55]" />
                      <span className="w-1 h-2.5 bg-[#55FF55]" />
                      <span className="w-1 h-3.5 bg-[#55FF55]" />
                    </div>
                  </div>
                </div>

                {/* MOTD 2-Line Render Box */}
                <div className="bg-black/50 rounded p-2.5 min-h-[58px] flex flex-col justify-center space-y-1 text-xs sm:text-sm leading-snug tracking-wider select-none font-mono">
                  {/* Line 1 */}
                  <div className="truncate flex items-center flex-wrap">
                    {parsedLine1.map((span, idx) => (
                      <span
                        key={`l1-${idx}`}
                        style={{
                          color: span.color,
                          textShadow: `2px 2px 0px ${span.shadowColor}`,
                          fontWeight: span.bold ? 'bold' : 'normal',
                          fontStyle: span.italic ? 'italic' : 'normal',
                          textDecoration: `${span.underline ? 'underline' : ''} ${span.strikethrough ? 'line-through' : ''}`.trim() || 'none',
                        }}
                      >
                        {span.text}
                      </span>
                    ))}
                  </div>

                  {/* Line 2 */}
                  <div className="truncate flex items-center flex-wrap">
                    {parsedLine2.map((span, idx) => (
                      <span
                        key={`l2-${idx}`}
                        style={{
                          color: span.color,
                          textShadow: `2px 2px 0px ${span.shadowColor}`,
                          fontWeight: span.bold ? 'bold' : 'normal',
                          fontStyle: span.italic ? 'italic' : 'normal',
                          textDecoration: `${span.underline ? 'underline' : ''} ${span.strikethrough ? 'line-through' : ''}`.trim() || 'none',
                        }}
                      >
                        {span.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* EDITOR CONTROLS & PALETTES                                    */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Input Fields, Quick Formatters & Presets */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Line Inputs Card */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <h2 className="font-headline font-bold text-base text-[#1A1210] dark:text-[#F8F4F0] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">
                  edit_note
                </span>
                MOTD Text Editor
              </h2>

              {/* Server Name & Player Count Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-[#68615A] dark:text-[#A8A19B] mb-1">
                    Server Name Header
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-xs text-[#1A1210] dark:text-[#F8F4F0] focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F]"
                    placeholder="A Minecraft Server"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#68615A] dark:text-[#A8A19B] mb-1">
                    Player Count Display
                  </label>
                  <input
                    type="text"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-xs text-[#1A1210] dark:text-[#F8F4F0] focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F]"
                    placeholder="42 / 100"
                  />
                </div>
              </div>

              {/* Line 1 Input */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1A1210] dark:text-[#F8F4F0] flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${activeLine === 1 ? 'bg-[#8A4228] dark:bg-[#E07A5F]' : 'bg-[#918A83]'}`} />
                    Line 1 Description
                  </label>
                  <button
                    type="button"
                    onClick={() => centerLine(1)}
                    className="text-[11px] font-medium text-[#8A4228] dark:text-[#E07A5F] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">format_align_center</span>
                    Center Line
                  </button>
                </div>
                <div className="relative">
                  <input
                    ref={input1Ref}
                    type="text"
                    value={line1}
                    onFocus={() => setActiveLine(1)}
                    onChange={(e) => setLine1(e.target.value)}
                    className={`w-full h-11 px-3.5 rounded-xl font-mono text-xs sm:text-sm bg-[#F7F6F4] dark:bg-[#15100E] border ${
                      activeLine === 1
                        ? 'border-[#8A4228] dark:border-[#E07A5F] ring-2 ring-[#8A4228]/15 dark:ring-[#E07A5F]/15'
                        : 'border-[#E2DDD8] dark:border-[#3A2D28]'
                    } text-[#1A1210] dark:text-[#F8F4F0] focus:outline-none transition-all`}
                    placeholder="&6&lServer Name &7| &aOnline Now"
                  />
                </div>
              </div>

              {/* Line 2 Input */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1A1210] dark:text-[#F8F4F0] flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${activeLine === 2 ? 'bg-[#8A4228] dark:bg-[#E07A5F]' : 'bg-[#918A83]'}`} />
                    Line 2 Description
                  </label>
                  <button
                    type="button"
                    onClick={() => centerLine(2)}
                    className="text-[11px] font-medium text-[#8A4228] dark:text-[#E07A5F] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">format_align_center</span>
                    Center Line
                  </button>
                </div>
                <div className="relative">
                  <input
                    ref={input2Ref}
                    type="text"
                    value={line2}
                    onFocus={() => setActiveLine(2)}
                    onChange={(e) => setLine2(e.target.value)}
                    className={`w-full h-11 px-3.5 rounded-xl font-mono text-xs sm:text-sm bg-[#F7F6F4] dark:bg-[#15100E] border ${
                      activeLine === 2
                        ? 'border-[#8A4228] dark:border-[#E07A5F] ring-2 ring-[#8A4228]/15 dark:ring-[#E07A5F]/15'
                        : 'border-[#E2DDD8] dark:border-[#3A2D28]'
                    } text-[#1A1210] dark:text-[#F8F4F0] focus:outline-none transition-all`}
                    placeholder="&eCustom Survival &8• &bNew Season!"
                  />
                </div>
              </div>

              {/* Style Formatting Buttons */}
              <div className="pt-4 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <span className="block text-xs font-semibold text-[#68615A] dark:text-[#A8A19B] mb-2.5">
                  Text Style Codes (Inserts into Active Line {activeLine}):
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {FORMAT_CODES.map((fmt) => (
                    <button
                      key={fmt.code}
                      type="button"
                      onClick={() => insertCode(`&${fmt.code}`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0] hover:border-[#8A4228] dark:hover:border-[#E07A5F] hover:text-[#8A4228] dark:hover:text-[#E07A5F] transition-colors"
                      title={`${fmt.name} (&${fmt.code})`}
                    >
                      {fmt.label} <span className="text-[10px] text-[#918A83]">&{fmt.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Symbols Row */}
              <div className="mt-4 pt-4 border-t border-[#E2DDD8] dark:border-[#3A2D28]">
                <span className="block text-xs font-semibold text-[#68615A] dark:text-[#A8A19B] mb-2.5">
                  Click to Insert Popular Symbols:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {POPULAR_SYMBOLS.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => insertCode(sym)}
                      className="w-8 h-8 rounded-lg text-xs font-bold bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0] hover:border-[#8A4228] dark:hover:border-[#E07A5F] hover:text-[#8A4228] dark:hover:text-[#E07A5F] transition-colors"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Presets Gallery Card */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <h3 className="font-headline font-bold text-sm text-[#1A1210] dark:text-[#F8F4F0] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[18px]">
                  auto_awesome
                </span>
                Quick Starter Presets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setLine1(p.line1);
                      setLine2(p.line2);
                      triggerToast(`Applied "${p.name}" preset!`);
                    }}
                    className="p-3 rounded-xl text-left bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#8A4228] dark:hover:border-[#E07A5F] transition-all group"
                  >
                    <div className="text-xs font-bold text-[#1A1210] dark:text-[#F8F4F0] group-hover:text-[#8A4228] dark:group-hover:text-[#E07A5F] mb-1">
                      {p.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#68615A] dark:text-[#A8A19B] truncate">
                      {p.line1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Minecraft Colors Palette & RGB Gradient Generator */}
          <div className="lg:col-span-5 space-y-6">
            {/* Minecraft 16 Standard Colors Palette */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <h2 className="font-headline font-bold text-base text-[#1A1210] dark:text-[#F8F4F0] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[20px]">
                  palette
                </span>
                16 Minecraft Colors
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MINECRAFT_COLORS.map((col) => (
                  <button
                    key={col.code}
                    type="button"
                    onClick={() => insertCode(`&${col.code}`)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-[#E2DDD8] dark:border-[#3A2D28] hover:border-[#8A4228] dark:hover:border-[#E07A5F] transition-all group text-left"
                  >
                    <span
                      className="w-4 h-4 rounded-xs flex-shrink-0 shadow-xs border border-black/20"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="truncate">
                      <div className="text-[11px] font-bold text-[#1A1210] dark:text-[#F8F4F0] leading-tight truncate">
                        {col.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#918A83]">
                        &{col.code}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RGB Hex Gradient Generator Card */}
            <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-6 shadow-2xs">
              <h3 className="font-headline font-bold text-sm text-[#1A1210] dark:text-[#F8F4F0] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[18px]">
                  gradient
                </span>
                Hex RGB Gradient Generator
              </h3>
              <p className="text-xs text-[#68615A] dark:text-[#A8A19B] mb-4 leading-relaxed">
                Generate smooth RGB hex color transitions across any word (supports modern Minecraft 1.16+).
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#68615A] dark:text-[#A8A19B] mb-1">
                    Text to Gradient
                  </label>
                  <input
                    type="text"
                    value={gradientText}
                    onChange={(e) => setGradientText(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] text-xs font-mono text-[#1A1210] dark:text-[#F8F4F0] focus:outline-none focus:border-[#8A4228] dark:focus:border-[#E07A5F]"
                    placeholder="Enter text..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#68615A] dark:text-[#A8A19B] mb-1">
                      Start Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <span className="font-mono text-xs uppercase">{gradientStart}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#68615A] dark:text-[#A8A19B] mb-1">
                      End Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <span className="font-mono text-xs uppercase">{gradientEnd}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateGradient}
                  className="w-full py-2.5 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-bold shadow-xs hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors mt-2"
                >
                  Apply Gradient to Line {activeLine}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* EXPORT & COPY FORMATS SECTION                                */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] rounded-2xl p-5 sm:p-7 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2DDD8] dark:border-[#3A2D28]">
            <div>
              <h2 className="font-headline font-bold text-lg text-[#1A1210] dark:text-[#F8F4F0]">
                Export Formats
              </h2>
              <p className="text-xs sm:text-sm text-[#68615A] dark:text-[#A8A19B] mt-0.5">
                Copy your generated MOTD in the exact format required by your server engine.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[24px]">
              content_paste
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Format 1: server.properties */}
            <div className="p-4 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#1A1210] dark:text-[#F8F4F0]">
                    server.properties (Escaped \u00A7)
                  </span>
                  <span className="font-mono-meta text-[10px] text-[#918A83] uppercase">Vanilla / Paper</span>
                </div>
                <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] mb-2.5">
                  Paste directly into your <code>server.properties</code> file under <code>motd=...</code>.
                </p>
                <pre className="font-mono text-xs p-2.5 rounded bg-black/5 dark:bg-black/30 text-[#1A1210] dark:text-[#F8F4F0] overflow-x-auto whitespace-pre-wrap break-all mb-3 select-all">
                  {exportServerProperties()}
                </pre>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(exportServerProperties(), 'server.properties format')}
                className="w-full py-2 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-semibold hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy server.properties
              </button>
            </div>

            {/* Format: YAML Configuration (.yml) */}
            <div className="p-4 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#1A1210] dark:text-[#F8F4F0] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#8A4228] dark:text-[#E07A5F] text-[16px]">description</span>
                    BungeeCord / Spigot (.yml)
                  </span>
                  <span className="font-mono-meta text-[10px] font-bold text-[#8A4228] dark:text-[#E07A5F] bg-[#FBECE6] dark:bg-[#38231C] px-2 py-0.5 rounded uppercase">
                    YAML / .YML
                  </span>
                </div>
                <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] mb-2.5">
                  Pre-formatted for BungeeCord, Waterfall, CleanMOTD, and Paper YAML configs.
                </p>
                <pre className="font-mono text-xs p-2.5 rounded bg-black/5 dark:bg-black/30 text-[#1A1210] dark:text-[#F8F4F0] overflow-x-auto whitespace-pre-wrap break-all mb-3 select-all">
                  {exportYamlFormat()}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(exportYamlFormat(), 'YAML (.yml) format')}
                  className="py-2 rounded-lg bg-[#8A4228] dark:bg-[#E07A5F] text-white dark:text-[#15100E] text-xs font-semibold hover:bg-[#72341D] dark:hover:bg-[#F19178] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Copy .yml
                </button>
                <button
                  type="button"
                  onClick={downloadYamlFile}
                  className="py-2 rounded-lg bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0] text-xs font-semibold hover:border-[#8A4228] dark:hover:border-[#E07A5F] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download .yml
                </button>
              </div>
            </div>

            {/* Format 3: Modern JSON Component */}
            <div className="p-4 rounded-xl bg-[#F7F6F4] dark:bg-[#15100E] border border-[#E2DDD8] dark:border-[#3A2D28] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#1A1210] dark:text-[#F8F4F0]">
                    JSON Text Component
                  </span>
                  <span className="font-mono-meta text-[10px] text-[#918A83] uppercase">Paper 1.20+</span>
                </div>
                <p className="text-[11px] text-[#68615A] dark:text-[#A8A19B] mb-2.5">
                  Structured JSON payload for advanced proxy pipelines.
                </p>
                <pre className="font-mono text-xs p-2.5 rounded bg-black/5 dark:bg-black/30 text-[#1A1210] dark:text-[#F8F4F0] overflow-x-auto whitespace-pre-wrap break-all mb-3 select-all">
                  {exportJsonFormat()}
                </pre>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(exportJsonFormat(), 'JSON payload')}
                className="w-full py-2 rounded-lg bg-white dark:bg-[#201815] border border-[#E2DDD8] dark:border-[#3A2D28] text-[#1A1210] dark:text-[#F8F4F0] text-xs font-semibold hover:border-[#8A4228] dark:hover:border-[#E07A5F] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy JSON
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <QuickLauncherModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={(tool: Tool) => {
          window.location.href = tool.href;
        }}
      />
    </div>
  );
}
