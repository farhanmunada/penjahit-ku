import Link from "next/link";
import { Scissors, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
                <Scissors className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-extrabold text-base text-neutral-900">
                Penjahit<span className="text-blue-600">Ku</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Sistem manajemen garment & konveksi custom. Pemesanan modern kiosk, database ukuran presisi, dan pelacakan 5 tahap produksi real-time.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Layanan</h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <Link href="/katalog" className="hover:text-blue-600 transition-colors">
                  Katalog Pemesanan Kiosk
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-blue-600 transition-colors">
                  Lacak Resi / SPK
                </Link>
              </li>
              <li>
                <Link href="/produksi" className="hover:text-blue-600 transition-colors">
                  Antrean Pengerjaan Jahit
                </Link>
              </li>
            </ul>
          </div>

          {/* Standar Mutu */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Komitmen</h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pola & Ukuran Presisi Custom</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Garansi Tepat Waktu Sesuai SPK</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                <span>Workshop Konveksi Mandiri</span>
              </li>
            </ul>
          </div>

          {/* Akun Demo */}
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-1.5">
            <span className="font-semibold text-neutral-800 block">Kredensial Login Internal:</span>
            <div className="text-[11px] text-neutral-600 font-mono">
              <div>Pemilik: <span className="text-neutral-900 font-bold">pemilik@penjahitku.com</span> / admin123</div>
              <div>Karyawan: <span className="text-neutral-900 font-bold">karyawan@penjahitku.com</span> / karyawan123</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400">
          <span>&copy; {new Date().getFullYear()} PenjahitKu. Clean Kiosk Garment System.</span>
          <span className="mt-2 sm:mt-0">Next.js 15 App Router &bull; Neon Serverless Postgres &bull; Drizzle ORM</span>
        </div>
      </div>
    </footer>
  );
}
