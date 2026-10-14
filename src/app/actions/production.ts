"use server";

import { db } from "@/db";
import { productionStages, orderItems, orders, customers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface ProductionItemView {
  stageId: string;
  stage: string;
  status: string;
  sequence: number;
  operatorName: string | null;
  notes: string | null;
  startedAt: string | null;
  completedAt: string | null;
  itemName: string;
  fabricType: string;
  quantity: number;
  measurements: Record<string, number | string>;
  spkNumber: string;
  customerName: string;
  customerPhone: string;
  deadline: string;
}

// In-memory production fallback
let inMemoryStages: ProductionItemView[] = [
  {
    stageId: "stg-1",
    stage: "cutting",
    status: "completed",
    sequence: 1,
    operatorName: "Hendra Wijaya (Meja Potong)",
    notes: "Pola dipotong presisi",
    startedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    itemName: "Kemeja Formal Slim Fit (Katun Toyobo)",
    fabricType: "Katun Toyobo Fodu (Putih Tulang)",
    quantity: 2,
    measurements: {
      lingkar_dada: 102,
      panjang_baju: 74,
      lebar_bahu: 46,
      panjang_lengan: 62,
      lingkar_leher: 41,
      lingkar_manset: 25,
    },
    spkNumber: "SPK-2610-1001",
    customerName: "Ahmad Maulana",
    customerPhone: "081234567890",
    deadline: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
  },
  {
    stageId: "stg-2",
    stage: "sewing",
    status: "in_progress",
    sequence: 2,
    operatorName: "Siti Rahma (Penjahit)",
    notes: "Sedang perakitan kerah kaku dan pasang manset",
    startedAt: new Date().toISOString(),
    completedAt: null,
    itemName: "Kemeja Formal Slim Fit (Katun Toyobo)",
    fabricType: "Katun Toyobo Fodu (Putih Tulang)",
    quantity: 2,
    measurements: {
      lingkar_dada: 102,
      panjang_baju: 74,
      lebar_bahu: 46,
      panjang_lengan: 62,
      lingkar_leher: 41,
      lingkar_manset: 25,
    },
    spkNumber: "SPK-2610-1001",
    customerName: "Ahmad Maulana",
    customerPhone: "081234567890",
    deadline: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
  },
  {
    stageId: "stg-2-3",
    stage: "qc",
    status: "in_progress",
    sequence: 3,
    operatorName: "Rina Marlina (QC)",
    notes: "Pemeriksaan sisa benang & cek lingkar dada 98cm",
    startedAt: new Date().toISOString(),
    completedAt: null,
    itemName: "Gamis A-Line Flowy (Linen Pure)",
    fabricType: "Linen Pure Organic (Sage Green)",
    quantity: 2,
    measurements: {
      lingkar_dada: 98,
      lingkar_pinggang: 82,
      panjang_gamis: 138,
      lebar_bahu: 40,
      panjang_lengan: 58,
      lingkar_bawah: 215,
    },
    spkNumber: "SPK-2610-1002",
    customerName: "Ibu Dewi Anggraini",
    customerPhone: "081987654321",
    deadline: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
  },
  {
    stageId: "stg-3-1",
    stage: "cutting",
    status: "in_progress",
    sequence: 1,
    operatorName: "Hendra Wijaya",
    notes: "Sedang proses layout pola jas pada bahan wool",
    startedAt: new Date().toISOString(),
    completedAt: null,
    itemName: "Jas Executive Single Breasted (Wool Silk)",
    fabricType: "Wool Silk Super 150s (Midnight Blue)",
    quantity: 1,
    measurements: {
      lingkar_dada: 106,
      lingkar_pinggang: 92,
      lebar_bahu: 48,
      panjang_jas: 76,
      panjang_lengan: 63,
      lebar_punggung: 44,
    },
    spkNumber: "SPK-2610-1003",
    customerName: "Bapak Bambang Triyono",
    customerPhone: "085712345678",
    deadline: new Date(Date.now() + 8 * 86400000).toISOString().split("T")[0],
  },
  {
    stageId: "stg-4-5",
    stage: "ready",
    status: "completed",
    sequence: 5,
    operatorName: "Budi Santoso (Pemilik)",
    notes: "Pesanan selesai dan siap diserahkan ke pelanggan",
    startedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    itemName: "Celana Chino Custom Fit (Semi Wool)",
    fabricType: "Semi Wool Semi Stretch (Khaki Tan)",
    quantity: 1,
    measurements: {
      lingkar_pinggang: 76,
      lingkar_pinggul: 92,
      panjang_celana: 94,
      lingkar_paha: 56,
      lebar_bawah: 17,
      pesak: 62,
    },
    spkNumber: "SPK-2610-1004",
    customerName: "Sarah Nabila",
    customerPhone: "082199887766",
    deadline: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
  },
];

export async function getProductionQueue(filterStage?: string): Promise<ProductionItemView[]> {
  try {
    if (process.env.DATABASE_URL) {
      const records = await db
        .select({
          stageId: productionStages.id,
          stage: productionStages.stage,
          status: productionStages.status,
          sequence: productionStages.sequence,
          operatorName: productionStages.operatorName,
          notes: productionStages.notes,
          startedAt: productionStages.startedAt,
          completedAt: productionStages.completedAt,
          itemName: orderItems.itemName,
          fabricType: orderItems.fabricType,
          quantity: orderItems.quantity,
          measurements: orderItems.measurements,
          spkNumber: orders.spkNumber,
          customerName: customers.name,
          customerPhone: customers.phone,
          deadline: orders.deadline,
        })
        .from(productionStages)
        .innerJoin(orderItems, eq(productionStages.orderItemId, orderItems.id))
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(customers, eq(orders.customerId, customers.id))
        .orderBy(desc(orders.createdAt));

      const mapped: ProductionItemView[] = records.map((r) => ({
        stageId: r.stageId,
        stage: r.stage,
        status: r.status,
        sequence: r.sequence,
        operatorName: r.operatorName,
        notes: r.notes,
        startedAt: r.startedAt ? r.startedAt.toISOString() : null,
        completedAt: r.completedAt ? r.completedAt.toISOString() : null,
        itemName: r.itemName,
        fabricType: r.fabricType,
        quantity: r.quantity,
        measurements: r.measurements as Record<string, number | string>,
        spkNumber: r.spkNumber,
        customerName: r.customerName,
        customerPhone: r.customerPhone,
        deadline: r.deadline,
      }));

      if (filterStage && filterStage !== "all") {
        return mapped.filter((i) => i.stage === filterStage);
      }
      return mapped;
    }

    if (filterStage && filterStage !== "all") {
      return inMemoryStages.filter((i) => i.stage === filterStage);
    }
    return inMemoryStages;
  } catch (err) {
    console.error("Error fetching production queue:", err);
    if (filterStage && filterStage !== "all") {
      return inMemoryStages.filter((i) => i.stage === filterStage);
    }
    return inMemoryStages;
  }
}

export async function updateStageStatus(
  stageId: string,
  newStatus: "in_progress" | "completed",
  operatorName?: string,
  notes?: string
) {
  try {
    const now = new Date();
    if (process.env.DATABASE_URL) {
      await db
        .update(productionStages)
        .set({
          status: newStatus,
          operatorName: operatorName || undefined,
          notes: notes || undefined,
          startedAt: newStatus === "in_progress" ? now : undefined,
          completedAt: newStatus === "completed" ? now : undefined,
        })
        .where(eq(productionStages.id, stageId));

      revalidatePath("/produksi");
      revalidatePath("/track");
      return { success: true };
    }

    const item = inMemoryStages.find((s) => s.stageId === stageId);
    if (item) {
      item.status = newStatus;
      if (operatorName) item.operatorName = operatorName;
      if (notes) item.notes = notes;
      if (newStatus === "in_progress") item.startedAt = now.toISOString();
      if (newStatus === "completed") item.completedAt = now.toISOString();
    }

    revalidatePath("/produksi");
    revalidatePath("/track");
    return { success: true };
  } catch (err) {
    console.error("Error updating stage status:", err);
    return { error: "Gagal memperbarui status produksi." };
  }
}
