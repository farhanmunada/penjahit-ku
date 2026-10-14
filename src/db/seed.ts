import { db } from "./index";
import { users, catalogItems, customers, orders, orderItems, productionStages } from "./schema";
import { hashPassword } from "../lib/auth";

export async function runSeed() {
  console.log("🌱 Menjalankan Seeding Database PenjahitKu...");

  // 1. Akun Pengguna
  const ownerHash = await hashPassword("admin123");
  const staffHash = await hashPassword("karyawan123");

  const [owner] = await db
    .insert(users)
    .values({
      name: "Budi Santoso (Pemilik)",
      email: "pemilik@penjahitku.com",
      passwordHash: ownerHash,
      role: "pemilik",
    })
    .onConflictDoNothing()
    .returning();

  const [staff] = await db
    .insert(users)
    .values({
      name: "Siti Rahma (Penjahit)",
      email: "karyawan@penjahitku.com",
      passwordHash: staffHash,
      role: "karyawan",
    })
    .onConflictDoNothing()
    .returning();

  console.log("✅ User berhasil di-seed (pemilik & karyawan).");

  // 2. Katalog Model Pakaian Bersih
  const sampleCatalogs = [
    {
      name: "Kemeja Formal Slim Fit",
      category: "kemeja",
      basePrice: 175000,
      description: "Kemeja kerah kaku modern dengan potongan rapi, cocok untuk busana kantor dan acara formal.",
      measurementFields: [
        "lingkar_dada",
        "panjang_baju",
        "lebar_bahu",
        "panjang_lengan",
        "lingkar_leher",
        "lingkar_manset",
      ],
      imageUrl: "",
    },
    {
      name: "Jas Executive Single Breasted",
      category: "jas",
      basePrice: 850000,
      description: "Setelan jas berstruktur tegas dengan furing sutra, potongan bahu proporsional, dan kantong paspoal elegan.",
      measurementFields: [
        "lingkar_dada",
        "lingkar_pinggang",
        "lebar_bahu",
        "panjang_jas",
        "panjang_lengan",
        "lebar_punggung",
      ],
      imageUrl: "",
    },
    {
      name: "Gamis A-Line Flowy",
      category: "gamis",
      basePrice: 245000,
      description: "Gamis potongan A-line yang anggun dengan jatuhan kain flowy, pergelangan wudhu-friendly, dan resleting jepang.",
      measurementFields: [
        "lingkar_dada",
        "lingkar_pinggang",
        "panjang_gamis",
        "lebar_bahu",
        "panjang_lengan",
        "lingkar_bawah",
      ],
      imageUrl: "",
    },
    {
      name: "Celana Chino Custom Fit",
      category: "celana",
      basePrice: 165000,
      description: "Celana panjang chino kasual-formal dengan saku samping miring dan kenyamanan pinggang yang presisi.",
      measurementFields: [
        "lingkar_pinggang",
        "lingkar_pinggul",
        "panjang_celana",
        "lingkar_paha",
        "lebar_bawah",
        "pesak",
      ],
      imageUrl: "",
    },
    {
      name: "Kemeja Batik Modern Custom",
      category: "kemeja",
      basePrice: 195000,
      description: "Kemeja batik furing halus dengan penyesuaian sambungan motif (tumpal presisi) depan dan saku bobok.",
      measurementFields: [
        "lingkar_dada",
        "panjang_baju",
        "lebar_bahu",
        "panjang_lengan",
        "lingkar_leher",
      ],
      imageUrl: "",
    },
    {
      name: "Seragam PDH / Kemeja Komunitas",
      category: "kaos_seragam",
      basePrice: 150000,
      description: "Kemeja dinas/komunitas dengan ventilasi punggung, lidah bahu (pangkat), dan bordir komputer rapi.",
      measurementFields: [
        "lingkar_dada",
        "panjang_baju",
        "lebar_bahu",
        "panjang_lengan",
      ],
      imageUrl: "",
    },
  ];

  for (const item of sampleCatalogs) {
    await db.insert(catalogItems).values(item).onConflictDoNothing();
  }
  console.log("✅ Katalog pakaian berhasil di-seed.");

  // 3. Sample Customer & Order Aktif
  const [cust] = await db
    .insert(customers)
    .values({
      name: "Ahmad Maulana",
      phone: "081234567890",
      address: "Jl. Melati No. 45, Jakarta Selatan",
    })
    .returning();

  if (cust) {
    const today = new Date();
    const deadline = new Date(today);
    deadline.setDate(deadline.getDate() + 7);

    const [order] = await db
      .insert(orders)
      .values({
        spkNumber: "SPK-2610-1001",
        customerId: cust.id,
        statusPayment: "dp",
        totalPrice: 350000,
        downPayment: 175000,
        deadline: deadline.toISOString().split("T")[0],
        notes: "Mohon jahitan kancing dibuat dobel kuat",
      })
      .returning();

    if (order) {
      const [orderItem] = await db
        .insert(orderItems)
        .values({
          orderId: order.id,
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
        })
        .returning();

      if (orderItem) {
        // Buat 5 tahap
        await db.insert(productionStages).values([
          {
            orderItemId: orderItem.id,
            stage: "cutting",
            status: "completed",
            sequence: 1,
            operatorName: "Hendra (Cutting)",
            notes: "Pola dipotong presisi",
            startedAt: new Date(Date.now() - 86400000 * 2),
            completedAt: new Date(Date.now() - 86400000),
          },
          {
            orderItemId: orderItem.id,
            stage: "sewing",
            status: "in_progress",
            sequence: 2,
            operatorName: staff ? staff.name : "Siti Rahma",
            notes: "Sedang perakitan kerah dan manset",
            startedAt: new Date(),
          },
          {
            orderItemId: orderItem.id,
            stage: "qc",
            status: "pending",
            sequence: 3,
          },
          {
            orderItemId: orderItem.id,
            stage: "packing",
            status: "pending",
            sequence: 4,
          },
          {
            orderItemId: orderItem.id,
            stage: "ready",
            status: "pending",
            sequence: 5,
          },
        ]);
        console.log("✅ Sample order & tracking SPK-2610-1001 dibuat.");
      }
    }
  }

  console.log("✨ Seeding selesai sukses!");
}

if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Error saat seeding:", err);
      process.exit(1);
    });
}
