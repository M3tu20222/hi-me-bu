"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditSeasonPage({ params }: { params: { id: string } }) {
  const [season, setSeason] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSeason = async () => {
      const res = await fetch(`/api/seasons/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setSeason(data);
      } else {
        setError("Sezon yüklenirken bir hata oluştu.");
      }
    };
    fetchSeason();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/seasons/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(season),
      });

      if (res.ok) {
        router.push("/admin/seasons");
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Sezon güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Sezon güncelleme hatası:", error);
      setError("Sezon güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (!season) return <div>Yükleniyor...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">Sezonu Düzenle</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neon-blue mb-2"
          >
            Sezon Adı
          </label>
          <input
            type="text"
            id="name"
            value={season.name}
            onChange={(e) => setSeason({ ...season, name: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded border border-neon-blue focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-neon-blue mb-2"
          >
            Durum
          </label>
          <select
            id="status"
            value={season.status}
            onChange={(e) => setSeason({ ...season, status: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded border border-neon-blue focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
          >
            <option value="Aktif">Aktif</option>
            <option value="Pasif">Pasif</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full btn-neon-blue"
          disabled={isLoading}
        >
          {isLoading ? "Güncelleniyor..." : "Güncelle"}
        </button>
      </form>
    </div>
  );
}
