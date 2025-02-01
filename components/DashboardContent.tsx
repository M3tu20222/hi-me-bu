"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DashboardData {
  totalFields: number;
  activeFields: number;
  totalWells: number;
  totalUsers?: number;
}

export default function DashboardContent() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError("Dashboard verileri yüklenirken bir hata oluştu");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <>
      <p className="text-xl mb-8 text-white">
        Hoş geldiniz, {session?.user?.name || "Kullanıcı"}!
      </p>
      <p className="text-lg mb-8 text-neon-pink">Rol: {session?.user?.role}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-neon-blue">
          <CardHeader>
            <CardTitle className="text-neon-blue">Toplam Tarla</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {dashboardData?.totalFields || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-neon-blue">
          <CardHeader>
            <CardTitle className="text-neon-blue">Toplam Kuyu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {dashboardData?.totalWells || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-neon-blue">
          <CardHeader>
            <CardTitle className="text-neon-blue">Aktif Tarlalar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {dashboardData?.activeFields || 0}
            </p>
          </CardContent>
        </Card>

        {session?.user?.role === "Admin" && (
          <Card className="bg-gray-800 border-neon-blue">
            <CardHeader>
              <CardTitle className="text-neon-blue">Toplam Kullanıcı</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">
                {dashboardData?.totalUsers || 0}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
