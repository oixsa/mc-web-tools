/**
 * Single source of truth for Minecraft color codes, dyes, text formatting, and color math.
 * Standardizes color palettes across all Kita Tools utilities.
 */

export interface MinecraftColor {
  code: string;
  name: string;
  hex: string;
  shadowHex: string;
  jsonName: string;
}

export const MINECRAFT_COLORS: MinecraftColor[] = [
  { code: '0', name: 'Black', hex: '#000000', shadowHex: '#000000', jsonName: 'black' },
  { code: '1', name: 'Dark Blue', hex: '#0000AA', shadowHex: '#00002A', jsonName: 'dark_blue' },
  { code: '2', name: 'Dark Green', hex: '#00AA00', shadowHex: '#002A00', jsonName: 'dark_green' },
  { code: '3', name: 'Dark Aqua', hex: '#00AAAA', shadowHex: '#002A2A', jsonName: 'dark_aqua' },
  { code: '4', name: 'Dark Red', hex: '#AA0000', shadowHex: '#2A0000', jsonName: 'dark_red' },
  { code: '5', name: 'Dark Purple', hex: '#AA00AA', shadowHex: '#2A002A', jsonName: 'dark_purple' },
  { code: '6', name: 'Gold', hex: '#FFAA00', shadowHex: '#2A2A00', jsonName: 'gold' },
  { code: '7', name: 'Gray', hex: '#AAAAAA', shadowHex: '#2A2A2A', jsonName: 'gray' },
  { code: '8', name: 'Dark Gray', hex: '#555555', shadowHex: '#151515', jsonName: 'dark_gray' },
  { code: '9', name: 'Blue', hex: '#5555FF', shadowHex: '#15153F', jsonName: 'blue' },
  { code: 'a', name: 'Green', hex: '#55FF55', shadowHex: '#153F15', jsonName: 'green' },
  { code: 'b', name: 'Aqua', hex: '#55FFFF', shadowHex: '#153F3F', jsonName: 'aqua' },
  { code: 'c', name: 'Red', hex: '#FF5555', shadowHex: '#3F1515', jsonName: 'red' },
  { code: 'd', name: 'Light Purple', hex: '#FF55FF', shadowHex: '#3F153F', jsonName: 'light_purple' },
  { code: 'e', name: 'Yellow', hex: '#FFFF55', shadowHex: '#3F3F15', jsonName: 'yellow' },
  { code: 'f', name: 'White', hex: '#FFFFFF', shadowHex: '#3F3F3F', jsonName: 'white' },
];

export interface MinecraftDye {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
  intVal: number;
}

export const MINECRAFT_DYES: MinecraftDye[] = [
  { id: 'white_dye', name: 'White Dye', hex: '#F9FFFE', rgb: [249, 255, 254], intVal: 16382457 },
  { id: 'orange_dye', name: 'Orange Dye', hex: '#F9801D', rgb: [249, 128, 29], intVal: 16351261 },
  { id: 'magenta_dye', name: 'Magenta Dye', hex: '#C74EBD', rgb: [199, 78, 189], intVal: 13061821 },
  { id: 'light_blue_dye', name: 'Light Blue Dye', hex: '#3AB3DA', rgb: [58, 179, 218], intVal: 3847130 },
  { id: 'yellow_dye', name: 'Yellow Dye', hex: '#FED83D', rgb: [254, 216, 61], intVal: 16701501 },
  { id: 'lime_dye', name: 'Lime Dye', hex: '#80C71F', rgb: [128, 199, 31], intVal: 8439583 },
  { id: 'pink_dye', name: 'Pink Dye', hex: '#F38BAA', rgb: [243, 139, 170], intVal: 15961002 },
  { id: 'gray_dye', name: 'Gray Dye', hex: '#474F52', rgb: [71, 79, 82], intVal: 4673362 },
  { id: 'light_gray_dye', name: 'Light Gray Dye', hex: '#9D9D97', rgb: [157, 157, 151], intVal: 10329495 },
  { id: 'cyan_dye', name: 'Cyan Dye', hex: '#169C9C', rgb: [22, 156, 156], intVal: 1481884 },
  { id: 'purple_dye', name: 'Purple Dye', hex: '#8932B8', rgb: [137, 50, 184], intVal: 8991416 },
  { id: 'blue_dye', name: 'Blue Dye', hex: '#3C44AA', rgb: [60, 68, 170], intVal: 3949738 },
  { id: 'brown_dye', name: 'Brown Dye', hex: '#835432', rgb: [131, 84, 50], intVal: 8606770 },
  { id: 'green_dye', name: 'Green Dye', hex: '#5E7C16', rgb: [94, 124, 22], intVal: 6192150 },
  { id: 'red_dye', name: 'Red Dye', hex: '#B02E26', rgb: [176, 46, 38], intVal: 11546150 },
  { id: 'black_dye', name: 'Black Dye', hex: '#1D1D21', rgb: [29, 29, 33], intVal: 1973019 },
];

export const FORMAT_CODES = [
  { code: 'l', name: 'Bold', label: 'B', style: 'font-bold' },
  { code: 'o', name: 'Italic', label: 'I', style: 'italic' },
  { code: 'n', name: 'Underline', label: 'U', style: 'underline' },
  { code: 'm', name: 'Strikethrough', label: 'S', style: 'line-through' },
  { code: 'k', name: 'Magic', label: '?', style: 'magic' },
  { code: 'r', name: 'Reset', label: '↺', style: 'reset' },
] as const;

export const POPULAR_SYMBOLS = [
  '★', '✦', '►', '➤', '»', '«', '⚔', '⛏', '⚡', '❤', '✔', '✖', '♦', '•', '|', '❖',
] as const;

/**
 * Converts a hex color string (with or without '#') to an [R, G, B] tuple.
 */
export function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16) || 0;
  const g = parseInt(cleaned.substring(2, 4), 16) || 0;
  const b = parseInt(cleaned.substring(4, 6), 16) || 0;
  return [r, g, b];
}

/**
 * Converts [R, G, B] numbers to an uppercase hex string (e.g. #FFFFFF).
 */
export function rgbToHex([r, g, b]: [number, number, number]): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Converts [R, G, B] to Minecraft 24-bit RGB integer value.
 */
export function rgbToInt([r, g, b]: [number, number, number]): number {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

/**
 * Converts Minecraft 24-bit RGB integer back to [R, G, B].
 */
export function intToRgb(intVal: number): [number, number, number] {
  const r = (intVal >> 16) & 0xff;
  const g = (intVal >> 8) & 0xff;
  const b = intVal & 0xff;
  return [r, g, b];
}

/**
 * Euclidean distance between two RGB colors in 3D color space.
 */
export function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
  const dr = c1[0] - c2[0];
  const dg = c1[1] - c2[1];
  const db = c1[2] - c2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Linear interpolation between two RGB colors at ratio [0.0 - 1.0].
 */
export function interpolateRgb(
  c1: [number, number, number],
  c2: [number, number, number],
  ratio: number
): [number, number, number] {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * ratio);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * ratio);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * ratio);
  return [r, g, b];
}
