import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InventoryForm from "@/components/admin/InventoryForm";
import { Inventory } from "@/lib/models";
import dbConnect from "@/lib/dbConnect";

export default async function EditInventoryPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  await dbConnect();
  const inventoryItem = await Inventory.findById(params.id);

  if (!inventoryItem) {
    return <div>Envanter öğesi bulunamadı</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Envanter Öğesi Düzenle</h1>
      <InventoryForm
        inventoryItem={JSON.parse(JSON.stringify(inventoryItem))}
      />
    </div>
  );
}
