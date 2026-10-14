"use server";

import { db } from "@/db";
import { customers, orders, orderItems, productionStages } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { generateSpkNumber } from "@/lib/utils";

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  notes?: string;
  deadlineDays?: number;
  items: {
    catalogItemId?: string;
    itemName: string;
    fabricType: string;
    quantity: number;
    unitPrice: number;
    measurements: Record<string, number | string>;
    notes?: string;
  }[];
}

// In-memory demo store for when DB is not yet connected
const inMemoryOrders: any[] = [
  {
    id: "demo-ord-1",
    spkNumber: "SPK-2610-1001",
    statusPayment: "dp",
    totalPrice: 350000,
    downPayment: 175000,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    notes: "Kancing dibuat dobel kuat",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    customer: {
      name: "Ahmad Maulana",
      phone: "081234567890",
      address: "Jl. Melati No. 45, Jakarta Selatan",
    },
    items: [
      {
        id: "item-1",
        itemName: "Kemeja Formal Slim Fit (Katun Toyobo)",
        fabricType: "Katun Toyobo Fodu (Putih Tulang)",
        quantity: 2,
        unitPrice: 175000,
        measurements: {
          lingkar_dada: 102,
          panjang_baju: 74,
          lebar_bahu: 46,
          panjang_lengan: 62,
          lingkar_leher: 41,
          lingkar_manset: 25,
        },
        stages: [
          {
            id: "stg-1",
            stage: "cutting",
            status: "completed",
            sequence: 1,
            operatorName: "Hendra (Cutting)",
            notes: "Pola dipotong presisi",
            startedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            completedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "stg-2",
            stage: "sewing",
            status: "in_progress",
            sequence: 2,
            operatorName: "Siti Rahma",
            notes: "Sedang perakitan kerah dan manset",
            startedAt: new Date().toISOString(),
            completedAt: null,
          },
          {
            id: "stg-3",
            stage: "qc",
            status: "pending",
            sequence: 3,
            operatorName: null,
            notes: null,
            startedAt: null,
            completedAt: null,
          },
          {
            id: "stg-4",
            stage: "packing",
            status: "pending",
            sequence: 4,
            operatorName: null,
            notes: null,
            startedAt: null,
            completedAt: null,
          },
          {
            id: "stg-5",
            stage: "ready",
            status: "pending",
            sequence: 5,
            operatorName: null,
            notes: null,
            startedAt: null,
            completedAt: null,
          },
        ],
      },
    ],
  },
];

export async function createOrderAction(data: CreateOrderPayload) {
  try {
    const spkNumber = generateSpkNumber();
    const totalPrice = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + (data.deadlineDays || 7));
    const deadlineStr = deadlineDate.toISOString().split("T")[0];

    if (process.env.DATABASE_URL) {
      // 1. Create customer
      const [newCust] = await db
        .insert(customers)
        .values({
          name: data.customerName,
          phone: data.customerPhone,
          address: data.customerAddress || null,
        })
        .returning();

      // 2. Create order
      const [newOrder] = await db
        .insert(orders)
        .values({
          spkNumber,
          customerId: newCust.id,
          statusPayment: "unpaid",
          totalPrice,
          downPayment: 0,
          deadline: deadlineStr,
          notes: data.notes || null,
        })
        .returning();

      // 3. Create items and their 5 production stages
      for (const item of data.items) {
        const [newItem] = await db
          .insert(orderItems)
          .values({
            orderId: newOrder.id,
            catalogItemId: item.catalogItemId || null,
            itemName: item.itemName,
            fabricType: item.fabricType,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            measurements: item.measurements,
            notes: item.notes || null,
          })
          .returning();

        // 5 standard stages
        const stageList = [
          { stage: "cutting", sequence: 1 },
          { stage: "sewing", sequence: 2 },
          { stage: "qc", sequence: 3 },
          { stage: "packing", sequence: 4 },
          { stage: "ready", sequence: 5 },
        ];

        for (const s of stageList) {
          await db.insert(productionStages).values({
            orderItemId: newItem.id,
            stage: s.stage,
            sequence: s.sequence,
            status: "pending",
          });
        }
      }

      return { success: true, spkNumber, totalPrice };
    }

    // In-memory demo creation
    const newDemoOrder = {
      id: "demo-ord-" + Date.now(),
      spkNumber,
      statusPayment: "unpaid",
      totalPrice,
      downPayment: 0,
      deadline: deadlineStr,
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
      customer: {
        name: data.customerName,
        phone: data.customerPhone,
        address: data.customerAddress || "-",
      },
      items: data.items.map((item, idx) => ({
        id: "item-" + Date.now() + "-" + idx,
        itemName: item.itemName,
        fabricType: item.fabricType,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        measurements: item.measurements,
        stages: [
          { id: "s1-" + idx, stage: "cutting", status: "pending", sequence: 1 },
          { id: "s2-" + idx, stage: "sewing", status: "pending", sequence: 2 },
          { id: "s3-" + idx, stage: "qc", status: "pending", sequence: 3 },
          { id: "s4-" + idx, stage: "packing", status: "pending", sequence: 4 },
          { id: "s5-" + idx, stage: "ready", status: "pending", sequence: 5 },
        ],
      })),
    };

    inMemoryOrders.unshift(newDemoOrder);
    return { success: true, spkNumber, totalPrice };
  } catch (err: unknown) {
    console.error("Error creating order:", err);
    return { error: "Gagal membuat pesanan." };
  }
}

export async function getOrderBySpkOrPhone(query: string) {
  const clean = query.trim();
  if (!clean) return null;

  try {
    if (process.env.DATABASE_URL) {
      const order = await db.query.orders.findFirst({
        where: or(eq(orders.spkNumber, clean), eq(customers.phone, clean)),
        with: {
          customer: true,
          items: {
            with: {
              stages: {
                orderBy: (stages, { asc }) => [asc(stages.sequence)],
              },
            },
          },
        },
      });
      if (order) return order;
    }

    const found = inMemoryOrders.find(
      (o) =>
        o.spkNumber.toLowerCase() === clean.toLowerCase() ||
        o.customer.phone.includes(clean) ||
        clean.includes(o.customer.phone)
    );
    return found || null;
  } catch (err) {
    console.error("Error tracking order:", err);
    return null;
  }
}

export async function getAllOrders() {
  try {
    if (process.env.DATABASE_URL) {
      const all = await db.query.orders.findMany({
        orderBy: [desc(orders.createdAt)],
        with: {
          customer: true,
          items: {
            with: {
              stages: true,
            },
          },
        },
      });
      return all;
    }
    return inMemoryOrders;
  } catch (err) {
    console.error("Error getting all orders:", err);
    return inMemoryOrders;
  }
}

export async function updatePaymentStatus(orderId: string, status: "unpaid" | "dp" | "paid", downPayment = 0) {
  try {
    if (process.env.DATABASE_URL) {
      await db
        .update(orders)
        .set({ statusPayment: status, downPayment })
        .where(eq(orders.id, orderId));
      return { success: true };
    }

    const ord = inMemoryOrders.find((o) => o.id === orderId);
    if (ord) {
      ord.statusPayment = status;
      ord.downPayment = downPayment;
    }
    return { success: true };
  } catch (err) {
    console.error("Error updating payment:", err);
    return { error: "Gagal update status bayar." };
  }
}
