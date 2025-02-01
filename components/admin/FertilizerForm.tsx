"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Fertilizer } from "@/types/fertilizer";
import type { Season } from "@/types/season";

interface FertilizerFormProps {
  fertilizer?: Fertilizer;
  seasons: Season[];
}

export default function FertilizerForm({
  fertilizer,
  seasons,
}: FertilizerFormProps) {
  const [name, setName] = useState(fertilizer?.name ?? "");
  const [type, setType] = useState<Fertilizer["type"]>(
    fertilizer?.type ?? "Katı"
  );
  const [unit, setUnit] = useState<Fertilizer["unit"]>(
    fertilizer?.unit ?? "ton"
  );
  const [kgPerBag, setKgPerBag] = useState(fertilizer?.kgPerBag ?? 0);
  const [currentStock, setCurrentStock] = useState(
    fertilizer?.currentStock ?? 0
  );
  const [price, setPrice] = useState(fertilizer?.price ?? 0);
  const [status, setStatus] = useState<Fertilizer["status"]>(
    fertilizer?.status ?? "Aktif"
  );
  const [season, setSeason] = useState<string>(
    fertilizer?.season &&
      typeof fertilizer.season === "object" &&
      "_id" in fertilizer.season
      ? fertilizer.season._id.toString()
      : fertilizer?.season?.toString() || ""
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const fertilizerData = {
      name,
      type,
      unit,
      kgPerBag: unit === "çuval" ? kgPerBag : undefined,
      currentStock,
      price,
      status,
      season: season || undefined,
    };

    try {
      const response = await fetch(
        fertilizer ? `/api/fertilizers/${fertilizer._id}` : "/api/fertilizers",
        {
          method: fertilizer ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fertilizerData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      router.push("/admin/fertilizers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 shadow-lg rounded-lg p-6 cyberpunk-border"
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-neon-blue mb-2">
            Gübre Adı
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-neon-blue mb-2">
            Tip
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as Fertilizer["type"])}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="Katı">Katı</option>
            <option value="Sıvı">Sıvı</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="unit" className="block text-neon-blue mb-2">
            Birim
          </label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as Fertilizer["unit"])}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="ton">Ton</option>
            <option value="litre">Litre</option>
            <option value="çuval">Çuval</option>
          </select>
        </div>

        {unit === "çuval" && (
          <div className="mb-4">
            <label htmlFor="kgPerBag" className="block text-neon-blue mb-2">
              Çuval Başına KG
            </label>
            <input
              type="number"
              id="kgPerBag"
              value={kgPerBag}
              onChange={(e) => setKgPerBag(Number(e.target.value))}
              className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
              required
              min="0"
              step="0.01"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="currentStock" className="block text-neon-blue mb-2">
            Mevcut Stok
          </label>
          <input
            type="number"
            id="currentStock"
            value={currentStock}
            onChange={(e) => setCurrentStock(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-neon-blue mb-2">
            Fiyat
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-neon-blue mb-2">
            Durum
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Fertilizer["status"])}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="Aktif">Aktif</option>
            <option value="Pasif">Pasif</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="season" className="block text-neon-blue mb-2">
            Sezon
          </label>
          <select
            id="season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="">Sezon Seçin</option>
            {seasons.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="cyberpunk-button w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? "İşleniyor..." : fertilizer ? "Güncelle" : "Gübre Ekle"}
      </button>
    </form>
  );
}
