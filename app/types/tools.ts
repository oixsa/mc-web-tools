/**
 * Type definitions for Kita Tools application.
 * Provides strict contracts for tool cards, categories, guides, and theme states.
 */

export type ToolCategoryId =
  | 'all'
  | 'build-planning'
  | 'shapes'
  | 'art-palettes'
  | 'seeds-worlds'
  | 'calculators-games'
  | 'creator-tools'
  | 'utilities';

export interface CategoryOption {
  id: ToolCategoryId;
  label: string;
  icon?: string;
}

export type ToolBadgeType = 'BETA' | 'NEW' | 'SCHEMATIC' | 'SHAPES' | '3D BUILD' | 'RECIPES' | 'ANVIL' | 'WORLDS' | 'FINDER' | 'ALCHEMY';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategoryId;
  badge?: string;
  isFlagship?: boolean;
  featured?: boolean;
  href: string;
  icon: string;
  accentColor?: string;
  blockCount?: string;
  engineVersion?: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  icon: string;
}

export type ThemeMode = 'light' | 'dark';

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}
