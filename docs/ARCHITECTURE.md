# Arsitektur Sistem: PenjahitKu (Konveksi & Garment)

## 1. Struktur Modul & Folder
```
penjahit-ku/
├── docs/                      # Dokumentasi & spesifikasi
│   ├── RESEARCH.md
│   ├── PRD.md
│   └── ARCHITECTURE.md
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/login/      # Halaman login staf & pemilik
│   │   ├── (dashboard)/       # Dashboard internal
│   │   │   ├── admin/         # Khusus pemilik (katalog, staf, laporan)
│   │   │   ├── produksi/      # Antrean produksi (pemilik & karyawan)
│   │   │   └── pesanan/       # Daftar & detail pesanan / SPK
│   │   ├── katalog/           # Katalog interaktif kiosk-style
│   │   ├── track/             # Portal pelacakan publik pelanggan
│   │   ├── api/               # Endpoint API internal
│   │   ├── layout.tsx
│   │   └── page.tsx           # Landing page / Redirect
│   ├── components/            # Komponen UI reusable
│   │   ├── kiosk/             # Komponen katalog & modal order kiosk
│   │   ├── production/        # Kanban / stepper antrean produksi
│   │   ├── ui/                # Tombol, input, modal, badge
│   │   └── layout/            # Navbar, sidebar, footer
│   ├── db/                    # Drizzle ORM & skema database
│   │   ├── index.ts           # Koneksi Neon Postgres
│   │   ├── schema.ts          # Definisi tabel PostgreSQL
│   │   └── seed.ts            # Data awal (katalog, user demo)
│   ├── lib/                   # Utility, auth session, helpers
│   │   ├── auth.ts            # Otentikasi & verifikasi JWT/cookie
│   │   ├── constants.ts       # Template ukuran pakaian & tahapan
│   │   └── utils.ts           # Helper format mata uang, tanggal, dsb
│   └── types/                 # Definisi tipe data TypeScript
├── drizzle.config.ts          # Konfigurasi Drizzle Kit
├── package.json
└── tailwind.config.ts
```

## 2. Skema Relasi Database (Neon PostgreSQL)

### Tabel `users`
- `id` (serial / uuid, primary key)
- `name` (text, not null)
- `email` (text, unique, not null)
- `password_hash` (text, not null)
- `role` (enum: `'pemilik'`, `'karyawan'`)
- `created_at` (timestamp, default now)

### Tabel `customers`
- `id` (serial / uuid, primary key)
- `name` (text, not null)
- `phone` (text, not null) — nomor WhatsApp untuk pelacakan
- `address` (text, nullable)
- `created_at` (timestamp, default now)

### Tabel `catalog_items`
- `id` (serial / uuid, primary key)
- `name` (text, not null)
- `category` (enum: `'kemeja'`, `'jas'`, `'gamis'`, `'celana'`, `'kaos_seragam'`)
- `base_price` (integer, not null)
- `description` (text)
- `measurement_fields` (jsonb, not null) — daftar parameter ukuran wajib
- `image_url` (text, placeholder grafis bersih)
- `is_active` (boolean, default true)

### Tabel `orders`
- `id` (serial / uuid, primary key)
- `spk_number` (text, unique, not null) — contoh: `SPK-202610-001`
- `customer_id` (foreign key -> `customers.id`)
- `status_payment` (enum: `'unpaid'`, `'dp'`, `'paid'`)
- `total_price` (integer, not null)
- `down_payment` (integer, default 0)
- `deadline` (date, not null)
- `notes` (text)
- `created_at` (timestamp, default now)

### Tabel `order_items`
- `id` (serial / uuid, primary key)
- `order_id` (foreign key -> `orders.id` on delete cascade)
- `catalog_item_id` (foreign key -> `catalog_items.id`)
- `item_name` (text, not null)
- `fabric_type` (text, not null)
- `quantity` (integer, default 1)
- `unit_price` (integer, not null)
- `measurements` (jsonb, not null) — data riil ukuran tubuh

### Tabel `production_stages`
- `id` (serial / uuid, primary key)
- `order_item_id` (foreign key -> `order_items.id` on delete cascade)
- `stage` (enum: `'cutting'`, `'sewing'`, `'qc'`, `'packing'`, `'ready'`)
- `status` (enum: `'pending'`, `'in_progress'`, `'completed'`)
- `assigned_to` (foreign key -> `users.id`, nullable)
- `notes` (text)
- `started_at` (timestamp, nullable)
- `completed_at` (timestamp, nullable)
- `sequence` (integer, not null) — urutan tahap 1 s.d. 5

## 3. Alur Kerja Data (Data Flow)
1. **Pemesanan Kiosk**:
   - Pelanggan/Admin pilih pakaian dari Katalog -> Pilih bahan -> Input ukuran badan (real-time validasi) -> Input identitas -> Simpan order & cetak nomor SPK.
   - Otomatis membuat 5 entri `production_stages` (`cutting` s.d `ready`).
2. **Eksekusi Produksi**:
   - Karyawan buka tab Produksi -> Ambil antrean -> Ubah status `in_progress` -> Setelah kelar ubah ke `completed`.
   - Tahap berikutnya otomatis terbuka/aktif.
3. **Pelacakan Publik**:
   - Halaman `/track` memanggil server function mencari SPK -> Menghitung persentase progres dan status per tahap.
