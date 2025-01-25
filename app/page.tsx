import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 bg-black bg-opacity-70 rounded-lg border border-neon-blue shadow-neon">
          <h1 className="text-5xl font-bold mb-4 text-neon-pink">
            Çiftçilik Sistemi
          </h1>
          <p className="text-xl mb-8 text-neon-blue">
            Geleceğin tarımına hoş geldiniz
          </p>
          <div className="space-x-4">
            <Link href="/login" className="btn-neon-blue">
              Giriş Yap
            </Link>
            <Link href="/register" className="btn-neon-pink">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
