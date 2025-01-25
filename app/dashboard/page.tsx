import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { name, role } = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-neon-blue">
        Gösterge Paneli
      </h1>
      <p className="text-xl mb-4">Hoş geldiniz, {name}!</p>
      <p className="text-neon-pink">Rol: {role}</p>
    </div>
  );
}
