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
              <div className="flex min-h-screen bg-[#0a0c10]">
                {/* Mobile Navigation */}
                <div className="md:hidden">
                  <MobileNav />
                </div>

                {/* Sidebar */}
                <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
                  <Sidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 md:pl-72">
                  {/* Header */}
                  <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-[#0a0c10] border-b border-[#1b1f2a]">
                    <h1 className="text-2xl font-semibold text-white ml-12 md:ml-0">
                      Çiftçilik Sistemi
                    </h1>
                    {seasons.length > 0 && (
                      <SeasonSwitcher
                        seasons={seasons}
                        currentSeason={currentSeason}
                      />
                    )}
                  </header>

                  {/* Page Content */}
                  <main className="flex-1">
                    <div className="container mx-auto p-4 bg-[#0a0c10] min-h-[calc(100vh-4rem)]">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </SeasonProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
