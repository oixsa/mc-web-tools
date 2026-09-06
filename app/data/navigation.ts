import { FooterSection, NavItem } from '../types/tools';

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Tools', href: '#explore-tools' },
  { label: 'Guides', href: '#guides' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'About', href: '#about' },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Build Tools',
    links: [
      { label: 'Gradient Generator', href: '/tools/gradient-generator' },
      { label: 'Circle & Sphere Generator', href: '/tools/circle-generator' },
      { label: 'Block Palette Matcher', href: '/tools/block-palette-generator' },
      { label: 'Schematic 3D Preview', href: '/tools/build-planner' },
    ],
  },
  {
    title: 'Calculators & Guides',
    links: [
      { label: 'Nether Portal Math', href: '/tools/nether-portal-calculator' },
      { label: 'Beacon Cost Planner', href: '/guides/beacon-guide' },
      { label: 'Architectural Texturing', href: '/guides' },
      { label: 'Redstone Clock Timings', href: '/guides' },
    ],
  },
  {
    title: 'Creator Tools',
    links: [
      { label: 'Custom Banner Crafter', href: '/tools/banner-studio' },
      { label: 'Armor Stand Animator', href: '/tools/armor-stand-skin-converter' },
      { label: 'Avatar Maker', href: '/tools/avatar-maker' },
      { label: 'Mob Pose Studio', href: '/tools/mob-pose-studio' },
    ],
  },
  {
    title: 'Utilities & Hub',
    links: [
      { label: 'About Project', href: '#about' },
      { label: 'Release Changelog', href: '#changelog' },
      { label: 'Media Kit', href: '#media-kit' },
      { label: 'Privacy & Terms', href: '#privacy' },
    ],
  },
];
