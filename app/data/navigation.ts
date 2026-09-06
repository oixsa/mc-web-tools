import { FooterSection, NavItem } from '../types/tools';

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Tools', href: '#explore-tools' },
  { label: 'MOTD Generator', href: '/tools/motd-editor' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'About', href: '#about' },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Active Tools',
    links: [
      { label: 'Server MOTD Generator', href: '/tools/motd-editor' },
      { label: 'Browse All Tools', href: '#explore-tools' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Architecture Guide', href: '/docs/ARCHITECTURE.md' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub Repository', href: 'https://github.com' },
      { label: 'Discord Server', href: 'https://discord.com' },
    ],
  },
  {
    title: 'Project Info',
    links: [
      { label: 'About Kita Tools', href: '#about' },
      { label: 'Release Notes (v2.4)', href: '#changelog' },
    ],
  },
];
