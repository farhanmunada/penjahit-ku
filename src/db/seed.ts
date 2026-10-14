import { db } from "./index";
import { users, customers, orders, orderItems, productionStages } from "./schema";
import { hashPassword } from "../lib/auth";

export async function runSeed() {
  console.log("🌱 Menjalankan Seeding Database PenjahitKu (Tanpa Katalog)...");

  // 1. Akun Pengguna / Staf Produksi
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

  const [staffSewing] = await db
    .insert(users)
    .values({
      name: "Siti Rahma (Penjahit)",
      email: "karyawan@penjahitku.com",
      passwordHash: staffHash,
      role: "karyawan",
    })
    .onConflictDoNothing()
    .returning();

  const [staffCutting] = await db
    .insert(users)
    .values({
      name: "Hendra Wijaya (Meja Potong)",
      email: "hendra@penjahitku.com",
      passwordHash: staffHash,
      role: "karyawan",
    })
    .onConflictDoNothing()
    .returning();

  const [staffQc] = await db
    .insert(users)
    .values({
      name: "Rina Marlina (QC & Finishing)",
      email: "rina@penjahitku.com",
      passwordHash: staffHash,
      role: "karyawan",
    })
    .onConflictDoNothing()
    .returning();

  console.log("✅ User internal berhasil di-seed (1 Pemilik + 3 Karyawan).");

  // 2. Data Pelanggan (Customers)
  const [cust1] = await db
    .insert(customers)
    .values({
      name: "Ahmad Maulana",
      phone: "081234567890",
      address: "Jl. Melati No. 45, Jakarta Selatan",
    })
    .returning();

  const [cust2] = await db
    .insert(customers)
    .values({
      name: "Ibu Dewi Anggraini",
      phone: "081987654321",
      address: "Kompleks Dago Asri Blok B3, Bandung",
    })
    .returning();

  const [cust3] = await db
    .insert(customers)
    .values({
      name: "Bapak Bambang Triyono",
      phone: "085712345678",
      address: "Jl. Pemuda No. 12, Surabaya",
    })
    .returning();

  const [cust4] = await db
    .insert(customers)
    .values({
      name: "Sarah Nabila",
      phone: "082199887766",
      address: "Cluster Lavender No. 8, BSD City, Tangerang",
    })
    .returning();

  console.log("✅ 4 Customer berhasil di-seed.");

  const now = Date.now();
  const dayMs = 86400000;

  // 3. Data Orders, Order Items, & 5 Tahapan Produksi

  // --- ORDER 1: Ahmad Maulana (Tahap Sewing sedang jalan) ---
  if (cust1) {
    const deadline1 = new Date(now + 5 * dayMs).toISOString().split("T")[0];
    const [ord1] = await db
      .insert(orders)
      .values({
        spkNumber: "SPK-2610-1001",
        customerId: cust1.id,
        statusPayment: "dp",
        totalPrice: 350000,
        downPayment: 175000,
        deadline: deadline1,
        notes: "Jahitan kancing dibuat dobel kuat, saku kiri",
      })
      .returning();

    if (ord1) {
      const [item1] = await db
        .insert(orderItems)
        .values({
          orderId: ord1.id,
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

      if (item1) {
        await db.insert(productionStages).values([
          {
            orderItemId: item1.id,
            stage: "cutting",
            status: "completed",
            sequence: 1,
            operatorName: staffCutting ? staffCutting.name : "Hendra Wijaya",
            notes: "Kain katun dipotong presisi sesuai pola slim fit",
            startedAt: new Date(now - 2 * dayMs),
            completedAt: new Date(now - 1 * dayMs),
          },
          {
            orderItemId: item1.id,
            stage: "sewing",
            status: "in_progress",
            sequence: 2,
            operatorName: staffSewing ? staffSewing.name : "Siti Rahma",
            notes: "Perakitan kerah kaku dan pasang manset",
            startedAt: new Date(now - 4 * 3600000),
          },
          {
            orderItemId: item1.id,
            stage: "qc",
            status: "pending",
            sequence: 3,
          },
          {
            orderItemId: item1.id,
            stage: "packing",
            status: "pending",
            sequence: 4,
          },
          {
            orderItemId: item1.id,
            stage: "ready",
            status: "pending",
            sequence: 5,
          },
        ]);
      }
    }
  }

  // --- ORDER 2: Ibu Dewi Anggraini (Tahap QC sedang jalan) ---
  if (cust2) {
    const deadline2 = new Date(now + 3 * dayMs).toISOString().split("T")[0];
    const [ord2] = await db
      .insert(orders)
      .values({
        spkNumber: "SPK-2610-1002",
        customerId: cust2.id,
        statusPayment: "paid",
        totalPrice: 490000,
        downPayment: 490000,
        deadline: deadline2,
        notes: "Ujung lengan karet wudhu-friendly, resleting jepang belakang",
      })
      .returning();

    if (ord2) {
      const [item2] = await db
        .insert(orderItems)
        .values({
          orderId: ord2.id,
          itemName: "Gamis A-Line Flowy (Linen Pure)",
          fabricType: "Linen Pure Organic (Sage Green)",
          quantity: 2,
          unitPrice: 245000,
          measurements: {
            lingkar_dada: 98,
            lingkar_pinggang: 82,
            panjang_gamis: 138,
            lebar_bahu: 40,
            panjang_lengan: 58,
            lingkar_bawah: 215,
          },
        })
        .returning();

      if (item2) {
        await db.insert(productionStages).values([
          {
            orderItemId: item2.id,
            stage: "cutting",
            status: "completed",
            sequence: 1,
            operatorName: staffCutting ? staffCutting.name : "Hendra Wijaya",
            notes: "Pola A-line disesuaikan panjang gamis 138cm",
            startedAt: new Date(now - 3 * dayMs),
            completedAt: new Date(now - 2 * dayMs),
          },
          {
            orderItemId: item2.id,
            stage: "sewing",
            status: "completed",
            sequence: 2,
            operatorName: staffSewing ? staffSewing.name : "Siti Rahma",
            notes: "Obras benang 4 rapi, resleting jepang terpasang mulus",
            startedAt: new Date(now - 2 * dayMs),
            completedAt: new Date(now - 6 * 3600000),
          },
          {
            orderItemId: item2.id,
            stage: "qc",
            status: "in_progress",
            sequence: 3,
            operatorName: staffQc ? staffQc.name : "Rina Marlina",
            notes: "Pemeriksaan sisa benang & cek lingkar dada 98cm",
            startedAt: new Date(now - 2 * 3600000),
          },
          {
            orderItemId: item2.id,
            stage: "packing",
            status: "pending",
            sequence: 4,
          },
          {
            orderItemId: item2.id,
            stage: "ready",
            status: "pending",
            sequence: 5,
          },
        ]);
      }
    }
  }

  // --- ORDER 3: Bapak Bambang Triyono (Tahap Cutting baru mulai) ---
  if (cust3) {
    const deadline3 = new Date(now + 8 * dayMs).toISOString().split("T")[0];
    const [ord3] = await db
      .insert(orders)
      .values({
        spkNumber: "SPK-2610-1003",
        customerId: cust3.id,
        statusPayment: "dp",
        totalPrice: 970000,
        downPayment: 500000,
        deadline: deadline3,
        notes: "Bahu kanan agak turun 0.5cm, furing sutra doff hitam",
      })
      .returning();

    if (ord3) {
      const [item3] = await db
        .insert(orderItems)
        .values({
          orderId: ord3.id,
          itemName: "Jas Executive Single Breasted (Wool Silk)",
          fabricType: "Wool Silk Super 150s (Midnight Blue)",
          quantity: 1,
          unitPrice: 970000,
          measurements: {
            lingkar_dada: 106,
            lingkar_pinggang: 92,
            lebar_bahu: 48,
            panjang_jas: 76,
            panjang_lengan: 63,
            lebar_punggung: 44,
          },
        })
        .returning();

      if (item3) {
        await db.insert(productionStages).values([
          {
            orderItemId: item3.id,
            stage: "cutting",
            status: "in_progress",
            sequence: 1,
            operatorName: staffCutting ? staffCutting.name : "Hendra Wijaya",
            notes: "Sedang proses layout pola di atas bahan wool",
            startedAt: new Date(now - 1 * 3600000),
          },
          {
            orderItemId: item3.id,
            stage: "sewing",
            status: "pending",
            sequence: 2,
          },
          {
            orderItemId: item3.id,
            stage: "qc",
            status: "pending",
            sequence: 3,
          },
          {
            orderItemId: item3.id,
            stage: "packing",
            status: "pending",
            sequence: 4,
          },
          {
            orderItemId: item3.id,
            stage: "ready",
            status: "pending",
            sequence: 5,
          },
        ]);
      }
    }
  }

  // --- ORDER 4: Sarah Nabila (Semua 5 Tahap Selesai / READY) ---
  if (cust4) {
    const deadline4 = new Date(now + 1 * dayMs).toISOString().split("T")[0];
    const [ord4] = await db
      .insert(orders)
      .values({
        spkNumber: "SPK-2610-1004",
        customerId: cust4.id,
        statusPayment: "paid",
        totalPrice: 210000,
        downPayment: 210000,
        deadline: deadline4,
        notes: "Panjang celana pas di atas mata kaki",
      })
      .returning();

    if (ord4) {
      const [item4] = await db
        .insert(orderItems)
        .values({
          orderId: ord4.id,
          itemName: "Celana Chino Custom Fit (Semi Wool)",
          fabricType: "Semi Wool Semi Stretch (Khaki Tan)",
          quantity: 1,
          unitPrice: 210000,
          measurements: {
            lingkar_pinggang: 76,
            lingkar_pinggul: 92,
            panjang_celana: 94,
            lingkar_paha: 56,
            lebar_bawah: 17,
            pesak: 62,
          },
        })
        .returning();

      if (item4) {
        await db.insert(productionStages).values([
          {
            orderItemId: item4.id,
            stage: "cutting",
            status: "completed",
            sequence: 1,
            operatorName: staffCutting ? staffCutting.name : "Hendra Wijaya",
            notes: "Selesai potong chino",
            startedAt: new Date(now - 4 * dayMs),
            completedAt: new Date(now - 3 * dayMs),
          },
          {
            orderItemId: item4.id,
            stage: "sewing",
            status: "completed",
            sequence: 2,
            operatorName: staffSewing ? staffSewing.name : "Siti Rahma",
            notes: "Saku miring dan jahitan pas",
            startedAt: new Date(now - 3 * dayMs),
            completedAt: new Date(now - 2 * dayMs),
          },
          {
            orderItemId: item4.id,
            stage: "qc",
            status: "completed",
            sequence: 3,
            operatorName: staffQc ? staffQc.name : "Rina Marlina",
            notes: "Ukuran sesuai toleransi 0cm",
            startedAt: new Date(now - 2 * dayMs),
            completedAt: new Date(now - 1 * dayMs),
          },
          {
            orderItemId: item4.id,
            stage: "packing",
            status: "completed",
            sequence: 4,
            operatorName: staffQc ? staffQc.name : "Rina Marlina",
            notes: "Setrika uap dan hanger plastik",
            startedAt: new Date(now - 1 * dayMs),
            completedAt: new Date(now - 12 * 3600000),
          },
          {
            orderItemId: item4.id,
            stage: "ready",
            status: "completed",
            sequence: 5,
            operatorName: owner ? owner.name : "Budi Santoso",
            notes: "Pesanan siap diserahkan ke pelanggan",
            startedAt: new Date(now - 12 * 3600000),
            completedAt: new Date(now - 6 * 3600000),
          },
        ]);
      }
    }
  }

  console.log("✅ 4 SPK Orders & 20 Production Stages berhasil di-seed.");
  console.log("✨ Seeding selesai sukses (katalog dikosongkan untuk input mandiri)!");
}

if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Error saat seeding:", err);
      process.exit(1);
    });
}
