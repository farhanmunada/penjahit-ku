# Product Requirements Document (PRD): Sistem Garment & Konveksi (PenjahitKu)

## 1. Ringkasan & Tujuan Produk (Objective)
Membangun sistem konveksi dan garment terpadu untuk mengelola pesanan custom pakaian, penyimpanan ukuran badan kustom, pelacakan proses produksi per tahap (potong, jahit, QC, packing), katalog interaktif bergaya modern kiosk (inspirasi McDonald's self-order flow dengan tampilan clean putih modern), kontrol akses berbasis peran (Pemilik vs Karyawan), dan pelacakan status pesanan publik untuk pelanggan.

## 2. Pengguna & Hak Akses (User Roles)
1. **Pemilik (Owner)**:
   - Mengelola akun staf/karyawan.
   - Mengelola katalog pakaian, harga dasar, dan template pengukuran.
   - Melihat seluruh pesanan, status pembayaran (Belum Bayar, DP, Lunas), dan riwayat produksi.
   - Mengelola dan mengubah status pesanan.
2. **Karyawan (Staff / Penjahit)**:
   - Melihat daftar tugas antrean produksi sesuai tahapannya.
   - Memperbarui progres produksi (Memulai pengerjaan, selesai pengerjaan per tahap, menambah catatan kendala).
3. **Pelanggan (Publik / Customer)**:
   - Melihat katalog produk pakaian konveksi dengan visual bersih.
   - Menelusuri status pengerjaan pakaian melalui nomor SPK/WhatsApp di halaman publik `/track`.

## 3. Fitur Utama & Kebutuhan Fungsional

### A. Katalog & Alur Pemesanan Interaktif (Kiosk-Style)
- Tampilan katalog berbasis kartu besar dengan background putih bersih (`#ffffff`), aksen slate/indigo modern, tipografi tegas.
- Filter berdasarkan kategori: Kemeja, Jas & Blazer, Gamis & Busana Muslim, Celana Formal/Chino, Kaos & Seragam.
- Modal Alur Pemesanan Step-by-Step:
  1. *Step 1*: Pemilihan model pakaian & deskripsi.
  2. *Step 2*: Pemilihan opsi kain/bahan (Katun Toyobo, Drill, Wool Silk, Linen, dll).
  3. *Step 3*: Form input ukuran tubuh dinamis (menampilkan field sesuai jenis pakaian + panduan cara ukur).
  4. *Step 4*: Input identitas pelanggan & rincian pesanan.
  5. *Step 5*: Konfirmasi & Pembuatan SPK (Surat Perintah Kerja).

### B. Manajemen Ukuran Tubuh Dinamis (Custom Measurements)
- Setiap kategori pakaian memiliki parameter ukuran default yang disimpan dalam format fleksibel:
  - **Kemeja/Jas**: Lingkar dada, lingkar pinggang, lebar bahu, panjang baju, panjang lengan, lingkar leher, lingkar ketiak.
  - **Celana**: Lingkar pinggang, lingkar pinggul, panjang celana, lingkar paha, lebar ujung kaki, pesak.
  - **Gamis/Gaun**: Lingkar dada, panjang gamis, lingkar pinggang, lebar bahu, panjang lengan, lingkar bawah.
- Fleksibel untuk penambahan catatan khusus (misal: "bahu kanan agak turun 1cm").

### C. Pelacakan Tahap Produksi (Production Pipeline)
- Pipeline tahapan standar konveksi:
  1. `CUTTING` (Pola & Potong Bahan)
  2. `SEWING` (Proses Jahit)
  3. `QC` (Pemeriksaan Kualitas & Finishing benang)
  4. `PACKING` (Setrika uap & Pengemasan)
  5. `READY` (Selesai & Siap Diambil/Kirim)
- Status tiap tahap: `PENDING`, `IN_PROGRESS`, `COMPLETED`.
- Pencatatan operator/karyawan penanggung jawab dan stempel waktu selesai.

### D. Portal Tracking Publik (`/track`)
- Pencarian cepat via Nomor SPK (cth: `SPK-202610-001`) atau Nomor WhatsApp.
- Visual stepper progres produksi transparan untuk kepuasan pelanggan.

### E. Autentikasi & Keamanan
- Login multi-role (`pemilik` dan `karyawan`).
- Proteksi route berbasis cookie session HTTP-only terenkripsi.

## 4. Spesifikasi Teknis & Stack
- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Database**: Neon Serverless Postgres
- **ORM**: Drizzle ORM + `@neondatabase/serverless`
- **Styling**: Tailwind CSS + `lucide-react`
- **Validasi**: Zod

## 5. Batasan & Aturan (Boundaries)
- **Selalu lakukan**: Validasi input form di sisi server, enkripsi password (hash), gunakan parameter query aman di Drizzle.
- **Konfirmasi dulu**: Perubahan struktur tabel inti setelah migrasi dijalankan.
- **Jangan lakukan**: Menyimpan credential/connection string database langsung di kode (wajib via `.env.local`).

## 6. Kriteria Keberhasilan (Success Criteria)
1. Aplikasi Next.js berjalan tanpa error typecheck (`tsc --noEmit`) dan build berhasil (`npm run build`).
2. Skema database Drizzle terdefinisi lengkap dan sinkron dengan Neon Postgres.
3. Alur katalog modern kiosk dapat digunakan untuk memilih model, input bahan, mengisi ukuran custom, dan membuat pesanan.
4. Dashboard pemilik dan karyawan dapat memproses antrean tahapan jahit dari `CUTTING` sampai `READY`.
5. Halaman publik `/track` menampilkan progres riil dari database berdasarkan nomor SPK.
