import { FooterSection, NavItem } from '../types/tools';

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'All Tools', href: '/#explore-tools' },
  { label: 'Circle Generator', href: '/tools/circle-generator' },
  { label: 'Enchant Optimizer', href: '/tools/enchant-optimizer' },
  { label: 'MOTD Generator', href: '/tools/motd-editor' },
  { label: 'About', href: '/#about' },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Voxel & World Tools',
    links: [
      { label: 'Voxel Circle & Oval Generator', href: '/tools/circle-generator' },
      { label: 'Sphere & Dome 3D Generator', href: '/tools/sphere-generator' },
      { label: 'Nether Portal Calculator', href: '/tools/nether-portal' },
      { label: 'Block Gradient Matcher', href: '/tools/gradient-generator' },
    ],
  },
  {
    title: 'Survival & Calculators',
    links: [
      { label: 'Anvil Enchantment Optimizer', href: '/tools/enchant-optimizer' },
      { label: 'Beacon Pyramid Calculator', href: '/tools/beacon-calculator' },
      { label: 'XP & Mob Farm Calculator', href: '/tools/xp-calculator' },
      { label: 'Leather Armor Dye Mixer', href: '/tools/leather-dye-calculator' },
    ],
  },
  {
    title: 'Server & Creator',
    links: [
      { label: 'Server MOTD Generator', href: '/tools/motd-editor' },
      { label: 'Server Icon Resizer (64×64)', href: '/tools/server-icon' },
      { label: 'Tellraw & JSON Text Builder', href: '/tools/tellraw-editor' },
      { label: 'Firework Rocket Designer', href: '/tools/firework-designer' },
      { label: 'Armor Stand Pose Visualizer', href: '/tools/armor-stand' },
    ],
  },
  {
    title: 'Project & Docs',
    links: [
      { label: 'About Kita Tools', href: '/#about' },
      { label: 'Architecture Guide', href: '/docs/ARCHITECTURE.md' },
      { label: 'GitHub Repository', href: 'https://github.com' },
      { label: 'Discord Community', href: 'https://discord.com' },
    ],
  },
];
