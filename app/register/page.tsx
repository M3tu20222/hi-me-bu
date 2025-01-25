"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("İşçi");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kayıt işlemi sırasında hata:", error);
      setError(
        "Kayıt işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-black bg-opacity-70 rounded-lg border border-neon-pink shadow-neon"
        >
          <h2 className="text-3xl font-bold mb-6 text-neon-pink">Kayıt Ol</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-neon-blue mb-2">
              Ad Soyad
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border border-neon-pink focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
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
              className="w-full p-2 bg-gray-800 rounded border border-neon-pink focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-neon-blue mb-2">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border border-neon-pink focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-neon-blue mb-2">
              Rol
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border border-neon-pink focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
              required
            >
              <option value="İşçi">İşçi</option>
              <option value="Ortak">Ortak</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full btn-neon-pink mb-4"
            disabled={isLoading}
          >
            {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
          <p className="text-center">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-neon-blue hover:underline">
              Giriş Yap
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
