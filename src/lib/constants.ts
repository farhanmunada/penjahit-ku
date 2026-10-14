export interface MeasurementFieldDef {
  key: string;
  label: string;
  unit: string;
  placeholder: string;
  hint?: string;
}

export const MEASUREMENT_DICTIONARY: Record<string, MeasurementFieldDef> = {
  lingkar_dada: {
    key: "lingkar_dada",
    label: "Lingkar Dada",
    unit: "cm",
    placeholder: "cth: 98",
    hint: "Diukur melingkari bagian dada terbesar",
  },
  panjang_baju: {
    key: "panjang_baju",
    label: "Panjang Baju",
    unit: "cm",
    placeholder: "cth: 72",
    hint: "Dari pangkal leher/bahu tertinggi ke bawah",
  },
  lebar_bahu: {
    key: "lebar_bahu",
    label: "Lebar Bahu",
    unit: "cm",
    placeholder: "cth: 44",
    hint: "Dari ujung tulang bahu kiri ke kanan",
  },
  panjang_lengan: {
    key: "panjang_lengan",
    label: "Panjang Lengan",
    unit: "cm",
    placeholder: "cth: 60",
    hint: "Dari pangkal bahu hingga pergelangan tangan",
  },
  lingkar_leher: {
    key: "lingkar_leher",
    label: "Lingkar Leher",
    unit: "cm",
    placeholder: "cth: 40",
    hint: "Melingkar di dasar leher dengan kelonggaran 1 jari",
  },
  lingkar_manset: {
    key: "lingkar_manset",
    label: "Lingkar Pergelangan / Manset",
    unit: "cm",
    placeholder: "cth: 24",
    hint: "Melingkar di pergelangan tangan",
  },
  lingkar_pinggang: {
    key: "lingkar_pinggang",
    label: "Lingkar Pinggang",
    unit: "cm",
    placeholder: "cth: 84",
    hint: "Melingkari bagian pinggang tempat celana/ikat pinggang",
  },
  lingkar_pinggul: {
    key: "lingkar_pinggul",
    label: "Lingkar Pinggul",
    unit: "cm",
    placeholder: "cth: 96",
    hint: "Melingkari pinggul di bagian paling berisi",
  },
  panjang_jas: {
    key: "panjang_jas",
    label: "Panjang Jas",
    unit: "cm",
    placeholder: "cth: 75",
    hint: "Dari pangkal leher hingga batas bawah ibu jari saat tangan lurus",
  },
  lebar_punggung: {
    key: "lebar_punggung",
    label: "Lebar Punggung",
    unit: "cm",
    placeholder: "cth: 42",
    hint: "Diukur di punggung dari lipatan ketiak kiri ke kanan",
  },
  panjang_gamis: {
    key: "panjang_gamis",
    label: "Panjang Gamis",
    unit: "cm",
    placeholder: "cth: 138",
    hint: "Dari bahu tertinggi lurus ke batas mata kaki/lantai",
  },
  lingkar_bawah: {
    key: "lingkar_bawah",
    label: "Lingkar Keliling Bawah",
    unit: "cm",
    placeholder: "cth: 220",
    hint: "Keliling lebar bagian bawah gamis/gaun",
  },
  panjang_celana: {
    key: "panjang_celana",
    label: "Panjang Celana",
    unit: "cm",
    placeholder: "cth: 100",
    hint: "Dari pinggang samping luar hingga batas bawah mata kaki",
  },
  lingkar_paha: {
    key: "lingkar_paha",
    label: "Lingkar Paha",
    unit: "cm",
    placeholder: "cth: 58",
    hint: "Melingkar pada paha bagian paling besar",
  },
  lebar_bawah: {
    key: "lebar_bawah",
    label: "Lebar Bukaan Kaki",
    unit: "cm",
    placeholder: "cth: 18",
    hint: "Lebar datar bukaan celana bagian bawah",
  },
  pesak: {
    key: "pesak",
    label: "Tinggi Pesak",
    unit: "cm",
    placeholder: "cth: 66",
    hint: "Dari pinggang depan melintasi selangkangan ke pinggang belakang",
  },
};

export const STAGES_CONFIG = [
  {
    key: "cutting",
    label: "Pola & Potong Bahan",
    sequence: 1,
    desc: "Pemotongan kain sesuai pola ukuran kustom",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    key: "sewing",
    label: "Proses Jahit",
    sequence: 2,
    desc: "Penjahitan komponen pakaian & obras rapi",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    key: "qc",
    label: "Quality Control (QC)",
    sequence: 3,
    desc: "Pembersihan sisa benang & verifikasi kesesuaian ukuran",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    key: "packing",
    label: "Finishing & Packing",
    sequence: 4,
    desc: "Setrika uap, tagging label, dan plastik kemasan",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    key: "ready",
    label: "Siap Diambil / Kirim",
    sequence: 5,
    desc: "Pesanan selesai dan siap diserahkan ke pelanggan",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
] as const;

export const CATEGORIES = [
  { id: "all", name: "Semua Kategori", icon: "LayoutGrid" },
  { id: "kemeja", name: "Kemeja Formal & Casual", icon: "Shirt" },
  { id: "jas", name: "Jas & Blazer", icon: "Briefcase" },
  { id: "gamis", name: "Gamis & Gaun", icon: "Sparkles" },
  { id: "celana", name: "Celana Formal & Chino", icon: "Scissors" },
  { id: "kaos_seragam", name: "Kaos & Seragam", icon: "Users" },
] as const;

export const FABRIC_OPTIONS = [
  { name: "Katun Toyobo Fodu (Lembut & Adem)", priceAdd: 0 },
  { name: "Katun Oxford Premium (Tebal & Formal)", priceAdd: 15000 },
  { name: "Wool Silk Super 150s (Khusus Jas Mewah)", priceAdd: 120000 },
  { name: "Semi Wool Semi Stretch (Nyaman Jas/Celana)", priceAdd: 45000 },
  { name: "Drill American 1919 (Kuat & Awet Seragam)", priceAdd: 20000 },
  { name: "Linen Pure Organic (Kasual & Bertekstur)", priceAdd: 35000 },
  { name: "Bawa Kain Sendiri (Hanya Jasa Jahit)", priceAdd: -25000 },
];
