import Link from "next/link";
import {
  Scissors,
  Sparkles,
  Search,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Ruler,
  Clock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white pt-16 pb-12 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Garment & Konveksi Custom &bull; Clean White Kiosk</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.1]">
              Pemesanan Pakaian Custom dengan Presisi{" "}
              <span className="text-blue-600 underline decoration-blue-200 decoration-wavy">
                Ukuran Tailor
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Katalog mandiri bergaya kiosk modern, penyimpanan ukuran tubuh fleksibel, dan transparansi pelacakan 5 tahapan produksi jahit real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/katalog"
              className="w-full sm:w-auto px-7 py-3.5 bg-neutral-900 hover:bg-blue-600 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-neutral-900/10 flex items-center justify-center gap-2 transition-all"
            >
              <span>Mulai Pesan (Kiosk Mode)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/track"
              className="w-full sm:w-auto px-7 py-3.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4 text-neutral-500" />
              <span>Lacak Nomor SPK</span>
            </Link>
          </div>

          {/* Direct Quick Tracking Input Box */}
          <div className="max-w-md mx-auto pt-4">
            <form
              action="/track"
              method="GET"
              className="p-1.5 bg-white border border-neutral-200 rounded-2xl shadow-md flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="spk"
                  placeholder="Cek cepat No. SPK (cth: SPK-2610-1001)..."
                  className="w-full pl-10 pr-3 py-2 text-xs font-semibold focus:outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap"
              >
                Cek Status
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5-STAGE PRODUCTION PIPELINE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Standar Pengerjaan Garment
            </span>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              5 Tahap Produksi Jahitan Transparan
            </h2>
            <p className="text-xs text-neutral-500">
              Setiap pakaian melewati 5 stasiun kerja terukur yang tercatat dalam sistem SPK digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4">
            {[
              {
                num: "01",
                name: "Pola & Cutting",
                desc: "Kain dipotong presisi mengikuti ukuran kustom badan pemesan.",
              },
              {
                num: "02",
                name: "Proses Jahit",
                desc: "Perakitan komponen, obras, kancing, dan resleting dobel kuat.",
              },
              {
                num: "03",
                name: "Quality Control",
                desc: "Pembersihan sisa benang & verifikasi kesesuaian sentimeter ukuran.",
              },
              {
                num: "04",
                name: "Finishing & Pack",
                desc: "Setrika uap suhu optimal, tagging label, dan bungkus plastik.",
              },
              {
                num: "05",
                name: "Siap Ambil / Kirim",
                desc: "Pesanan siap diserahkan ke pelanggan atau dikirim kurir.",
              },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 relative group hover:bg-white hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="font-mono text-xs font-black text-blue-600 bg-white border border-neutral-200 w-8 h-8 rounded-lg flex items-center justify-center shadow-2xs">
                  {step.num}
                </div>
                <h3 className="font-extrabold text-sm text-neutral-900 pt-1">{step.name}</h3>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-neutral-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Ruler className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900">
              Form Ukuran Dinamis Per Kategori
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Parameter ukuran jas berbeda dengan kemeja atau gamis. Sistem menyesuaikan field secara cerdas lengkap dengan preset instan.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-neutral-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900">
              Akses Berbasis Peran (RBAC)
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Hak akses terpisah antara <strong>Pemilik</strong> (kelola katalog, pembayaran, & keuangan) dan <strong>Karyawan</strong> (pemutakhiran antrean jahit).
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-neutral-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900">
              Portal Lacak Publik Pelanggan
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Pelanggan cukup memasukkan nomor SPK atau nomor WhatsApp untuk melihat persentase penyelesaian dan catatan pengerjaan operator.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Mulai Alur Kiosk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Siap Memesan Pakaian Custom Anda?
            </h2>
            <p className="text-xs text-neutral-400 max-w-md">
              Buka katalog interaktif, pilih kain favorit, dan input ukuran tubuh dalam hitungan menit.
            </p>
          </div>
          <Link
            href="/katalog"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all whitespace-nowrap active:scale-95"
          >
            Buka Katalog Kiosk
          </Link>
        </div>
      </section>
    </div>
  );
}
