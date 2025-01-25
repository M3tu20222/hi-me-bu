"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-black bg-opacity-80 text-white py-4 px-6 flex justify-between items-center border-b border-neon-blue">
      <Link href="/dashboard" className="text-2xl font-bold text-neon-pink">
        Çiftçilik Sistemi
      </Link>
      {status === "loading" ? (
        <div className="text-neon-blue">Yükleniyor...</div>
      ) : session?.user ? (
        <div className="flex items-center space-x-4">
          <span className="text-neon-blue">
            {session.user.name || "Kullanıcı"}
          </span>
          {session.user.role === "Admin" && (
            <Link
              href="/admin/seasons"
              className="text-neon-blue hover:text-neon-pink"
            >
              Sezon Yönetimi
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-neon-pink"
          >
            Çıkış Yap
          </button>
        </div>
      ) : (
        <Link href="/login" className="btn-neon-blue">
          Giriş Yap
        </Link>
      )}
    </nav>
  );
}
