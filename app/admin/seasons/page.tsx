"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SeasonList from "@/components/SeasonList";
import CreateSeasonForm from "@/components/CreateSeasonForm";

export default function AdminSeasonsPage() {
  const { data: session, status } = useSession();
  const [seasons, setSeasons] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "Admin") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    const res = await fetch("/api/seasons");
    if (res.ok) {
      const data = await res.json();
      setSeasons(data);
    }
  };

  const handleSeasonCreated = () => {
    fetchSeasons();
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "Admin") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neon-blue">Sezon Yönetimi</h1>
      <CreateSeasonForm onSeasonCreated={handleSeasonCreated} />
      <SeasonList seasons={seasons} onSeasonDeleted={handleSeasonCreated} />
    </div>
  );
}
