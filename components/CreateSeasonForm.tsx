"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateSeasonFormProps {
  onSeasonCreated: () => void;
}

export default function CreateSeasonForm({
  onSeasonCreated,
}: CreateSeasonFormProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year }),
      });

      if (res.ok) {
        setYear(new Date().getFullYear()); // Reset the form
        onSeasonCreated(); // Call the callback function
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Sezon oluşturma hatası");
      }
    } catch (error) {
      console.error("Sezon oluşturma hatası:", error);
      setError("Sezon oluşturma sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-neon-pink">
        Yeni Sezon Oluştur
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label
          htmlFor="year"
          className="block text-sm font-medium text-neon-blue mb-2"
        >
          Başlangıç Yılı
        </label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full p-2 bg-gray-700 rounded border border-neon-blue focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full btn-neon-blue"
        disabled={isLoading}
      >
        {isLoading ? "Oluşturuluyor..." : "Sezon Oluştur"}
      </button>
    </form>
  );
}
