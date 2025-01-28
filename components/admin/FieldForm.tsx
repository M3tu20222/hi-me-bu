"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@/types/field";
import type { User } from "@/types/user";
import type { Well } from "@/types/well";
import type { Season } from "@/types/season";

export default function FieldForm({ field }: { field?: Field }) {
  const [name, setName] = useState(field?.name ?? "");
  const [size, setSize] = useState(field?.size ?? 0);
  const [location, setLocation] = useState(field?.location ?? "");
  const [owner, setOwner] = useState(field?.owner?._id ?? "");
  const [well, setWell] = useState(field?.well?._id ?? "");
  const [crop, setCrop] = useState(field?.crop ?? "");
  const [status, setStatus] = useState<Field["status"]>(field?.status ?? "Boş");
  const [isIrrigated, setIsIrrigated] = useState(field?.isIrrigated ?? false);
  const [season, setSeason] = useState(field?.season?._id ?? "");
  const [isRented, setIsRented] = useState(field?.isRented ?? false);
  const [blockParcel, setBlockParcel] = useState(field?.blockParcel ?? "");
  const [users, setUsers] = useState<User[]>([]);
  const [wells, setWells] = useState<Well[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, wellsResponse, seasonsResponse] =
          await Promise.all([
            fetch("/api/users"),
            fetch("/api/wells"),
            fetch("/api/seasons"),
          ]);
        if (!usersResponse.ok || !wellsResponse.ok || !seasonsResponse.ok) {
          throw new Error("Veri yüklenirken bir hata oluştu");
        }
        const [usersData, wellsData, seasonsData] = await Promise.all([
          usersResponse.json(),
          wellsResponse.json(),
          seasonsResponse.json(),
        ]);
        setUsers(usersData);
        setWells(wellsData);
        setSeasons(seasonsData);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const fieldData = {
      name,
      size,
      location,
      owner,
      well,
      crop,
      status,
      isIrrigated,
      season,
      isRented,
      blockParcel,
    };

    const url = field ? `/api/fields/${field._id}` : "/api/fields";
    const method = field ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      router.push("/admin/fields");
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
            Tarla Adı
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
          <label htmlFor="size" className="block text-neon-blue mb-2">
            Boyut (Dönüm)
          </label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
            step="0.1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-neon-blue mb-2">
            Konum
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="">Seçiniz</option>
            <option value="Yukarı">Yukarı</option>
            <option value="Aşağı">Aşağı</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="owner" className="block text-neon-blue mb-2">
            Sahibi
          </label>
          <select
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          >
            <option value="">Seçiniz</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="well" className="block text-neon-blue mb-2">
            Kuyu
          </label>
          <select
            id="well"
            value={well}
            onChange={(e) => setWell(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          >
            <option value="">Seçiniz</option>
            {wells.map((well) => (
              <option key={well._id} value={well._id}>
                {well.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="crop" className="block text-neon-blue mb-2">
            Ürün
          </label>
          <select
            id="crop"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          >
            <option value="">Seçiniz</option>
            <option value="Mısır">Mısır</option>
            <option value="Buğday">Buğday</option>
            <option value="Fasulye">Fasulye</option>
            <option value="Kanola">Kanola</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-neon-blue mb-2">
            Durum
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Field["status"])}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="Ekili">Ekili</option>
            <option value="Boş">Boş</option>
            <option value="Hazırlanıyor">Hazırlanıyor</option>
            <option value="Sürüldü">Sürüldü</option>
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
          >
            <option value="">Seçiniz</option>
            {seasons.map((season) => (
              <option key={season._id} value={season._id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="blockParcel" className="block text-neon-blue mb-2">
            Ada-Parsel
          </label>
          <input
            type="text"
            id="blockParcel"
            value={blockParcel}
            onChange={(e) => setBlockParcel(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            placeholder="132-45"
          />
        </div>
        <div className="mb-4 flex items-center space-x-4">
          <label className="flex items-center text-neon-blue">
            <input
              type="checkbox"
              checked={isIrrigated}
              onChange={(e) => setIsIrrigated(e.target.checked)}
              className="mr-2"
            />
            Sulanan Tarla
          </label>
          <label className="flex items-center text-neon-blue">
            <input
              type="checkbox"
              checked={isRented}
              onChange={(e) => setIsRented(e.target.checked)}
              className="mr-2"
            />
            Kiralık
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="cyberpunk-button w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? "İşleniyor..." : field ? "Güncelle" : "Tarla Ekle"}
      </button>
    </form>
  );
}
