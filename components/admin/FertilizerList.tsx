"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import type { Fertilizer } from "@/types/fertilizer";
import { useSession } from "next-auth/react";

export default function FertilizerList() {
  const { data: session } = useSession();
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFertilizers();
  }, []);

  const fetchFertilizers = async () => {
    try {
      const response = await fetch("/api/fertilizers?populate=season");
      if (!response.ok) {
        throw new Error("Gübreler yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setFertilizers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fertilizerId: string) => {
    if (window.confirm("Bu gübreyi silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/fertilizers/${fertilizerId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Gübre silinirken bir hata oluştu");
        }
        setFertilizers(
          fertilizers.filter((fertilizer) => fertilizer._id !== fertilizerId)
        );
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
        <h2 className="text-xl font-semibold cyberpunk-text">Gübre Listesi</h2>
        {session?.user.role === "Admin" && (
          <Link href="/admin/fertilizers/add" className="cyberpunk-button">
            Yeni Gübre Ekle
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-neon-blue">Ad</th>
              <th className="p-3 text-left text-neon-blue">Tip</th>
              <th className="p-3 text-left text-neon-blue">Birim</th>
              <th className="p-3 text-left text-neon-blue">Mevcut Stok</th>
              <th className="p-3 text-left text-neon-blue">Fiyat</th>
              <th className="p-3 text-left text-neon-blue">Durum</th>
              <th className="p-3 text-left text-neon-blue">Sezon</th>
              {session?.user.role === "Admin" && (
                <th className="p-3 text-left text-neon-blue">İşlemler</th>
              )}
            </tr>
          </thead>
          <tbody>
            {fertilizers.map((fertilizer) => (
              <tr key={fertilizer._id} className="border-b border-gray-800">
                <td className="p-3 text-neon-pink">{fertilizer.name}</td>
                <td className="p-3 text-white">{fertilizer.type}</td>
                <td className="p-3 text-white">
                  {fertilizer.unit}
                  {fertilizer.unit === "çuval" && ` (${fertilizer.kgPerBag}kg)`}
                </td>
                <td className="p-3 text-white">{fertilizer.currentStock}</td>
                <td className="p-3 text-white">
                  {fertilizer.price.toLocaleString()} ₺
                </td>
                <td className="p-3 text-neon-blue">{fertilizer.status}</td>
                <td className="p-3 text-white">
                  {fertilizer.season &&
                  typeof fertilizer.season === "object" &&
                  "name" in fertilizer.season
                    ? fertilizer.season.name
                    : fertilizer.season
                    ? `${fertilizer.season}`
                    : "Belirlenmemiş"}
                </td>
                {session?.user.role === "Admin" && (
                  <td className="p-3">
                    <Link
                      href={`/admin/fertilizers/edit/${fertilizer._id}`}
                      className="text-neon-blue hover:text-neon-pink mr-2"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(fertilizer._id)}
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
