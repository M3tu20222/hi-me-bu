import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function OrtakPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "Ortak" && session.user.role !== "Admin")) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-neon-blue">Ortak Paneli</h1>
      <p className="text-xl mb-4">Hoş geldiniz, Ortak {session.user.name}!</p>
      <ul className="list-disc list-inside text-neon-pink">
        <li>Tarla Yönetimi</li>
        <li>Finansal Raporlar</li>
        <li>Ürün Planlaması</li>
      </ul>
    </div>
  )
}

