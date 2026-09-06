import { CategoryOption, Tool } from '../types/tools';

/**
 * Category definitions for Kita Tools All-in-One Minecraft Suite.
 */
export const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'All tools', icon: 'apps' },
  { id: 'creator-tools', label: 'Server & Creator', icon: 'dns' },
  { id: 'calculators-games', label: 'Mechanics & Calculators', icon: 'calculate' },
  { id: 'shapes', label: 'Voxel Shapes', icon: 'category' },
  { id: 'art-palettes', label: 'Art & Colors', icon: 'palette' },
  { id: 'utilities', label: 'Utilities', icon: 'build' },
];

/**
 * Complete catalog of active, functional Kita Tools Minecraft utilities.
 * Every tool listed here has an active, tested route in app/tools/.
 */
export const TOOLS: Tool[] = [
  {
    id: 'motd-editor',
    title: 'Server MOTD Generator',
    description: 'Design custom colored and gradient Minecraft server MOTDs with live preview and export for server.properties, BungeeCord, and YAML.',
    category: 'creator-tools',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/motd-editor',
    icon: 'dns',
    accentColor: '#8A4228',
    engineVersion: 'Java & Bedrock',
  },
  {
    id: 'server-icon',
    title: 'Server Icon Resizer',
    description: 'Convert and resize any image into the official 64×64 PNG format required for Minecraft server icons.',
    category: 'creator-tools',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/server-icon',
    icon: 'image',
    accentColor: '#8A4228',
    engineVersion: 'Java 64×64',
  },
  {
    id: 'nether-portal',
    title: 'Nether Portal Calculator',
    description: 'Accurately convert and link Overworld and Nether coordinates with 3D Euclidean distance checking.',
    category: 'calculators-games',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/nether-portal',
    icon: 'calculate',
    accentColor: '#8A4228',
    engineVersion: 'Java & Bedrock',
  },
  {
    id: 'circle-generator',
    title: 'Voxel Circle & Oval Generator',
    description: 'Generate pixel-perfect rasterized circles, ovals, and rounded borders with live 2D grid and block counts.',
    category: 'shapes',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/circle-generator',
    icon: 'circle',
    accentColor: '#8A4228',
    engineVersion: 'All Versions',
  },
  {
    id: 'sphere-generator',
    title: 'Sphere & Dome 3D Generator',
    description: 'Create 3D spheres, domes, and observatories with layer-by-layer slice viewing and block statistics.',
    category: 'shapes',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/sphere-generator',
    icon: 'sports_baseball',
    accentColor: '#8A4228',
    engineVersion: 'All Versions',
  },
  {
    id: 'tellraw-editor',
    title: 'Tellraw & JSON Text Builder',
    description: 'Create interactive chat messages with clickable links, command executions, hover tooltips, and custom colors.',
    category: 'creator-tools',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/tellraw-editor',
    icon: 'chat',
    accentColor: '#8A4228',
    engineVersion: 'Java 1.7+',
  },
  {
    id: 'gradient-generator',
    title: 'Block Gradient & Palette Matcher',
    description: 'Find smooth block transitions between materials across 60+ blocks to elevate your building gradients.',
    category: 'art-palettes',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/gradient-generator',
    icon: 'gradient',
    accentColor: '#8A4228',
    engineVersion: '1.21+',
  },
  {
    id: 'enchant-optimizer',
    title: 'Anvil & Enchantment Optimizer',
    description: 'Calculate the cheapest anvil combining order to avoid prior work penalties and the "Too Expensive!" limit.',
    category: 'calculators-games',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/enchant-optimizer',
    icon: 'auto_fix_high',
    accentColor: '#8A4228',
    engineVersion: 'Survival',
  },
  {
    id: 'armor-stand',
    title: 'Armor Stand Pose Visualizer',
    description: 'Pose armor stands with real-time limb rotation controls, NBT flags, and ready-to-paste /summon commands.',
    category: 'utilities',
    badge: 'ACTIVE',
    isFlagship: true,
    featured: true,
    href: '/tools/armor-stand',
    icon: 'accessibility_new',
    accentColor: '#8A4228',
    engineVersion: 'Java Edition',
  },
  {
    id: 'beacon-calculator',
    title: 'Beacon Pyramid & Mineral Calculator',
    description: 'Plan single and multi-beacon pyramids with exact block totals, ingots, full stacks, and shulker storage needs.',
    category: 'calculators-games',
    badge: 'ACTIVE',
    isFlagship: false,
    featured: true,
    href: '/tools/beacon-calculator',
    icon: 'diamond',
    accentColor: '#8A4228',
    engineVersion: 'Survival',
  },
  {
    id: 'xp-calculator',
    title: 'XP & Level Calculator',
    description: 'Calculate exact XP points, mob farm kill counts, and Bottles o&apos; Enchanting needed to reach any target level.',
    category: 'calculators-games',
    badge: 'ACTIVE',
    isFlagship: false,
    featured: true,
    href: '/tools/xp-calculator',
    icon: 'calculate',
    accentColor: '#8A4228',
    engineVersion: 'Minecraft 1.8+',
  },
  {
    id: 'firework-designer',
    title: 'Firework Rocket Designer',
    description: 'Design custom firework rockets with shapes, multi-color bursts, trail, and live night-sky particle simulation.',
    category: 'creator-tools',
    badge: 'ACTIVE',
    isFlagship: false,
    featured: true,
    href: '/tools/firework-designer',
    icon: 'celebration',
    accentColor: '#8A4228',
    engineVersion: 'Java 1.20.5+',
  },
  {
    id: 'leather-dye-calculator',
    title: 'Leather Armor Dye Mixer',
    description: 'Simulate vanilla Minecraft dye mixing across 5.7M colors with crafting recipes and /give commands.',
    category: 'art-palettes',
    badge: 'ACTIVE',
    isFlagship: false,
    featured: true,
    href: '/tools/leather-dye-calculator',
    icon: 'palette',
    accentColor: '#8A4228',
    engineVersion: 'Vanilla Survival',
  },
];

/**
 * Returns flagship tools recommended for spotlight display.
 */
export function getFlagshipTools(): Tool[] {
  return TOOLS.filter((t) => t.isFlagship);
}

/**
 * Lookup tool by unique ID.
 */
export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}
