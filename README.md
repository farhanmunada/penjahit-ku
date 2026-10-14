# PenjahitKu - Sistem Garment dan Konveksi Custom

Sistem manajemen konveksi dan garment untuk menangani pesanan pakaian custom, pencatatan ukuran tubuh dinamis, katalog interaktif dengan alur pemesanan mandiri bergaya kiosk, pelacakan proses produksi 5 tahap secara real-time, serta kontrol akses berbasis peran (Pemilik dan Karyawan).

---

## Fitur Utama

1. **Katalog Pemesanan Kiosk**
   - Tampilan bersih dengan dasar warna putih modern dan kontras jelas.
   - Pilihan kategori pakaian: Kemeja, Jas, Gamis, Celana, Kaos dan Seragam.
   - Modal alur bertahap: Pemilihan bahan kain, kuantitas, input ukuran tubuh kustom, dan pembuatan Surat Perintah Kerja (SPK).

2. **Penyimpanan Ukuran Badan Dinamis**
   - Parameter ukuran otomatis menyesuaikan jenis pakaian (lingkar dada, panjang lengan, lingkar pinggang, pesak, dll).
   - Dilengkapi tombol preset cepat ukuran standar (S, M, L, XL) dan opsi input manual dengan panduan cara ukur.

3. **Pelacakan 5 Tahap Produksi Jahitan**
   - Alur pengerjaan berurutan:
     1. Pola dan Potong Bahan (Cutting)
     2. Proses Jahit (Sewing)
     3. Quality Control (QC)
     4. Finishing dan Packing (Packing)
     5. Siap Diambil atau Kirim (Ready)
   - Status per tahap: Pending, In Progress, Completed.
   - Pencatatan nama operator penjahit dan catatan kendala produksi.

4. **Portal Lacak Publik Pelanggan**
   - Akses via `/track`.
   - Pencarian melalui Nomor SPK (contoh: `SPK-2610-1001`) atau Nomor WhatsApp.
   - Progress bar persentase penyelesaian dan stepper visual status tiap stasiun kerja.

5. **Autentikasi dan Hak Akses (RBAC)**
   - Role Pemilik: Akses ringkasan omset keuangan, kelola status pembayaran pesanan (Belum Bayar, DP, Lunas), dan seluruh riwayat SPK.
   - Role Karyawan: Akses antrean kerja operasional jahit dan pemutakhiran status produksi.

---

## Teknologi yang Digunakan

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Styling**: Tailwind CSS
- **Ikon**: Lucide React
- **Autentikasi**: JWT Session (`jose`) dan Hashing Password (`bcryptjs`)

---

## Struktur Folder

```
penjahit-ku/
├── docs/                      # Dokumen PRD, Riset, dan Arsitektur
├── src/
│   ├── app/
│   │   ├── (auth)/login/      # Halaman masuk staf dan pemilik
│   │   ├── actions/           # Next.js Server Actions (Auth, Catalog, Order, Production)
│   │   ├── admin/             # Dashboard manajemen pemilik
│   │   ├── katalog/           # Katalog interaktif pemesanan kiosk
│   │   ├── produksi/          # Antrean kerja operasional jahit
│   │   ├── track/             # Portal pelacakan publik pelanggan
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Halaman utama
│   ├── components/            # Komponen antarmuka (Kiosk, Track, Production, Admin, Layout)
│   ├── db/                    # Skema Drizzle dan konfigurasi database Neon
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── lib/                   # Utilitas, otentikasi JWT, dan kamus parameter ukuran
│   └── types/
├── tests/                     # Unit test dan self-check
├── drizzle.config.ts
├── package.json
└── tailwind.config.ts
```

---

## Instalasi dan Menjalankan Projek

### 1. Kloning Repository
```bash
git clone https://github.com/farhanmunada/penjahit-ku.git
cd penjahit-ku
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (.env)
Salin `.env.example` ke `.env`:
```bash
cp .env.example .env
```

Isi konfigurasi berikut:
```env
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="kombinasi-string-acak-rahasia-minimal-32-karakter"
```

Untuk menghasilkan `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Migrasi Skema Database ke Neon
```bash
npm run db:push
```

### 5. Jalankan Seeding Data Awal (Opsional)
Menyiapkan akun pemilik, staf penjahit, pelanggan demo, dan SPK contoh tanpa mengisi katalog:
```bash
npm run db:seed
```

### 6. Jalankan Server Pengembangan
```bash
npm run dev
```
Akses aplikasi melalui peramban di `http://localhost:3000`.

---

## Akun Demo Bawaan

| Peran | Email | Kata Sandi | Halaman Utama |
|---|---|---|---|
| Pemilik | pemilik@penjahitku.com | admin123 | `/admin` |
| Karyawan | karyawan@penjahitku.com | karyawan123 | `/produksi` |

Nomor SPK contoh untuk pelacakan langsung di `/track`:
- `SPK-2610-1001` (Kemeja Formal Slim Fit - Tahap Jahit)
- `SPK-2610-1002` (Gamis A-Line Flowy - Tahap QC)
- `SPK-2610-1003` (Jas Executive - Tahap Meja Potong)
- `SPK-2610-1004` (Celana Chino - Tahap Siap Diambil)

---

## Perintah Pengujian dan Verifikasi Mutu

- **Uji Logika dan Unit Test**: `npm test`
- **Pemeriksaan Tipe TypeScript**: `npx tsc --noEmit`
- **Linting Kode**: `npm run lint`
- **Kompilasi Produksi**: `npm run build`
