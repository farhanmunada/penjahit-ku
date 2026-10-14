"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrderBySpkOrPhone } from "@/app/actions/order";
import { STAGES_CONFIG, MEASUREMENT_DICTIONARY } from "@/lib/constants";
import { formatRupiah, formatDate } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  Clock,
  CircleDashed,
  Scissors,
  User,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function TrackingView({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);

  const handleSearch = useCallback(async (targetQuery?: string) => {
    const q = targetQuery !== undefined ? targetQuery : query;
    if (!q.trim()) return;

    setLoading(true);
    setSearched(true);
    const result = await getOrderBySpkOrPhone(q);
    setOrder(result);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  const getStageStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Selesai",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        };
      case "in_progress":
        return {
          label: "Sedang Dikerjakan",
          color: "bg-blue-50 text-blue-700 border-blue-200 animate-pulse",
          icon: <Clock className="w-4 h-4 text-blue-600" />,
        };
      default:
        return {
          label: "Menunggu Antrean",
          color: "bg-neutral-50 text-neutral-500 border-neutral-200",
          icon: <CircleDashed className="w-4 h-4 text-neutral-400" />,
        };
    }
  };

  // Calculate overall progress percentage
  const calculateProgress = () => {
    if (!order?.items?.[0]?.stages) return 0;
    const stages = order.items[0].stages;
    const completedCount = stages.filter((s: any) => s.status === "completed").length;
    const inProgressCount = stages.filter((s: any) => s.status === "in_progress").length;
    return Math.round(((completedCount + inProgressCount * 0.5) / stages.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Scissors className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Lacak Status Produksi Jahitan
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Masukkan Nomor SPK (cth: <span className="font-mono text-neutral-800">SPK-2610-1001</span>) atau Nomor WhatsApp yang didaftarkan.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto pt-2"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nomor SPK atau No. WhatsApp..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-blue-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            {loading ? "Mencari..." : "Lacak Pesanan"}
          </button>
        </form>

        {/* Quick Sample Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              setQuery("SPK-2610-1001");
              handleSearch("SPK-2610-1001");
            }}
            className="text-[11px] text-blue-600 hover:underline font-mono"
          >
            Coba demo data: SPK-2610-1001
          </button>
        </div>
      </div>

      {/* RESULT SECTION */}
      {searched && !order && !loading && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-extrabold text-neutral-900 text-sm">Pesanan Tidak Ditemukan</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Pastikan nomor SPK atau nomor WhatsApp sesuai dengan tanda bukti pesanan yang Anda miliki.
          </p>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Surat Perintah Kerja (SPK)
                </span>
                <h2 className="text-2xl font-black text-neutral-900 font-mono tracking-tight">
                  {order.spkNumber}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                    order.statusPayment === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : order.statusPayment === "dp"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {order.statusPayment === "paid"
                    ? "Lunas"
                    : order.statusPayment === "dp"
                    ? "Uang Muka (DP)"
                    : "Belum Bayar"}
                </span>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full">
                  Progress: {calculateProgress()}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                <span>Tahapan Produksi Berjalan</span>
                <span>{calculateProgress()}% Selesai</span>
              </div>
              <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>

            {/* 5-STAGE VISUAL STEPPER */}
            <div className="pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
                Pelacakan 5 Tahap Jahit
              </h3>

              <div className="space-y-4">
                {STAGES_CONFIG.map((conf) => {
                  const currentItemStages = order.items?.[0]?.stages || [];
                  const stageData = currentItemStages.find((s: any) => s.stage === conf.key);
                  const status = stageData?.status || "pending";
                  const statusInfo = getStageStatusInfo(status);

                  return (
                    <div
                      key={conf.key}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        status === "in_progress"
                          ? "bg-blue-50/50 border-blue-300 ring-1 ring-blue-300 shadow-sm"
                          : status === "completed"
                          ? "bg-neutral-50/70 border-neutral-200"
                          : "bg-white border-neutral-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            status === "completed"
                              ? "bg-emerald-600 text-white"
                              : status === "in_progress"
                              ? "bg-blue-600 text-white animate-bounce"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {conf.sequence}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-neutral-900">{conf.label}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${statusInfo.color}`}
                            >
                              {statusInfo.icon}
                              <span>{statusInfo.label}</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500">{conf.desc}</p>
                          {stageData?.notes && (
                            <p className="text-[11px] text-blue-700 font-medium mt-1">
                              Catatan pengerjaan: &ldquo;{stageData.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Operator & Time */}
                      <div className="text-left sm:text-right text-[11px] text-neutral-500 space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                        {stageData?.operatorName && (
                          <div className="font-semibold text-neutral-800">
                            Operator: {stageData.operatorName}
                          </div>
                        )}
                        {stageData?.completedAt && (
                          <div className="text-emerald-700 font-medium">
                            Selesai: {formatDate(stageData.completedAt)}
                          </div>
                        )}
                        {stageData?.startedAt && !stageData.completedAt && (
                          <div className="text-blue-700 font-medium">
                            Mulai: {formatDate(stageData.startedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details & Custom Measurements */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Rincian Spesifikasi Busana
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                  <User className="w-3 h-3" /> Pemesan
                </span>
                <span className="font-bold text-xs text-neutral-900 block truncate">
                  {order.customer?.name}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {order.customer?.phone}
                </span>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Target Selesai
                </span>
                <span className="font-bold text-xs text-neutral-900 block">
                  {formatDate(order.deadline)}
                </span>
                <span className="text-[11px] text-neutral-500">Estimasi tepat waktu</span>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Total Biaya
                </span>
                <span className="font-black text-xs text-neutral-900 block">
                  {formatRupiah(order.totalPrice)}
                </span>
                <span className="text-[11px] text-neutral-500">
                  DP: {formatRupiah(order.downPayment || 0)}
                </span>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Standar Mutu
                </span>
                <span className="font-bold text-xs text-emerald-700 block">Custom Tailor</span>
                <span className="text-[11px] text-neutral-500">Jahitan dobel stik</span>
              </div>
            </div>

            {/* Items and Measurement list */}
            <div className="space-y-4 pt-2">
              {order.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-5 border border-neutral-200 rounded-2xl bg-neutral-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-neutral-900">{item.itemName}</h4>
                      <p className="text-xs text-neutral-500">
                        Bahan: <span className="font-semibold text-neutral-700">{item.fabricType}</span> &bull; Jumlah: {item.quantity} pcs
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMeasurements((s) => !s)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <span>{showMeasurements ? "Tutup Data Ukuran" : "Lihat Ukuran Badan"}</span>
                      {showMeasurements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Accordion measurement parameters */}
                  {showMeasurements && item.measurements && (
                    <div className="pt-3 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {Object.entries(item.measurements).map(([k, v]) => (
                        <div
                          key={k}
                          className="p-2.5 bg-white rounded-xl border border-neutral-200 text-xs"
                        >
                          <span className="text-[10px] text-neutral-400 block font-medium">
                            {MEASUREMENT_DICTIONARY[k]?.label || k}
                          </span>
                          <span className="font-extrabold text-neutral-900 text-sm">
                            {v as string} cm
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
