"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@/types/field";
import type { User } from "@/types/user";
import type { Season } from "@/types/season";
import type { Well } from "@/types/well";

export default function FieldForm({ field }: { field?: Field }) {
  const [name, setName] = useState(field?.name ?? "");
  const [size, setSize] = useState(field?.size ?? 0);
  const [location, setLocation] = useState(field?.location ?? "");
  const [crop, setCrop] = useState(field?.crop ?? "");
  const [status, setStatus] = useState<Field["status"]>(field?.status ?? "Boş");
  const [isIrrigated, setIsIrrigated] = useState(field?.isIrrigated ?? false);
  const [season, setSeason] = useState(field?.season?._id ?? "");
  const [isRented, setIsRented] = useState(field?.isRented ?? false);
  const [isShared, setIsShared] = useState(field?.isShared ?? false);
  const [blockParcel, setBlockParcel] = useState(field?.blockParcel ?? "");
  const [well, setWell] = useState(field?.well?._id ?? "");
  const [owners, setOwners] = useState<
    { userId: string; percentage: number }[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [wells, setWells] = useState<Well[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, seasonsResponse, wellsResponse] =
          await Promise.all([
            fetch("/api/users"),
            fetch("/api/seasons"),
            fetch("/api/wells"),
          ]);
        if (!usersResponse.ok || !seasonsResponse.ok || !wellsResponse.ok) {
          throw new Error("Veri yüklenirken bir hata oluştu");
        }
        const [usersData, seasonsData, wellsData] = await Promise.all([
          usersResponse.json(),
          seasonsResponse.json(),
          wellsResponse.json(),
        ]);
        setUsers(usersData);
        setSeasons(seasonsData);
        setWells(wellsData);
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
      crop,
      status,
      isIrrigated,
      season,
      isRented,
      isShared,
      blockParcel,
      well,
      owners,
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

  const handleOwnerChange = (
    index: number,
    field: "userId" | "percentage",
    value: string
  ) => {
    const newOwners = [...owners];
    if (field === "userId") {
      newOwners[index].userId = value;
    } else {
      newOwners[index].percentage = Number(value);
    }
    setOwners(newOwners);
  };

  const addOwner = () => {
    setOwners([...owners, { userId: "", percentage: 0 }]);
  };

  const removeOwner = (index: number) => {
    const newOwners = [...owners];
    newOwners.splice(index, 1);
    setOwners(newOwners);
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
            step="0.001"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-neon-blue mb-2">
            Konum
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="crop" className="block text-neon-blue mb-2">
            Ürün
          </label>
          <input
            type="text"
            id="crop"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          />
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
          <label htmlFor="well" className="block text-neon-blue mb-2">
            Bağlı Kuyu
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
        <label className="flex items-center text-neon-blue">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="mr-2"
          />
          Ortak Tarla
        </label>
      </div>

      {isShared && (
        <div className="mb-4">
          <h3 className="text-neon-blue mb-2">Tarla Sahipleri</h3>
          {owners.map((owner, index) => (
            <div key={index} className="flex items-center mb-2">
              <select
                value={owner.userId}
                onChange={(e) =>
                  handleOwnerChange(index, "userId", e.target.value)
                }
                className="w-1/2 p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink mr-2"
              >
                <option value="">Sahip Seçin</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={owner.percentage}
                onChange={(e) =>
                  handleOwnerChange(index, "percentage", e.target.value)
                }
                className="w-1/4 p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink mr-2"
                placeholder="Yüzde"
                min="0"
                max="100"
              />
              <button
                type="button"
                onClick={() => removeOwner(index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Kaldır
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOwner}
            className="bg-neon-blue text-white p-2 rounded mt-2"
          >
            Sahip Ekle
          </button>
        </div>
      )}

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
