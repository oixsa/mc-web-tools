# Kita Tools — Architecture & Developer Documentation

Dokumentasi ini menerangkan reka bentuk senibina sistem (architecture), struktur kod, sistem tema dwimod (Light & Dark), serta panduan penyelenggaraan (maintenance) untuk projek **Kita Tools**.

---

## 1. Gambaran Keseluruhan (Overview)

Kita Tools dibangunkan menggunakan **Next.js (App Router)**, **React 19**, **TypeScript**, dan **Tailwind CSS v4**. Projek ini direka bentuk khusus untuk arkitek voxel dan pembina Minecraft dengan penekanan pada:

- **Kebolehselenggaraan (Maintainability)**: Data alatan, panduan, dan kategori dipisahkan sepenuhnya daripada lapisan UI (presentation layer).
- **Kebolehbacaan (Readability)**: Setiap komponen mematuhi prinsip tanggungjawab tunggal (*Single Responsibility Principle*), ditaip dengan ketat menggunakan TypeScript (*strict typing*), dan disertakan komen panduan yang jelas.
- **Dua Tema Bersepadu (Dual Theme Support)**:
  - **Light Mode**: Berasaskan Stitch *Precision Sandbox UI* (`#F4F7FC` kanvas, `#FFFFFF` kad, aksen `#3849E5` / `#006C4F`).
  - **Dark Mode**: Berasaskan Stitch *Obsidian Sandbox Precision* (`#0B0F19` obsidian kanvas, `#131C2E` kad, aksen `#38BDF8` cyan elektrik / `#6366F1` indigo).
- **Paparan Responsif Penuh**: Dioptimumkan untuk skrin mudah alih (*mobile*), tablet, dan komputer riba/desktop (*desktop*).

---

## 2. Struktur Direktori (Directory Structure)

```
kitatools/
├── app/
│   ├── components/                 # Komponen UI modular
│   │   ├── AppShell.tsx            # Shell induk (Header + Footer + Modal carian global ⌘K)
│   │   ├── Header.tsx              # Bar navigasi atas + toggle tema + drawer mudah alih
│   │   ├── Navbar.tsx              # Komponen navigasi desktop & drawer mudah alih Material 3
│   │   ├── Hero.tsx                # Hero section + MOTD spotlight
│   │   ├── FlagshipSection.tsx     # Alatan utama yang disyorkan
│   │   ├── ExploreTools.tsx        # Katalog penuh alatan + carian + filter kategori
│   │   ├── ToolCard.tsx            # Komponen kad alatan yang boleh diguna semula
│   │   ├── Footer.tsx              # Footer direktori 4-lajur + penafian hak cipta
│   │   └── QuickLauncherModal.tsx  # Dialog carian pantas (⌘K / Ctrl+K)
│   ├── data/                       # Lapisan data berpusat (Maintainable Data Layer)
│   │   ├── tools.ts                # Senarai alatan aktif dengan pautan dan metadata
│   │   └── navigation.ts           # Pautan navigasi & footer aktif
│   ├── hooks/                      # Custom React hooks
│   │   ├── useTheme.ts             # Pengurusan tema Light / Dark + storan tempatan
│   │   └── useFavorites.ts         # Pengurusan alatan berbintang + storan tempatan
│   ├── types/                      # Definisi jenis TypeScript
│   │   └── tools.ts                # Interface: Tool, Category, Guide, ThemeMode
│   ├── tools/                      # Halaman alatan khusus yang aktif
│   │   ├── motd-editor/            # 1. Server MOTD Generator & YAML (.yml) export
│   │   ├── server-icon/            # 2. Server Icon Resizer (64x64 PNG & Base64)
│   │   ├── nether-portal/          # 3. Nether Portal 3D Link Calculator
│   │   ├── circle-generator/       # 4. Voxel Circle & Oval Generator (Canvas Grid)
│   │   ├── sphere-generator/       # 5. Sphere & Dome 3D Generator (Layer Slices)
│   │   ├── tellraw-editor/         # 6. Tellraw & JSON Text Builder (/tellraw & /title)
│   │   ├── gradient-generator/     # 7. Block Gradient & Palette Matcher (60+ Blocks)
│   │   ├── enchant-optimizer/      # 8. Anvil & Enchantment Optimizer (Penalty Tree)
│   │   ├── armor-stand/            # 9. Armor Stand Pose Visualizer & /summon
│   │   ├── beacon-calculator/      # 10. Beacon Pyramid & Mineral Calculator (1-4 Tiers)
│   │   ├── xp-calculator/          # 11. XP & Mob Farm Calculator (1.8+ Formulas)
│   │   ├── firework-designer/      # 12. Firework Rocket Designer (Live Particle Canvas)
│   │   └── leather-dye-calculator/ # 13. Leather Armor Dye Mixer (5.7M Vanilla Colors)
│   ├── layout.tsx                  # Layout induk + pencegahan kerlipan tema (anti-FOUC)
│   └── page.tsx                    # Halaman utama menggabungkan semua komponen
├── docs/
│   └── ARCHITECTURE.md             # Dokumentasi teknikal ini
└── README.md                       # Pengenalan projek dan panduan pantas
```

---

## 3. Panduan Penyelenggaraan (How to Maintain & Extend)

