"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";

export default function UserForm({ user }: { user?: User | null }) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>(user?.role ?? "İşçi");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const userData = { name, email, password, role };
    const url = user ? `/api/users/${user._id}` : "/api/users";
    const method = user ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      router.push("/admin/users");
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
      className="bg-gray-900 shadow-lg rounded-lg p-6"
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label htmlFor="name" className="block text-neon-blue mb-2">
          Ad Soyad
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
        <label htmlFor="email" className="block text-neon-blue mb-2">
          E-posta
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-neon-blue mb-2">
          Şifre {user && "(Boş bırakılırsa değiştirilmez)"}
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          {...(user ? {} : { required: true })}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="role" className="block text-neon-blue mb-2">
          Rol
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as User["role"])}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        >
          <option value="Admin">Admin</option>
          <option value="Ortak">Ortak</option>
          <option value="İşçi">İşçi</option>
        </select>
      </div>
      <button
        type="submit"
        className="btn-neon-blue w-full"
        disabled={isLoading}
      >
        {isLoading ? "İşleniyor..." : user ? "Güncelle" : "Kullanıcı Ekle"}
      </button>
    </form>
  );
}
