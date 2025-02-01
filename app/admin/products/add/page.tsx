import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import dbConnect from "@/lib/dbConnect";
import { Season } from "@/lib/models";

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  await dbConnect();
  const seasons = await Season.find({ status: "Aktif" }).sort({
    startDate: -1,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">Yeni Ürün Ekle</h1>
      <ProductForm seasons={JSON.parse(JSON.stringify(seasons))} />
    </div>
  );
}
