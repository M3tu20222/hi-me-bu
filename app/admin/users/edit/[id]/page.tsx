import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserForm from "@/components/admin/UserForm";
import { getUserById } from "@/lib/api";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  const user = await getUserById(params.id);

  if (!user) {
    return <div className="text-red-500">Kullanıcı bulunamadı</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">
        Kullanıcı Düzenle
      </h1>
      <UserForm user={user} />
    </div>
  );
}