### A. Cara Menambah Alatan Baharu (Add a New Tool)
Anda **tidak perlu menyentuh kod JSX atau UI**. Hanya tambah objek baharu ke dalam `app/data/tools.ts`:

```typescript
// Buka fail app/data/tools.ts dan masukkan objek dalam tatasusunan TOOLS:
{
  id: 'nama-tool-anda',
  title: 'Nama Alatan Anda',
  description: 'Penerangan ringkas tentang fungsi alatan ini dalam satu atau dua ayat.',
  category: 'build-planning', // Pilihan: 'build-planning' | 'shapes' | 'art-palettes' | 'seeds-worlds' | 'calculators-games' | 'creator-tools' | 'utilities'
  badge: 'NEW',               // Pilihan: 'BETA' | 'NEW' | 'SCHEMATIC' | dll.
  href: '/tools/nama-tool-anda',
  icon: 'build',              // Nama ikon Google Material Symbols Outlined
  isFlagship: false,          // Letak true jika ingin dipaparkan dalam Flagship Section
  featured: false,
  engineVersion: '1.21+',     // (Pilihan)
}
```
Alatan baharu ini secara automatik akan:
1. Muncul dalam senarai **Explore Tools**.
2. Boleh dicari menerusi bar carian dan modal **⌘K Quick Launcher**.
3. Boleh ditapis mengikut kategori yang dipilih.
4. Boleh dibintangkan (favorited) oleh pengguna.

---

### B. Cara Menambah Kategori Baharu
Jika anda ingin menambah kategori alatan baharu:
1. Kemaskini jenis `ToolCategoryId` dalam `app/types/tools.ts`:
   ```typescript
   export type ToolCategoryId = 'all' | ... | 'kategori-baharu';
   ```
2. Tambah entri kategori dalam `app/data/tools.ts`:
   ```typescript
   export const CATEGORIES: CategoryOption[] = [
     ...,
     { id: 'kategori-baharu', label: 'Nama Kategori', icon: 'nama_ikon' }
   ];
   ```

---

### C. Cara Menambah Panduan Baharu (Add a New Guide)
Buka `app/data/guides.ts` dan tambah entri ke dalam tatasusunan `GUIDES`:
```typescript
{
  id: 'panduan-redstone',
  title: 'Redstone Logic & Circuits',
  description: 'Panduan lengkap litar logik, repeater ticks, dan rekaan pintu rahsia.',
  href: '/guides/redstone',
  badge: 'NEW',
  icon: 'settings_input_component',
}
```

---

## 4. Sistem Tema & Token Reka Bentuk Material 3 (Material You / M3)

Pengurusan tema dikendalikan oleh hook `app/hooks/useTheme.ts` bersama pembolehubah token Material 3 dalam `app/globals.css`:

### Pemetaan Warna Tema Material 3:

| Peranan M3 | Light Mode (Warm Terracotta M3) | Dark Mode (Deep Mineral M3) |
|---|---|---|
| **Surface** | `#FFF8F6` (Neutral Light Surface) | `#1A110F` (Neutral Dark Surface) |
| **Surface Container Lowest** | `#FFFFFF` (Pure White Card) | `#140C0A` (Deepest Container) |
| **Surface Container Low** | `#FDF1ED` | `#231917` |
| **Surface Container** | `#F7EBE7` (Base Elevation) | `#271D1B` (Base Dark Elevation) |
| **Surface Container High** | `#F1E5E1` | `#322825` |
| **Surface Container Highest** | `#EBE0DC` | `#3E322F` |
| **Primary (Terracotta / Redstone)** | `#904B32` | `#FFB59D` (Luminous Redstone) |
| **Primary Container** | `#FFDBCF` | `#72341D` |
| **Secondary (Mineral Stone)** | `#77574C` | `#E7BDB0` |
| **Secondary Container** | `#FFDBCF` | `#5D4036` |
| **Tertiary (Gold / Amber)** | `#6B5E2F` | `#D7C68D` |
| **Outline / Border** | `#85736E` | `#A08C86` |
| **Outline Variant** | `#D8C2BC` | `#53433F` |
| **On Surface (Teks Utama)** | `#231916` | `#F1DFDA` |
| **On Surface Variant (Teks Sekunder)**| `#53433F` | `#D8C2BC` |

### Logik Pencegahan Kerlipan Tema (Zero-FOUC):
Dalam `app/layout.tsx`, sebuah skrip kecil diselitkan ke dalam `<head>` yang membaca storan `localStorage` sebelum pelayan/pelayar memulakan render DOM. Ini memastikan tiada kerlipan putih berlaku apabila pengguna melayari laman dalam mod gelap.

---

## 5. Pintasan Papan Kekunci & Kebolehcapaian (Keyboard Shortcuts & Accessibility)

- **⌘K / Ctrl+K**: Membuka dialog carian alatan pantas (*Quick Launcher*).
- **↑ / ↓**: Navigasi antara alatan yang ditemui dalam carian.
- **Enter / ↵**: Memilih dan melayari alatan yang diserlahkan.
- **Escape**: Menutup dialog carian.
- Setiap butang interaktif dan ikon mempunyai atribut `aria-label` yang sesuai untuk pembaca skrin (*screen readers*).
