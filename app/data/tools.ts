import { CategoryOption, Tool } from '../types/tools';

/**
 * Category definitions for Kita Tools.
 */
export const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'All tools', icon: 'apps' },
  { id: 'creator-tools', label: 'Creator & Server', icon: 'dns' },
];

/**
 * Active catalog of Kita Tools Minecraft utilities.
 * Only tools that are fully implemented and functional are listed here.
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
