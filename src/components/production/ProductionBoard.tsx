"use client";

import { useState } from "react";
import { type ProductionItemView, updateStageStatus } from "@/app/actions/production";
import { STAGES_CONFIG, MEASUREMENT_DICTIONARY } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  Layers,
  Clock,
  CheckCircle2,
  Play,
  Ruler,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductionBoard({ initialItems }: { initialItems: ProductionItemView[] }) {
  const router = useRouter();
  const [selectedStageFilter, setSelectedStageFilter] = useState("all");
  const [items, setItems] = useState<ProductionItemView[]>(initialItems);
  const [activeMeasurementId, setActiveMeasurementId] = useState<string | null>(null);

  // Operator input state for modal / prompt
  const [actingItem, setActingItem] = useState<{
    stageId: string;
    action: "start" | "complete";
  } | null>(null);
  const [operatorName, setOperatorName] = useState("");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredItems =
    selectedStageFilter === "all"
      ? items
      : items.filter((i) => i.stage === selectedStageFilter);

  const handleActionSubmit = async () => {
    if (!actingItem) return;

    setIsUpdating(true);
    const newStatus = actingItem.action === "start" ? "in_progress" : "completed";
    await updateStageStatus(actingItem.stageId, newStatus, operatorName, notes);

    // Update local state optimistically
    setItems((prev) =>
      prev.map((i) => {
        if (i.stageId === actingItem.stageId) {
          return {
            ...i,
            status: newStatus,
            operatorName: operatorName || i.operatorName,
            notes: notes || i.notes,
            startedAt: newStatus === "in_progress" ? new Date().toISOString() : i.startedAt,
            completedAt: newStatus === "completed" ? new Date().toISOString() : i.completedAt,
          };
        }
        return i;
      })
    );

    setIsUpdating(false);
    setActingItem(null);
    setOperatorName("");
    setNotes("");
    router.refresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Antrean Produksi & Jahit
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Pantau dan perbarui status pengerjaan pakaian per tahap (Potong &rarr; Jahit &rarr; QC &rarr; Packing).
          </p>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-white border border-neutral-200 px-3.5 py-2 rounded-xl shadow-sm">
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">Total Antrean</span>
            <span className="font-extrabold text-neutral-900 text-sm">{items.length} Pekerjaan</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3.5 py-2 rounded-xl">
            <span className="text-blue-600 block text-[10px] uppercase font-bold">Sedang Diproses</span>
            <span className="font-extrabold text-sm">
              {items.filter((i) => i.status === "in_progress").length} Item
            </span>
          </div>
        </div>
      </div>

      {/* Stage Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        <button
          onClick={() => setSelectedStageFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedStageFilter === "all"
              ? "bg-neutral-900 text-white shadow-sm"
              : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
          }`}
        >
          Semua Tahap ({items.length})
        </button>
        {STAGES_CONFIG.map((conf) => {
          const count = items.filter((i) => i.stage === conf.key).length;
          const isActive = selectedStageFilter === conf.key;
          return (
            <button
              key={conf.key}
              onClick={() => setSelectedStageFilter(conf.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <span>{conf.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Production Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-800">Tidak ada antrean pada tahap ini</h3>
          <p className="text-xs text-neutral-400">
            Semua pesanan di tahap ini telah selesai dikerjakan atau belum mencapai tahapan ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const conf = STAGES_CONFIG.find((s) => s.key === item.stage);
            const isAccordionOpen = activeMeasurementId === item.stageId;

            return (
              <div
                key={item.stageId}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm ${
                  item.status === "in_progress"
                    ? "border-blue-500 ring-2 ring-blue-500/10 shadow-md"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {/* Header */}
                <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      {item.spkNumber}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">
                      Tahap {item.sequence}/5
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      item.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : item.status === "in_progress"
                        ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                        : "bg-neutral-100 text-neutral-600 border-neutral-200"
                    }`}
                  >
                    {item.status === "completed"
                      ? "Selesai"
                      : item.status === "in_progress"
                      ? "Sedang Dikerjakan"
                      : "Antrean"}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <h3 className="font-black text-neutral-900 text-base">{item.itemName}</h3>
                    <p className="text-xs text-neutral-500">
                      Bahan: <span className="font-semibold text-neutral-700">{item.fabricType}</span> &bull; {item.quantity} pcs
                    </p>
                  </div>

                  {/* Customer & Deadline */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div>
                      <span className="text-neutral-400 block font-medium flex items-center gap-1">
                        <User className="w-3 h-3" /> Pemesan
                      </span>
                      <span className="font-bold text-neutral-800 truncate block">
                        {item.customerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Deadline
                      </span>
                      <span className="font-bold text-rose-600 block">
                        {formatDate(item.deadline)}
                      </span>
                    </div>
                  </div>

                  {/* Operator Info */}
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between text-neutral-500">
                      <span>Tahap:</span>
                      <span className="font-bold text-neutral-800">{conf?.label}</span>
                    </div>
                    {item.operatorName && (
                      <div className="flex items-center justify-between text-neutral-500">
                        <span>Penjahit/Operator:</span>
                        <span className="font-bold text-blue-700">{item.operatorName}</span>
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-[11px] p-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg">
                        Catatan: &ldquo;{item.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Measurement toggle */}
                  <div>
                    <button
                      onClick={() =>
                        setActiveMeasurementId((prev) => (prev === item.stageId ? null : item.stageId))
                      }
                      className="w-full py-2 px-3 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-700 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-blue-600" />
                        <span>Data Ukuran Potong & Jahit</span>
                      </span>
                      {isAccordionOpen ? (
                        <ChevronUp className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>

                    {isAccordionOpen && item.measurements && (
                      <div className="mt-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(item.measurements).map(([k, v]) => (
                          <div key={k} className="p-1.5 bg-white border border-neutral-100 rounded-md">
                            <span className="text-[10px] text-neutral-400 block">
                              {MEASUREMENT_DICTIONARY[k]?.label || k}
                            </span>
                            <span className="font-bold text-neutral-900">{v as string} cm</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
                  {item.status !== "completed" ? (
                    <>
                      {item.status === "pending" && (
                        <button
                          onClick={() => {
                            setActingItem({ stageId: item.stageId, action: "start" });
                            setOperatorName(item.operatorName || "");
                          }}
                          className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Mulai Kerjakan</span>
                        </button>
                      )}
                      {item.status === "in_progress" && (
                        <button
                          onClick={() => {
                            setActingItem({ stageId: item.stageId, action: "complete" });
                            setOperatorName(item.operatorName || "");
                          }}
                          className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selesaikan Tahap Ini</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tahap Ini Selesai</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ACTION DIALOG MODAL */}
      {actingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-neutral-200 p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="font-extrabold text-neutral-900 text-base">
                {actingItem.action === "start" ? "Mulai Pengerjaan Tahap" : "Konfirmasi Selesai Tahap"}
              </h3>
              <p className="text-xs text-neutral-500">
                Catat nama operator dan catatan progres untuk transparansi antrean.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Nama Penjahit / Operator:</label>
                <input
                  type="text"
                  required
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder="cth: Siti Rahma / Hendra"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Catatan Hasil Pengerjaan:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="cth: Pola presisi selesai dipotong"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActingItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleActionSubmit}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                {isUpdating ? "Menyimpan..." : "Simpan Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
