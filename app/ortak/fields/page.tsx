import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FieldList from "@/components/admin/FieldList";

export default async function OrtakFieldsPage() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "Ortak" && session.user.role !== "Admin")
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">Tarla Listesi</h1>
      <FieldList />
    </div>
  );
}
