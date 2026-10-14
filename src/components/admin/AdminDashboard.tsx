"use client";

import { useState } from "react";
import { updatePaymentStatus } from "@/app/actions/order";
import { formatRupiah, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  ExternalLink,
  DollarSign,
  User,
  Phone,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const s = search.toLowerCase();
    return (
      o.spkNumber.toLowerCase().includes(s) ||
      o.customer?.name?.toLowerCase().includes(s) ||
      o.customer?.phone?.includes(s)
    );
  });

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalPaid = orders
    .filter((o) => o.statusPayment === "paid")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const activeCount = orders.filter((o) => o.statusPayment !== "paid").length;
  const totalOrders = orders.length;

  const handlePaymentChange = async (orderId: string, status: "unpaid" | "dp" | "paid") => {
    setUpdatingId(orderId);
    await updatePaymentStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, statusPayment: status } : o))
    );
    setUpdatingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
            Panel Pemilik Konveksi
          </span>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Manajemen Pesanan & Keuangan
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola status pembayaran, SPK pengerjaan, dan ringkasan omset garment.
          </p>
        </div>

        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all"
        >
          <span>Buat Pesanan Baru (Kiosk)</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Nilai Pesanan
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 font-mono">
            {formatRupiah(totalRevenue)}
          </div>
          <span className="text-[11px] text-neutral-500 block">Akumulasi seluruh SPK</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Omset Lunas
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {formatRupiah(totalPaid)}
          </div>
          <span className="text-[11px] text-neutral-500 block">Telah dibayar penuh</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Pesanan Belum Lunas
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">{activeCount} SPK</div>
          <span className="text-[11px] text-neutral-500 block">Status Belum / Uang Muka DP</span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Order Terdaftar
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 font-mono">{totalOrders} Pesanan</div>
          <span className="text-[11px] text-neutral-500 block">Dari database konveksi</span>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-neutral-900 text-base">Daftar Seluruh Pesanan (SPK)</h3>
            <p className="text-xs text-neutral-500">
              Ubah status pembayaran dan telusuri progres produksi per pesanan.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari SPK / Nama / No. WA..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">No. SPK</th>
                <th className="py-3 px-4 font-bold">Pelanggan</th>
                <th className="py-3 px-4 font-bold">Item Busana</th>
                <th className="py-3 px-4 font-bold">Deadline</th>
                <th className="py-3 px-4 font-bold">Total Biaya</th>
                <th className="py-3 px-4 font-bold">Status Bayar</th>
                <th className="py-3 px-4 font-bold text-right">Aksi & Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    Tidak ada pesanan ditemukan.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {ord.spkNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">{ord.customer?.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {ord.customer?.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.items?.map((it: any, i: number) => (
                        <div key={i} className="text-neutral-700 font-medium">
                          {it.itemName} ({it.quantity} pcs)
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 font-medium whitespace-nowrap">
                      {formatDate(ord.deadline)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-neutral-900 whitespace-nowrap">
                      {formatRupiah(ord.totalPrice)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <select
                          disabled={updatingId === ord.id}
                          value={ord.statusPayment}
                          onChange={(e) =>
                            handlePaymentChange(
                              ord.id,
                              e.target.value as "unpaid" | "dp" | "paid"
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors focus:outline-none ${
                            ord.statusPayment === "paid"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : ord.statusPayment === "dp"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          <option value="unpaid">Belum Bayar</option>
                          <option value="dp">Uang Muka (DP)</option>
                          <option value="paid">Lunas</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/track?spk=${ord.spkNumber}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-[11px] transition-colors"
                      >
                        <span>Lacak</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
