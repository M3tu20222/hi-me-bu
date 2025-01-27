"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import WellForm from "@/components/admin/WellForm";
import type { Well } from "@/types/well";

export default function EditWellPage({ params }: { params: { id: string } }) {
  const [well, setWell] = useState<Well | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "Admin") {
      router.push("/dashboard");
      return;
    }

    const fetchWell = async () => {
      try {
        const response = await fetch(`/api/wells/${params.id}`);
        if (!response.ok) {
          throw new Error("Kuyu bilgileri yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setWell(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWell();
  }, [params.id, router, session, status]);

  if (isLoading) return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!well) return <div className="text-red-500">Kuyu bulunamadı</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">Kuyu Düzenle</h1>
      <WellForm well={well} />
    </div>
  );
}
