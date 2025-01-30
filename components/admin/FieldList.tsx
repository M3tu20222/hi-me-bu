"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Check, X } from "lucide-react";
import type { Field } from "@/types/field";
import { useSession } from "next-auth/react";

interface FieldOwnership {
  userId: string;
  ownershipPercentage: number;
  ownerName: string;
}

interface FieldWithOwnership extends Field {
  owners: FieldOwnership[];
}

interface DebugInfo {
  role: string;
  userId: string;
  query: any;
  ownerships?: number;
  fieldsFound: number;
  allFieldsCount?: number;
}

const getOwnershipColor = (index: number) => {
  const colors = [
    "from-blue-500",
    "from-green-500",
    "from-purple-500",
    "from-yellow-500",
    "from-pink-500",
  ];
  return colors[index % colors.length];
};

const OwnershipBadge = ({
  ownership,
  index,
  totalOwners,
}: {
  ownership: FieldOwnership;
  index: number;
  totalOwners: number;
}) => {
  return (
    <div
      className="relative w-8 h-8 rounded-full overflow-hidden mr-1 mb-1 inline-block group"
      title={`${ownership.ownerName}: ${ownership.ownershipPercentage}%`}
    >
      {totalOwners === 1 ? (
        // Tek sahip için tam daire
        <div
          className={`absolute inset-0 bg-gradient-to-b ${getOwnershipColor(
            index
          )} to-transparent`}
        />
      ) : (
        // Çoklu sahip için yüzdeye göre bölünmüş görünüm
        <div
          className={`absolute inset-0 bg-gradient-to-b ${getOwnershipColor(
            index
          )} to-transparent`}
          style={{
            height: `${ownership.ownershipPercentage}%`,
            top: index === 0 ? "0" : `${100 - ownership.ownershipPercentage}%`,
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
        {ownership.ownerName ? ownership.ownerName[0].toUpperCase() : "?"}
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-75 text-white text-xs transition-opacity duration-200">
        {ownership.ownershipPercentage}%
      </div>
    </div>
  );
};

export default function FieldList() {
  const { data: session } = useSession();
  const [fields, setFields] = useState<FieldWithOwnership[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
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
        console.log("API Response:", JSON.stringify(data, null, 2));
        setFields(data.fields || []);
        setDebugInfo(data.debugInfo || null);
      } catch (err) {
        console.error("Error fetching fields:", err);
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
        {fields.length === 0 ? (
          <div className="text-white text-center py-4">
            <p>Görüntülenecek tarla bulunamadı.</p>
            {debugInfo && (
              <div className="mt-4 text-sm text-gray-400">
                <p>Hata Detayları:</p>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left text-neon-blue">Ad</th>
                <th className="p-3 text-left text-neon-blue">Dekar</th>
                <th className="p-3 text-left text-neon-blue">Sahipler</th>
                <th className="p-3 text-left text-neon-blue">Ürün</th>
                <th className="p-3 text-left text-neon-blue">Sezon</th>
                <th className="p-3 text-left text-neon-blue">Durum</th>
                <th className="p-3 text-left text-neon-blue">Sulanan</th>
                <th className="p-3 text-left text-neon-blue">Kiralık</th>
                <th className="p-3 text-left text-neon-blue">Ada-Parsel</th>
                <th className="p-3 text-left text-neon-blue">Konum</th>
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
                  <td className="p-3 text-white">
                    <div className="flex flex-wrap">
                      {field.owners && field.owners.length > 0 ? (
                        field.owners.map((ownership, index) => (
                          <OwnershipBadge
                            key={index}
                            ownership={ownership}
                            index={index}
                            totalOwners={field.owners.length}
                          />
                        ))
                      ) : (
                        <span className="text-gray-500">Sahip bilgisi yok</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-white">
                    {field.products && field.products.length > 0
                      ? field.products.map((product) => product.name).join(", ")
                      : field.crop || "Belirlenmemiş"}
                  </td>
                  <td className="p-3 text-white">
                    {field.season?.year
                      ? `${field.season.year}-${field.season.year + 1}`
                      : "Belirlenmemiş"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        field.status === "Ekili"
                          ? "bg-green-500 text-white"
                          : field.status === "Sürüldü"
                          ? "bg-yellow-500 text-black"
                          : field.status === "Boş"
                          ? "bg-red-500 text-white"
                          : field.status === "Hazırlanıyor"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {field.status}
                    </span>
                  </td>
                  <td className="p-3 text-white">
                    {field.isIrrigated ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </td>
                  <td className="p-3 text-white">
                    {field.isRented ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </td>
                  <td className="p-3 text-white">{field.blockParcel || "-"}</td>
                  <td className="p-3 text-white">{field.location}</td>
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
        )}
      </div>
    </div>
  );
}
