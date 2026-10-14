import { getAllOrders } from "@/app/actions/order";
import { getCurrentUser } from "@/app/actions/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  // If logged in as karyawan, inform them to view /produksi
  if (user && user.role !== "pemilik") {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-neutral-200 rounded-3xl text-center space-y-4 shadow-sm">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-black text-neutral-900">Akses Dibatasi</h2>
        <p className="text-xs text-neutral-500">
          Halaman ini khusus untuk peran <strong>Pemilik</strong>. Akun Anda saat ini tercatat sebagai <strong>Karyawan</strong>.
        </p>
        <Link
          href="/produksi"
          className="inline-block px-5 py-2.5 bg-neutral-900 text-white font-bold text-xs rounded-xl"
        >
          Ke Antrean Produksi
        </Link>
      </div>
    );
  }

  const allOrders = await getAllOrders();

  return <AdminDashboard initialOrders={allOrders} />;
}
