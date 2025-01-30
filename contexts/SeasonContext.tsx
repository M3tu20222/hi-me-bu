"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Season } from "@/types/season";

interface SeasonContextType {
  currentSeason: Season | null;
  setCurrentSeason: (season: Season) => void;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export function SeasonProvider({
  children,
  initialSeason,
}: {
  children: React.ReactNode;
  initialSeason: Season;
}) {
  const [currentSeason, setCurrentSeason] = useState<Season>(initialSeason);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const seasonId = searchParams.get("season");
    if (seasonId && seasonId !== currentSeason._id) {
      // Burada API'den yeni sezon bilgisini almalısınız
      // Şimdilik sadece ID'yi güncelliyoruz
      setCurrentSeason(
        (prevSeason) =>
          ({
            ...prevSeason,
            _id: seasonId,
          } as Season)
      );
    }
  }, [searchParams, currentSeason._id]);

  return (
    <SeasonContext.Provider value={{ currentSeason, setCurrentSeason }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error("useSeason must be used within a SeasonProvider");
  }
  return context;
}
