"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { Scissors, ShieldCheck, UserCheck, KeyRound, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.success) {
      if (res.role === "pemilik") {
        router.push("/admin");
      } else {
        router.push("/produksi");
      }
    }
  };

  const handleFillDemo = (type: "pemilik" | "karyawan") => {
    if (type === "pemilik") {
      setEmail("pemilik@penjahitku.com");
      setPassword("admin123");
    } else {
      setEmail("karyawan@penjahitku.com");
      setPassword("karyawan123");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <Scissors className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Masuk Sistem PenjahitKu
          </h1>
          <p className="text-xs text-neutral-500">
            Akses khusus Pemilik Toko & Staf Penjahit Operasional.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Email Staf / Pemilik:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@penjahitku.com"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Kata Sandi:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neutral-900 hover:bg-blue-600 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-4 border-t border-neutral-100 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block text-center">
            Shortcut Akun Demo
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("pemilik")}
              className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white text-left text-xs space-y-0.5 transition-colors"
            >
              <div className="flex items-center gap-1 font-bold text-neutral-900">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Pemilik</span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate">pemilik@penjahitku.com</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("karyawan")}
              className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white text-left text-xs space-y-0.5 transition-colors"
            >
              <div className="flex items-center gap-1 font-bold text-neutral-900">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Karyawan</span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate">karyawan@penjahitku.com</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
