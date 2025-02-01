import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { SeasonSwitcher } from "@/components/SeasonSwitcher";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import { SeasonProvider } from "@/contexts/SeasonContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";
import dbConnect from "@/lib/dbConnect";
import { Season } from "@/lib/models";
import type { Season as SeasonType } from "@/types/season";

const inter = Inter({ subsets: ["latin"] });

async function getSeasons(): Promise<SeasonType[]> {
  await dbConnect();
  const seasons = await Season.find({ status: "Aktif" }).sort({
    startDate: -1,
  });
  return JSON.parse(JSON.stringify(seasons));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const seasons = await getSeasons();
  const currentSeason = seasons[0] as SeasonType;

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <SessionProvider session={session}>
          <SeasonProvider initialSeason={currentSeason}>
            <SidebarProvider defaultOpen={false}>
              <div className="min-h-screen bg-gray-900">
                <div className="md:hidden">
                  <MobileNav />
                </div>
                <div className="md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
                  <Sidebar />
                </div>
                <main className="md:pl-72">
                  <div className="flex items-center justify-between px-4 py-4 bg-gray-900 border-b border-gray-800">
                    <h1 className="text-2xl font-semibold text-white ml-12 md:ml-0">
                      Çiftçilik Sistemi
                    </h1>
                    {seasons.length > 0 && (
                      <SeasonSwitcher
                        seasons={seasons}
                        currentSeason={currentSeason}
                      />
                    )}
                  </div>
                  <div className="p-4 bg-gray-900 min-h-screen">{children}</div>
                </main>
              </div>
            </SidebarProvider>
          </SeasonProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
