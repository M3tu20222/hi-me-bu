"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FieldForm from "@/components/admin/FieldForm";
import type { Field } from "@/types/field";

export default function EditFieldPage({ params }: { params: { id: string } }) {
  const [field, setField] = useState<Field | null>(null);
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

    const fetchField = async () => {
      try {
        const response = await fetch(`/api/fields/${params.id}`);
        if (!response.ok) {
          throw new Error("Tarla bilgileri yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setField(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchField();
  }, [params.id, router, session, status]);

  if (status === "loading" || isLoading)
    return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!field) return <div className="text-red-500">Tarla bulunamadı</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">Tarla Düzenle</h1>
      <FieldForm field={field} />
    </div>
  );
}
