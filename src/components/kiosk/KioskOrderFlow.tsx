"use client";

import { useState } from "react";
import { type CatalogItemData } from "@/app/actions/catalog";
import { createOrderAction } from "@/app/actions/order";
import { CATEGORIES, FABRIC_OPTIONS, MEASUREMENT_DICTIONARY } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";
import {
  Shirt,
  Briefcase,
  Sparkles,
  Scissors,
  Users,
  LayoutGrid,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Ruler,
  Clock,
  User,
  Phone,
  FileText,
  ExternalLink,
  Info,
} from "lucide-react";
import Link from "next/link";

interface CartItem {
  catalogItem: CatalogItemData;
  fabric: { name: string; priceAdd: number };
  quantity: number;
  measurements: Record<string, number | string>;
  notes: string;
  totalItemPrice: number;
}

export default function KioskOrderFlow({ initialItems }: { initialItems: CatalogItemData[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CatalogItemData | null>(null);

  // Modal Wizard State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [measurements, setMeasurements] = useState<Record<string, number | string>>({});
  const [itemNotes, setItemNotes] = useState("");

  // Customer Info State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ spkNumber: string; totalPrice: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredItems =
    activeCategory === "all"
      ? initialItems
      : initialItems.filter((item) => item.category === activeCategory);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "kemeja":
        return <Shirt className="w-5 h-5" />;
      case "jas":
        return <Briefcase className="w-5 h-5" />;
      case "gamis":
        return <Sparkles className="w-5 h-5" />;
      case "celana":
        return <Scissors className="w-5 h-5" />;
      case "kaos_seragam":
        return <Users className="w-5 h-5" />;
      default:
        return <LayoutGrid className="w-5 h-5" />;
    }
  };

  const openWizard = (item: CatalogItemData) => {
    setSelectedItem(item);
    setSelectedFabric(FABRIC_OPTIONS[0]);
    setQuantity(1);
    setItemNotes("");
    setWizardStep(1);

    // Initial empty measurements
    const initialMeasure: Record<string, number | string> = {};
    item.measurementFields.forEach((fieldKey) => {
      initialMeasure[fieldKey] = "";
    });
    setMeasurements(initialMeasure);
  };

  const handleApplyPreset = (size: "S" | "M" | "L" | "XL") => {
    const presets: Record<string, Record<string, number>> = {
      S: {
        lingkar_dada: 94,
        panjang_baju: 70,
        lebar_bahu: 42,
        panjang_lengan: 58,
        lingkar_leher: 38,
        lingkar_pinggang: 78,
        lingkar_pinggul: 90,
        panjang_celana: 96,
        lingkar_paha: 54,
        lebar_bawah: 17,
        pesak: 62,
        panjang_gamis: 134,
        panjang_jas: 72,
        lebar_punggung: 40,
        lingkar_bawah: 200,
        lingkar_manset: 23,
      },
      M: {
        lingkar_dada: 100,
        panjang_baju: 72,
        lebar_bahu: 44,
        panjang_lengan: 60,
        lingkar_leher: 40,
        lingkar_pinggang: 84,
        lingkar_pinggul: 96,
        panjang_celana: 98,
        lingkar_paha: 58,
        lebar_bawah: 18,
        pesak: 64,
        panjang_gamis: 136,
        panjang_jas: 74,
        lebar_punggung: 42,
        lingkar_bawah: 210,
        lingkar_manset: 24,
      },
      L: {
        lingkar_dada: 106,
        panjang_baju: 74,
        lebar_bahu: 46,
        panjang_lengan: 62,
        lingkar_leher: 42,
        lingkar_pinggang: 90,
        lingkar_pinggul: 102,
        panjang_celana: 100,
        lingkar_paha: 62,
        lebar_bawah: 19,
        pesak: 66,
        panjang_gamis: 138,
        panjang_jas: 76,
        lebar_punggung: 44,
        lingkar_bawah: 220,
        lingkar_manset: 25,
      },
      XL: {
        lingkar_dada: 112,
        panjang_baju: 76,
        lebar_bahu: 48,
        panjang_lengan: 64,
        lingkar_leher: 44,
        lingkar_pinggang: 96,
        lingkar_pinggul: 108,
        panjang_celana: 102,
        lingkar_paha: 66,
        lebar_bawah: 20,
        pesak: 68,
        panjang_gamis: 140,
        panjang_jas: 78,
        lebar_punggung: 46,
        lingkar_bawah: 230,
        lingkar_manset: 26,
      },
    };

    const targetPreset = presets[size];
    if (!targetPreset) return;

    setMeasurements((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (targetPreset[key] !== undefined) {
          updated[key] = targetPreset[key];
        }
      });
      return updated;
    });
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const unitPrice = selectedItem.basePrice + selectedFabric.priceAdd;
    const totalItemPrice = unitPrice * quantity;

    const newItem: CartItem = {
      catalogItem: selectedItem,
      fabric: selectedFabric,
      quantity,
      measurements,
      notes: itemNotes,
      totalItemPrice,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedItem(null);
  };

  const handleCheckoutSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage("Nama pemesan dan Nomor WhatsApp wajib diisi!");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Keranjang pesanan masih kosong.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      customerName,
      customerPhone,
      customerAddress,
      deadlineDays,
      items: cart.map((c) => ({
        catalogItemId: c.catalogItem.id,
        itemName: `${c.catalogItem.name} (${c.fabric.name})`,
        fabricType: c.fabric.name,
        quantity: c.quantity,
        unitPrice: c.catalogItem.basePrice + c.fabric.priceAdd,
        measurements: c.measurements,
        notes: c.notes,
      })),
    };

    const res = await createOrderAction(payload);
    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else if (res.success && res.spkNumber) {
      setOrderResult({
        spkNumber: res.spkNumber,
        totalPrice: res.totalPrice || 0,
      });
      setCart([]);
      setWizardStep(4);
    }
  };

  const cartTotalAmount = cart.reduce((sum, item) => sum + item.totalItemPrice, 0);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Kiosk Top Notification / Mode Bar */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
            <span className="text-xs font-semibold text-neutral-800">
              Sistem Kiosk Pemesanan Langsung &bull; Clean White Modern
            </span>
          </div>
          <div className="text-xs text-neutral-500">
            Pilih model &rarr; Tentukan kain &rarr; Input ukuran kustom presisi
          </div>
        </div>
      </div>

      {/* Main Kiosk Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Category Navigation (McDonald's Style Sidebar) */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-neutral-200 p-3 shadow-sm sticky top-20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-3 py-2">
              Kategori Pakaian
            </h3>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 translate-x-1"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-neutral-500"}>
                      {getCategoryIcon(cat.id)}
                    </span>
                    <span className="flex-1">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Catalog Cards Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                Pilih Model Busana
              </h1>
              <p className="text-sm text-neutral-500">
                Menampilkan {filteredItems.length} pilihan model pakaian berkualitas tailor.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                {/* Visual Placeholder Header */}
                <div className="h-44 bg-gradient-to-br from-neutral-50 via-slate-50 to-neutral-100 relative flex items-center justify-center p-6 border-b border-neutral-100">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-sm group-hover:scale-105 transition-transform">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[11px] font-bold text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200 uppercase tracking-wider">
                    {item.category.replace("_", " ")}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-neutral-900 text-lg group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-1">
                      {item.measurementFields.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-mono"
                        >
                          {MEASUREMENT_DICTIONARY[f]?.label || f}
                        </span>
                      ))}
                      {item.measurementFields.length > 3 && (
                        <span className="text-[10px] text-neutral-400 px-1 py-0.5">
                          +{item.measurementFields.length - 3} ukuran
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">
                        Mulai dari
                      </span>
                      <span className="font-black text-lg text-neutral-900">
                        {formatRupiah(item.basePrice)}
                      </span>
                    </div>
                    <button
                      onClick={() => openWizard(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <span>Pilih & Ukur</span>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right / Sticky Cart Drawer (Kiosk Tray) */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm sticky top-20 flex flex-col justify-between max-h-[85vh]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-neutral-900 text-base">Baki Pesanan</h3>
                </div>
                <span className="text-xs bg-neutral-100 font-bold px-2 py-0.5 rounded-full text-neutral-700">
                  {cart.length} Item
                </span>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-3 overflow-y-auto max-h-[45vh]">
                {cart.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <Ruler className="w-8 h-8 text-neutral-300 mx-auto" />
                    <p className="text-xs font-semibold text-neutral-600">Baki masih kosong</p>
                    <p className="text-[11px] text-neutral-400">
                      Pilih model pakaian di samping untuk mengisi ukuran custom.
                    </p>
                  </div>
                ) : (
                  cart.map((c, index) => (
                    <div
                      key={index}
                      className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5 text-xs relative group"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-neutral-900">{c.catalogItem.name}</span>
                        <span className="font-black text-neutral-800">
                          {formatRupiah(c.totalItemPrice)}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {c.fabric.name} &bull; Qty: {c.quantity}x
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        Ukuran: {Object.keys(c.measurements).length} parameter terisi
                      </div>
                      <button
                        onClick={() => setCart((prev) => prev.filter((_, i) => i !== index))}
                        className="text-[10px] text-rose-600 hover:underline pt-1 block"
                      >
                        Hapus Item
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Checkout trigger */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Total Sementara</span>
                  <span className="font-black text-lg text-neutral-900">
                    {formatRupiah(cartTotalAmount)}
                  </span>
                </div>
                <button
                  onClick={() => setWizardStep(3)}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Lanjut Pemesanan & SPK</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL STEP-BY-STEP KIOSK WIZARD */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                  Konfigurasi Pakaian Kustom
                </span>
                <h2 className="text-lg font-black">{selectedItem.name}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {/* Stepper Tabs */}
            <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 py-2 text-xs font-bold text-neutral-500">
              <span
                className={`flex-1 py-1 text-center ${
                  wizardStep === 1 ? "text-blue-600 border-b-2 border-blue-600" : ""
                }`}
              >
                1. Bahan & Jumlah
              </span>
              <span
                className={`flex-1 py-1 text-center ${
                  wizardStep === 2 ? "text-blue-600 border-b-2 border-blue-600" : ""
                }`}
              >
                2. Input Ukuran Badan
              </span>
            </div>

            {/* Step 1: Pilihan Bahan & Kuantitas */}
            {wizardStep === 1 && (
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-3">
                    Pilih Jenis Bahan / Kain:
                  </label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {FABRIC_OPTIONS.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setSelectedFabric(f)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs transition-all ${
                          selectedFabric.name === f.name
                            ? "bg-blue-50 border-blue-600 ring-1 ring-blue-600 font-bold text-neutral-900"
                            : "bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                        }`}
                      >
                        <div>
                          <span>{f.name}</span>
                        </div>
                        <span className="font-mono text-neutral-800">
                          {f.priceAdd > 0
                            ? `+${formatRupiah(f.priceAdd)}`
                            : f.priceAdd < 0
                            ? formatRupiah(f.priceAdd)
                            : "Standar"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">Jumlah Pcs</span>
                    <span className="text-[11px] text-neutral-500">Dibuat dengan ukuran identik</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 text-neutral-700 font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-base w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 text-neutral-700 font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Modal Footer Step 1 */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div>
                    <span className="text-[11px] text-neutral-400 block font-medium">Subtotal Item</span>
                    <span className="font-black text-lg text-neutral-900">
                      {formatRupiah((selectedItem.basePrice + selectedFabric.priceAdd) * quantity)}
                    </span>
                  </div>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    <span>Lanjut ke Ukuran Badan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Form Ukuran Tubuh Dinamis */}
            {wizardStep === 2 && (
              <div className="p-6 space-y-6">
                {/* Fast Preset Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Preset Ukuran Cepat:
                    </span>
                    <span className="text-[11px] text-neutral-400">Klik untuk isi otomatis</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(["S", "M", "L", "XL"] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleApplyPreset(size)}
                        className="py-2 text-xs font-extrabold rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 active:bg-blue-50 active:border-blue-500 text-neutral-800 transition-colors"
                      >
                        Ukuran {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Inputs per Field */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Ruler className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Parameter Ukuran (Bisa Diedit Manual):
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-64 overflow-y-auto pr-1">
                    {selectedItem.measurementFields.map((fieldKey) => {
                      const def = MEASUREMENT_DICTIONARY[fieldKey];
                      return (
                        <div key={fieldKey} className="space-y-1">
                          <label className="text-[11px] font-bold text-neutral-700 flex items-center justify-between">
                            <span>{def?.label || fieldKey}</span>
                            <span className="text-neutral-400 font-normal">{def?.unit || "cm"}</span>
                          </label>
                          <input
                            type="number"
                            value={measurements[fieldKey] || ""}
                            onChange={(e) =>
                              setMeasurements((prev) => ({
                                ...prev,
                                [fieldKey]: e.target.value ? Number(e.target.value) : "",
                              }))
                            }
                            placeholder={def?.placeholder || "0"}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                          {def?.hint && (
                            <p className="text-[10px] text-neutral-400 leading-tight">{def.hint}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Note */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700">
                    Catatan Khusus Penjahit (Opsional):
                  </label>
                  <input
                    type="text"
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder="cth: bahu kanan agak turun 1cm, saku depan kemeja kiri saja"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Modal Footer Step 2 */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Masukkan ke Baki Pesanan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: MODAL CHECKOUT & DATA PELANGGAN */}
      {wizardStep === 3 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                  Langkah Akhir
                </span>
                <h2 className="text-lg font-black">Data Pemesan & SPK</h2>
              </div>
              <button
                onClick={() => setWizardStep(1)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Nama Lengkap Pemesan:</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="cth: Rahmat Hidayat"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Nomor WhatsApp (Untuk Notifikasi & Tracking):</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="cth: 081234567890"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Alamat Pengiriman / Pengambilan (Opsional):</span>
                </label>
                <textarea
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Alamat lengkap jika ingin dikirim via kurir..."
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Deadline Options */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Pilihan Waktu Pengerjaan:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeadlineDays(7)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      deadlineDays === 7
                        ? "bg-blue-50 border-blue-600 font-bold text-blue-950"
                        : "bg-white border-neutral-200 text-neutral-700"
                    }`}
                  >
                    <span className="block font-bold">Reguler (7 Hari)</span>
                    <span className="text-[10px] text-neutral-400">Standar antrean rapi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeadlineDays(3)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      deadlineDays === 3
                        ? "bg-blue-50 border-blue-600 font-bold text-blue-950"
                        : "bg-white border-neutral-200 text-neutral-700"
                    }`}
                  >
                    <span className="block font-bold">Kilat Prioritas (3 Hari)</span>
                    <span className="text-[10px] text-neutral-400">Prioritas meja potong</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 block">Total {cart.length} Item</span>
                  <span className="font-extrabold text-neutral-900 text-base">
                    {formatRupiah(cartTotalAmount)}
                  </span>
                </div>
                <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-md">
                  Status: SPK Dibuat
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCheckoutSubmit}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  {isSubmitting ? "Membuat SPK..." : "Cetak & Buat SPK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER SUCCESS MODAL */}
      {wizardStep === 4 && orderResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-neutral-200 p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Pesanan Berhasil Dibuat!
              </span>
              <h2 className="text-2xl font-black text-neutral-900">Surat Perintah Kerja (SPK)</h2>
              <p className="text-xs text-neutral-500">
                Pekerjaan telah masuk ke tahap 1 (Pola & Potong Bahan).
              </p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                Nomor SPK Anda:
              </span>
              <span className="font-mono text-2xl font-black text-blue-600 tracking-wider block">
                {orderResult.spkNumber}
              </span>
              <div className="text-xs text-neutral-600 font-semibold pt-1 border-t border-neutral-200">
                Total Biaya: {formatRupiah(orderResult.totalPrice)}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/track?spk=${orderResult.spkNumber}`}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Lacak Status Jahitan Real-Time</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setWizardStep(1);
                  setOrderResult(null);
                }}
                className="w-full py-3 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Buat Pesanan Baru Lainnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
