import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InventoryList from "@/components/admin/InventoryList";

export default async function OrtakInventoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Ortak") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">
        Envanter Listesi
      </h1>
      <InventoryList />
    </div>
  );
}
