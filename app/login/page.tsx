"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Giriş sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Yükleniyor...</div>;
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-black bg-opacity-70 rounded-lg border border-neon-blue shadow-neon"
        >
          <h2 className="text-3xl font-bold mb-6 text-neon-blue">Giriş Yap</h2>
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-neon-pink mb-2">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-neon-pink mb-2">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full btn-neon-blue mb-4"
            disabled={isLoading}
          >
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
          <p className="text-center">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-neon-pink hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
