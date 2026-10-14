"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scissors, Search, Sparkles, Layers, UserCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, logoutAction } from "@/app/actions/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setUser({ name: u.name, role: u.role });
    });
  }, [pathname]);

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    router.push("/login");
  };

  const navLinks = [
    { href: "/katalog", label: "Katalog Kiosk", icon: Sparkles },
    { href: "/track", label: "Lacak Pesanan", icon: Search },
    { href: "/produksi", label: "Antrean Produksi", icon: Layers },
    ...(user?.role === "pemilik" ? [{ href: "/admin", label: "Admin Pemilik", icon: UserCircle }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-600 transition-colors">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-neutral-900">
              Penjahit<span className="text-blue-600">Ku</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-neutral-500">
              Garment & Custom Tailor
            </span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-neutral-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User state / Auth action */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div className="text-xs">
                <span className="font-semibold text-neutral-800">{user.name.split(" ")[0]}</span>
                <span className="ml-1 text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded font-mono uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Keluar"
                className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Masuk Staf
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
