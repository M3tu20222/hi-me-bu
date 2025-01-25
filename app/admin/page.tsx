import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-neon-pink">Admin Paneli</h1>
      <p className="text-xl mb-4">Hoş geldiniz, Admin {session.user.name}!</p>
      <ul className="list-disc list-inside text-neon-blue">
        <li>Kullanıcı Yönetimi</li>
        <li>Sistem Ayarları</li>
        <li>Raporlar</li>
      </ul>
    </div>
  );
}
