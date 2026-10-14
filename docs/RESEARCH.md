# Riset Teknis: Sistem Konveksi & Garment (PenjahitKu)

## 1. Analisis Kebutuhan & Konteks Projek
- **Tipe Projek**: Web application internal + publik untuk manajemen pesanan konveksi/garment custom.
- **Kondisi Awal**: Greenfield repository (hanya ada `AGENTS.md`). Node.js v24.13.0, npm 11.6.2.
- **Karakteristik Bisnis**:
  - Pelanggan memesan pakaian custom (Kemeja, Jas, Gamis, Celana, Kaos/Seragam).
  - Setiap jenis pakaian memiliki template ukuran berbeda (misal: jas butuh lingkar dada, panjang bahu, lingkar ketiak; celana butuh lingkar pinggang, panjang celana, pesak).
  - Siklus produksi berurutan: Pemotongan (Cutting) -> Jahit (Sewing) -> Quality Control (QC) -> Pengemasan (Packing) -> Siap Diambil/Kirim (Ready).
  - Hak akses: Pemilik (Full akses, kelola staf, kelola katalog & harga, laporan) dan Karyawan (Update progres jahit/tahap kerja).
  - Antarmuka Pemesanan: Mengadopsi alur self-service kiosk modern (seperti kiosk McDonald's) — clean white base (`#FFFFFF`, `#F8FAFC`, border `#E2E8F0`), kartu pakaian visual jelas, modal konfigurasi bahan & ukuran dinamis step-by-step.
  - Tracking Publik: Halaman `/track` untuk pelanggan mengecek status real-time via No. SPK / No. WhatsApp.

## 2. Pilihan Teknologi & Evaluasi

### A. Framework: Next.js 15 (App Router, React 19, TypeScript)
- **Alasan**: Server Components untuk fetch data cepat, Server Actions untuk mutasi data aman, API Routes untuk endpoint modular, performa SSR/SSG optimal untuk halaman publik.

### B. Database & ORM: Neon Postgres + Drizzle ORM
- **Driver**: `@neondatabase/serverless` (HTTP/WebSocket driver optimal untuk serverless).
- **ORM**: `drizzle-orm` + `drizzle-kit`.
- **Alasan**: Schema-as-code berbasis TypeScript murni, tanpa overhead runtime berat, migrasi SQL transparan, dukungan `jsonb` sangat baik untuk data pengukuran kustom yang dinamis.

### C. Autentikasi & Otorisasi (RBAC)
- **Pendekatan**: Session berbasis cookie terenkripsi / JWT aman (`jose` + web crypto / `bcryptjs` untuk password hashing).
- **Role**:
  - `pemilik`: Akses dashboard admin, master data katalog, laporan keuangan, audit pengerjaan.
  - `karyawan`: Akses antrean kerja operasional dan update status tahapan.

### D. Desain Antarmuka (UI/UX)
- **Gaya**: Modern Minimalist Kiosk — clean white base, kontras tipografi tajam, kartu besar interaktif, step wizard untuk pengukuran.
- **Styling**: Tailwind CSS + `lucide-react` icons.

## 3. Rencana Keamanan & Validasi
- Validasi input menggunakan `zod` di boundary Server Actions / API.
- Proteksi route berbasis middleware & pemeriksaan role di server layer.
- Deny-first: File rahasia (`.env`) tidak dimasukkan ke version control.
