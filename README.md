# Kita Tools (kita tools) ⛏️

> Precision Minecraft tools, calculators, and schematics crafted for technical builders and voxel architects.

Berasaskan rekaan laman moden Stitch, **Kita Tools** menyediakan lebih 34 alatan pelayar untuk merancang binaan, menghasilkan bentuk geometri, meneroka peta seed, dan mengira keperluan bahan Minecraft tanpa perlu keluar dari laman web.

---

## ✨ Ciri-Ciri Utama (Key Features)

- **34+ Alatan Pelayar Minecraft**: Daripada *Build Planner*, *Circle Generator*, *Roof Designer*, hingga ke *Enchant Optimizer* dan *Seed Map*.
- **Dua Pilihan Tema (Dark Mode & Light Mode - Dark Bay, Gray, & Bay)**:
  - **Dark Bay Mode (Dark Mode)**: Warna asas *Dark Bay* `#15100E`, kad `#201815`, aksen tembaga bay bersinar *Luminous Bay* `#E07A5F`, dan perincian kelabu neutral `#A8A19B`.
  - **Light Mode (Stone Gray & Warm Bay)**: Warna kanvas kelabu hangat `#F7F6F4`, kad putih bersih `#FFFFFF`, aksen kayu berangan *Rich Bay* `#8A4228`, dan dakwat gelap *Dark Bay Ink* `#1A1210`.
  - Dilengkapi ciri suis tema pantas dan ingatan kekal (*persisted preference* tanpa kerlipan FOUC).
- **Paparan Responsif Penuh (Mobile, Tablet, & Desktop)**:
  - Grid fleksibel 1 hingga 4 lajur mengikut saiz peranti.
  - Bar kategori alatan boleh diskrol secara sentuhan (*horizontal touch scrolling*).
  - Menu drawer navigasi mudah alih.
- **Carian Pantas & Pintasan Papan Kekunci (⌘K / Ctrl+K)**:
  - Buka dialog *Quick Launcher* dengan menekan kekunci `⌘K` atau `Ctrl+K`.
  - Carian masa nyata mengikut nama, kategori, dan fungsi.
- **Sistem Alatan Berbintang (Favorites)**: Simpan alatan kegemaran pada peranti untuk capaian segera.
- **Kod Mudah Diselenggara (Maintainable & Type-Safe)**:
  - Data alatan dan panduan dipisahkan ke dalam fail TypeScript berpusat (`app/data/tools.ts`, `app/data/guides.ts`).
  - Menambah alatan baharu hanya memerlukan penambahan 1 objek data tanpa mengusik kod komponen UI.

---

## 🚀 Memulakan Projek (Getting Started)

Pasang kebergantungan pakej (dependencies):

```bash
npm install
# atau
pnpm install
# atau
yarn install
```

Jalankan pelayan pembangunan (development server):

```bash
npm run dev
```

Buka pelayar anda di [http://localhost:3000](http://localhost:3000).

---

## 📚 Dokumentasi Pembangun (Developer Documentation)

Sila rujuk dokumen seni bina dan panduan penyelenggaraan lengkap di:
👉 **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**

Ia merangkumi:
- Panduan langkah demi langkah menambah alatan atau kategori baharu.
- Pemetaan warna token reka bentuk (Design System tokens).
- Struktur hook `useTheme` dan `useFavorites`.

---

## ⚖️ Penafian Hak Cipta (Disclaimer)

*NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.*
Minecraft ialah tanda dagangan berdaftar Mojang Synergies AB.
