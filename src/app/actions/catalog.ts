"use server";

import { db } from "@/db";
import { catalogItems } from "@/db/schema";
import { desc } from "drizzle-orm";

export interface CatalogItemData {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string | null;
  measurementFields: string[];
  imageUrl: string | null;
  isActive: boolean;
}

const DEFAULT_CATALOG: CatalogItemData[] = [
  {
    id: "cat-1",
    name: "Kemeja Formal Slim Fit",
    category: "kemeja",
    basePrice: 175000,
    description: "Kemeja kerah kaku modern dengan potongan rapi presisi, cocok untuk busana kantor dan acara formal.",
    measurementFields: [
      "lingkar_dada",
      "panjang_baju",
      "lebar_bahu",
      "panjang_lengan",
      "lingkar_leher",
      "lingkar_manset",
    ],
    imageUrl: null,
    isActive: true,
  },
  {
    id: "cat-2",
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
    imageUrl: null,
    isActive: true,
  },
  {
    id: "cat-3",
    name: "Gamis A-Line Flowy",
    category: "gamis",
    basePrice: 245000,
    description: "Gamis potongan A-line anggun dengan jatuhan kain flowy, pergelangan wudhu-friendly, dan resleting jepang.",
    measurementFields: [
      "lingkar_dada",
      "lingkar_pinggang",
      "panjang_gamis",
      "lebar_bahu",
      "panjang_lengan",
      "lingkar_bawah",
    ],
    imageUrl: null,
    isActive: true,
  },
  {
    id: "cat-4",
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
    imageUrl: null,
    isActive: true,
  },
  {
    id: "cat-5",
    name: "Kemeja Batik Modern",
    category: "kemeja",
    basePrice: 195000,
    description: "Kemeja batik furing katun halus dengan penyesuaian sambungan motif (tumpal presisi) depan dan kerah kokoh.",
    measurementFields: [
      "lingkar_dada",
      "panjang_baju",
      "lebar_bahu",
      "panjang_lengan",
      "lingkar_leher",
    ],
    imageUrl: null,
    isActive: true,
  },
  {
    id: "cat-6",
    name: "Seragam PDH & Komunitas",
    category: "kaos_seragam",
    basePrice: 150000,
    description: "Kemeja dinas harian / komunitas dengan ventilasi punggung, lidah bahu pangkat, dan jahitan dobel stik.",
    measurementFields: [
      "lingkar_dada",
      "panjang_baju",
      "lebar_bahu",
      "panjang_lengan",
    ],
    imageUrl: null,
    isActive: true,
  },
];

export async function getCatalogItems(): Promise<CatalogItemData[]> {
  try {
    if (process.env.DATABASE_URL) {
      const items = await db.select().from(catalogItems).orderBy(desc(catalogItems.createdAt));
      if (items.length > 0) {
        return items.map((i) => ({
          id: i.id,
          name: i.name,
          category: i.category,
          basePrice: i.basePrice,
          description: i.description,
          measurementFields: i.measurementFields as string[],
          imageUrl: i.imageUrl,
          isActive: i.isActive,
        }));
      }
    }
    return DEFAULT_CATALOG;
  } catch (err) {
    console.error("Error fetching catalog items:", err);
    return DEFAULT_CATALOG;
  }
}
