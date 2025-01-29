import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FertilizerForm from "@/components/admin/FertilizerForm";

export default async function AddFertilizerPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">
        Yeni Gübre Ekle
      </h1>
      <FertilizerForm />
    </div>
  );
}
