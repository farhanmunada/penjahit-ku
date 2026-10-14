import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PenjahitKu - Sistem Garment & Konveksi Custom Modern",
  description: "Platform pemesanan pakaian custom kiosk-style, penyimpanan ukuran tubuh dinamis, dan pelacakan 5 tahap produksi real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
