"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NavBar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-black bg-opacity-80 text-white py-4 px-6 flex justify-between items-center border-b border-neon-blue">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="text-neon-blue hover:text-neon-pink"
        >
          <ArrowLeft size={24} />
        </button>
        <Link href="/dashboard" className="text-2xl font-bold text-neon-pink">
          Çiftçilik Sistemi
        </Link>
      </div>
      {status === "loading" ? (
        <div className="text-neon-blue">Yükleniyor...</div>
      ) : session?.user ? (
        <div className="flex items-center space-x-4">
          <span className="text-neon-blue">
            {session.user.name || "Kullanıcı"}
          </span>
          {session.user.role === "Admin" && (
            <>
              <Link
                href="/admin/seasons"
                className="text-neon-blue hover:text-neon-pink"
              >
                Sezon Yönetimi
              </Link>
              <Link
                href="/admin/users"
                className="text-neon-blue hover:text-neon-pink"
              >
                Kullanıcı Yönetimi
              </Link>
              <Link
                href="/admin/wells"
                className="text-neon-blue hover:text-neon-pink"
              >
                Kuyu Yönetimi
              </Link>
              <Link
                href="/admin/fields"
                className="text-neon-blue hover:text-neon-pink"
              >
                Tarla Yönetimi
              </Link>
            </>
          )}
          {session.user.role === "Ortak" && (
            <>
              <Link
                href="/ortak/wells"
                className="text-neon-blue hover:text-neon-pink"
              >
                Kuyu Listesi
              </Link>
              <Link
                href="/ortak/fields"
                className="text-neon-blue hover:text-neon-pink"
              >
                Tarla Listesi
              </Link>
            </>
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
