"use client";

import { useState, useEffect } from "react";
import type { Fertilizer } from "@/types/fertilizer";

interface FertilizerSelectorProps {
  onSelect: (fertilizer: Fertilizer) => void;
}

export default function FertilizerSelector({
  onSelect,
}: FertilizerSelectorProps) {
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFertilizers = async () => {
      try {
        const response = await fetch("/api/fertilizers");
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

    fetchFertilizers();
  }, []);

  if (isLoading) return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mb-4">
      <label htmlFor="fertilizer" className="block text-neon-blue mb-2">
        Gübre Seçin
      </label>
      <select
        id="fertilizer"
        onChange={(e) => {
          const selected = fertilizers.find((f) => f._id === e.target.value);
          if (selected) onSelect(selected);
        }}
        className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
      >
        <option value="">Seçiniz</option>
        {fertilizers.map((fertilizer) => (
          <option key={fertilizer._id} value={fertilizer._id}>
            {fertilizer.name} - {fertilizer.type} ({fertilizer.unit})
          </option>
        ))}
      </select>
    </div>
  );
}
