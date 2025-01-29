import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Field, Well, Product } from "@/lib/models";
import dbConnect from "@/lib/dbConnect";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await dbConnect();

  const { name, role } = session.user;

  const dashboardData = {
    totalFields: 0,
    totalWells: 0,
    totalProducts: 0,
    activeFields: 0,
  };

  if (role === "Admin") {
    dashboardData.totalFields = await Field.countDocuments();
    dashboardData.totalWells = await Well.countDocuments();
    dashboardData.totalProducts = await Product.countDocuments();
    dashboardData.activeFields = await Field.countDocuments({
      status: "Ekili",
    });
  } else if (role === "Ortak") {
    const user = await User.findById(session.user.id);
    dashboardData.totalFields = await Field.countDocuments({
      _id: { $in: user.assignedFields },
    });
    dashboardData.totalWells = await Well.countDocuments({
      _id: { $in: user.assignedWells },
    });
    dashboardData.activeFields = await Field.countDocuments({
      _id: { $in: user.assignedFields },
      status: "Ekili",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-neon-blue">
        Gösterge Paneli
      </h1>
      <p className="text-xl mb-4">Hoş geldiniz, {name}!</p>
      <p className="text-neon-pink mb-6">Rol: {role}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-neon-blue mb-2">
            Toplam Tarla
          </h2>
          <p className="text-4xl text-neon-pink">{dashboardData.totalFields}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-neon-blue mb-2">
            Toplam Kuyu
          </h2>
          <p className="text-4xl text-neon-pink">{dashboardData.totalWells}</p>
        </div>
        {role === "Admin" && (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-neon-blue mb-2">
              Toplam Ürün
            </h2>
            <p className="text-4xl text-neon-pink">
              {dashboardData.totalProducts}
            </p>
          </div>
        )}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-neon-blue mb-2">
            Aktif Tarlalar
          </h2>
          <p className="text-4xl text-neon-pink">
            {dashboardData.activeFields}
          </p>
        </div>
      </div>
    </div>
  );
}
