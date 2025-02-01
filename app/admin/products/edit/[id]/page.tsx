import { notFound } from "next/navigation";
import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import ProductForm from "@/components/admin/ProductForm";
import dbConnect from "@/lib/dbConnect";
import { Product, Season } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EditProductPage({ params }: { params: Params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  await dbConnect();
  const product = await Product.findById(params.id).populate("season");
  const seasons = await Season.find({ status: "Aktif" }).sort({
    startDate: -1,
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">Ürün Düzenle</h1>
      <ProductForm
        product={JSON.parse(JSON.stringify(product))}
        seasons={JSON.parse(JSON.stringify(seasons))}
      />
    </div>
  );
}
