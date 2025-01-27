"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Well } from "@/types/well";
import type { User } from "@/types/user";

export default function WellForm({ well }: { well?: Well }) {
  const [name, setName] = useState(well?.name ?? "");
  const [location, setLocation] = useState(well?.location ?? "");
  const [region, setRegion] = useState(well?.region ?? "");
  const [depth, setDepth] = useState(well?.depth ?? 0);
  const [capacity, setCapacity] = useState(well?.capacity ?? 0);
  const [status, setStatus] = useState<Well["status"]>(well?.status ?? "Aktif");
  const [responsibleUserId, setResponsibleUserId] = useState(
    well?.responsibleUser?._id ?? ""
  );
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Kullanıcılar yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Kullanıcılar yüklenirken hata:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const wellData = {
      name,
      location,
      region,
      depth,
      capacity,
      status,
      responsibleUser: responsibleUserId,
    };
    const url = well ? `/api/wells/${well._id}` : "/api/wells";
    const method = well ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wellData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      router.push("/admin/wells");
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
      <div className="mb-4">
        <label htmlFor="name" className="block text-neon-blue mb-2">
          Kuyu Adı
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
        <label htmlFor="region" className="block text-neon-blue mb-2">
          Bölge
        </label>
        <input
          type="text"
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="depth" className="block text-neon-blue mb-2">
          Derinlik (m)
        </label>
        <input
          type="number"
          id="depth"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="capacity" className="block text-neon-blue mb-2">
          Kapasite (m³/saat)
        </label>
        <input
          type="number"
          id="capacity"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block text-neon-blue mb-2">
          Durum
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Well["status"])}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        >
          <option value="Aktif">Aktif</option>
          <option value="Bakımda">Bakımda</option>
          <option value="Kapalı">Kapalı</option>
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="responsibleUser" className="block text-neon-blue mb-2">
          Sorumlu Kullanıcı
        </label>
        <select
          id="responsibleUser"
          value={responsibleUserId}
          onChange={(e) => setResponsibleUserId(e.target.value)}
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
      <button
        type="submit"
        className="cyberpunk-button w-full"
        disabled={isLoading}
      >
        {isLoading ? "İşleniyor..." : well ? "Güncelle" : "Kuyu Ekle"}
      </button>
    </form>
  );
}
