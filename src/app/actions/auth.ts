"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword, createSession, deleteSession, getSession, type SessionPayload } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    // If DATABASE_URL is available, query db
    if (process.env.DATABASE_URL) {
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user) {
        return { error: "Email atau password tidak valid." };
      }

      const match = await comparePassword(password, user.passwordHash);
      if (!match) {
        return { error: "Email atau password tidak valid." };
      }

      await createSession({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role as "pemilik" | "karyawan",
      });

      return { success: true, role: user.role };
    }

    // Fallback demo credentials if DATABASE_URL not yet configured
    if (email === "pemilik@penjahitku.com" && password === "admin123") {
      await createSession({
        userId: "demo-owner-id",
        name: "Budi Santoso (Pemilik Demo)",
        email,
        role: "pemilik",
      });
      return { success: true, role: "pemilik" };
    }

    if (email === "karyawan@penjahitku.com" && password === "karyawan123") {
      await createSession({
        userId: "demo-staff-id",
        name: "Siti Rahma (Penjahit Demo)",
        email,
        role: "karyawan",
      });
      return { success: true, role: "karyawan" };
    }

    return { error: "Email atau password salah. Cek info akun demo di bawah." };
  } catch (err: unknown) {
    console.error("Login error:", err);
    return { error: "Terjadi kesalahan internal server saat login." };
  }
}

export async function logoutAction() {
  await deleteSession();
  return { success: true };
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  return getSession();
}
