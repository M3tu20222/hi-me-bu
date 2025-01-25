"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface Season {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  year: number;
}

interface SeasonListProps {
  seasons: Season[];
  onSeasonDeleted: () => void;
}

export default function SeasonList({
  seasons,
  onSeasonDeleted,
}: SeasonListProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu sezonu silmek istediğinizden emin misiniz?")) {
      const res = await fetch(`/api/seasons/${id}`, { method: "DELETE" });
      if (res.ok) {
        onSeasonDeleted();
      } else {
        alert("Sezon silinirken bir hata oluştu.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-neon-blue">Sezonlar</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 border border-gray-700">Sezon Adı</th>
              <th className="p-2 border border-gray-700">Başlangıç</th>
              <th className="p-2 border border-gray-700">Bitiş</th>
              <th className="p-2 border border-gray-700">Durum</th>
              <th className="p-2 border border-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((season) => (
              <tr key={season._id} className="bg-gray-900">
                <td className="p-2 border border-gray-800">{season.name}</td>
                <td className="p-2 border border-gray-800">
                  {format(new Date(season.startDate), "d MMMM yyyy", {
                    locale: tr,
                  })}
                </td>
                <td className="p-2 border border-gray-800">
                  {format(new Date(season.endDate), "d MMMM yyyy", {
                    locale: tr,
                  })}
                </td>
                <td className="p-2 border border-gray-800">{season.status}</td>
                <td className="p-2 border border-gray-800">
                  <button
                    onClick={() =>
                      router.push(`/admin/seasons/edit/${season._id}`)
                    }
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(season._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
