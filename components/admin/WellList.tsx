"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import type { Well } from "@/types/well";
import { useSession } from "next-auth/react";

export default function WellList() {
  const { data: session } = useSession();
  const [wells, setWells] = useState<Well[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = session?.user?.role === "Admin";

  useEffect(() => {
    const fetchWells = async () => {
      try {
        const response = await fetch("/api/wells");
        if (!response.ok) {
          throw new Error("Kuyular yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setWells(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWells();
  }, []);

  const handleDelete = async (wellId: string) => {
    if (window.confirm("Bu kuyuyu silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/wells/${wellId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Kuyu silinirken bir hata oluştu");
        }
        setWells(wells.filter((well) => well._id !== wellId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    }
  };

  if (isLoading) return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-900 shadow-lg rounded-lg overflow-hidden cyberpunk-border">
      <div className="flex justify-between items-center p-4 border-b border-neon-purple">
        <h2 className="text-xl font-semibold cyberpunk-text">Kuyu Listesi</h2>
        {isAdmin && (
          <Link href="/admin/wells/add" className="cyberpunk-button">
            Yeni Kuyu Ekle
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-neon-blue">Ad</th>
              <th className="p-3 text-left text-neon-blue">Bölge</th>
              <th className="p-3 text-left text-neon-blue">Konum</th>
              <th className="p-3 text-left text-neon-blue">Derinlik</th>
              <th className="p-3 text-left text-neon-blue">Kapasite</th>
              <th className="p-3 text-left text-neon-blue">Durum</th>
              <th className="p-3 text-left text-neon-blue">Sorumlu</th>
              {isAdmin && (
                <th className="p-3 text-left text-neon-blue">İşlemler</th>
              )}
            </tr>
          </thead>
          <tbody>
            {wells.map((well) => (
              <tr key={well._id} className="border-b border-gray-800">
                <td className="p-3 text-neon-pink">{well.name}</td>
                <td className="p-3 text-white">{well.region}</td>
                <td className="p-3 text-white">{well.location}</td>
                <td className="p-3 text-white">{well.depth} m</td>
                <td className="p-3 text-white">{well.capacity} m³/saat</td>
                <td className="p-3 text-neon-blue">{well.status}</td>
                <td className="p-3 text-white">
                  {well.responsibleUser?.name || "Atanmamış"}
                </td>
                {isAdmin && (
                  <td className="p-3">
                    <Link
                      href={`/admin/wells/edit/${well._id}`}
                      className="text-neon-blue hover:text-neon-pink mr-2"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(well._id)}
                      className="text-neon-pink hover:text-neon-blue"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
