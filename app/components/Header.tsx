'use client';

/**
 * Re-exporting Navbar as Header for backward compatibility.
 * All top bar navigation functionality is now consolidated in Navbar.tsx.
 */
export { Navbar as Header, Navbar, NavLinks, MobileNavbar } from './Navbar';
export type { NavbarProps, NavbarProps as HeaderProps } from './Navbar';
import { Navbar } from './Navbar';
export default Navbar;
