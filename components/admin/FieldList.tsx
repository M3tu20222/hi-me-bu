"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import type { Field } from "@/types/field";
import { useSession } from "next-auth/react";

export default function FieldList() {
  const { data: session } = useSession();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = session?.user?.role === "Admin";

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch("/api/fields");
        if (!response.ok) {
          throw new Error("Tarlalar yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setFields(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleDelete = async (fieldId: string) => {
    if (window.confirm("Bu tarlayı silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/fields/${fieldId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Tarla silinirken bir hata oluştu");
        }
        setFields(fields.filter((field) => field._id !== fieldId));
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
        <h2 className="text-xl font-semibold cyberpunk-text">Tarla Listesi</h2>
        {isAdmin && (
          <Link href="/admin/fields/add" className="cyberpunk-button">
            Yeni Tarla Ekle
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-neon-blue">Ad</th>
              <th className="p-3 text-left text-neon-blue">Boyut (Dönüm)</th>
              <th className="p-3 text-left text-neon-blue">Konum</th>
              <th className="p-3 text-left text-neon-blue">Ürün</th>
              <th className="p-3 text-left text-neon-blue">Sezon</th>
              <th className="p-3 text-left text-neon-blue">Durum</th>
              <th className="p-3 text-left text-neon-blue">Ortak</th>
              <th className="p-3 text-left text-neon-blue">Kiralık</th>
              <th className="p-3 text-left text-neon-blue">Ada-Parsel</th>
              {isAdmin && (
                <th className="p-3 text-left text-neon-blue">İşlemler</th>
              )}
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field._id} className="border-b border-gray-800">
                <td className="p-3 text-neon-pink">{field.name}</td>
                <td className="p-3 text-white">{field.size}</td>
                <td className="p-3 text-white">{field.location}</td>
                <td className="p-3 text-white">
                  {field.crop || "Belirlenmemiş"}
                </td>
                <td className="p-3 text-white">
                  {field.season?.name || "Belirlenmemiş"}
                </td>
                <td className="p-3 text-neon-blue">{field.status}</td>
                <td className="p-3 text-white">
                  {field.isShared ? "Evet" : "Hayır"}
                </td>
                <td className="p-3 text-white">
                  {field.isRented ? "Evet" : "Hayır"}
                </td>
                <td className="p-3 text-white">{field.blockParcel || "-"}</td>
                {isAdmin && (
                  <td className="p-3">
                    <Link
                      href={`/admin/fields/edit/${field._id}`}
                      className="text-neon-blue hover:text-neon-pink mr-2"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(field._id)}
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
