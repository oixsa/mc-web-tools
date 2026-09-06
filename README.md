# Kita Tools ⛏️

> Precision Minecraft tools, calculators, and schematics crafted for technical builders and voxel architects.

Crafted based on modern Stitch web design, **Kita Tools** provides in-browser tools for Minecraft players and developers, starting with a powerful **Server MOTD Generator** (with export support for `server.properties`, BungeeCord, and YAML `.yml`).

---

## ✨ Key Features

- **Fully Functional In-Browser Minecraft Tools**: Interactive *Server MOTD Generator* with live in-game preview, RGB hex gradient builder, and multi-format export.
- **Dual Theme Support (Dark Mode & Light Mode - Dark Bay, Gray, & Bay)**:
  - **Dark Bay Mode (Dark Mode)**: Dark Bay `#15100E` base canvas, `#201815` card surfaces, *Luminous Bay* `#E07A5F` copper accent, and neutral `#A8A19B` details.
  - **Light Mode (Stone Gray & Warm Bay)**: Warm stone gray `#F7F6F4` canvas, clean white `#FFFFFF` cards, *Rich Bay* `#8A4228` chestnut accent, and *Dark Bay Ink* `#1A1210`.
  - Equipped with a smooth theme toggle and persistent preferences (no FOUC/flicker).
- **Fully Responsive Design (Mobile, Tablet, & Desktop)**:
  - Adaptive grid layout across all screen sizes.
  - Horizontal touch-scrollable category bar.
  - Mobile drawer navigation menu.
- **Quick Search & Keyboard Shortcuts (⌘K / Ctrl+K)**:
  - Open the *Quick Launcher* modal by pressing `⌘K` or `Ctrl+K`.
  - Real-time search across tool names, categories, and descriptions.
- **Maintainable & Type-Safe Codebase**:
  - Only complete, fully working tools are listed in the active catalog.
  - Adding a new tool only requires a single data object in `app/data/tools.ts`.

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 📚 Developer Documentation

Please refer to the complete architecture and maintenance guide at:
👉 **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**

It covers:
- Step-by-step guide for adding new tools or categories.
- Design System token and color mappings.
- Structure of the `useTheme` and `useFavorites` hooks.

---

## ⚖️ Disclaimer

*NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.*
Minecraft is a registered trademark of Mojang Synergies AB.
