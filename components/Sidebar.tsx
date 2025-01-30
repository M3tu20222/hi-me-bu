"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import {
  Home,
  Users,
  Calendar,
  Droplet,
  Map,
  Sprout,
  FlaskRoundIcon as Flask,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const routes = [
    {
      label: "Ana Sayfa",
      icon: Home,
      href: "/dashboard",
      color: "text-sky-500",
    },
  ];

  if (session?.user?.role === "Admin") {
    routes.push(
      {
        label: "Kullanıcı Yönetimi",
        icon: Users,
        href: "/admin/users",
        color: "text-violet-500",
      },
      {
        label: "Sezon Yönetimi",
        icon: Calendar,
        color: "text-pink-700",
        href: "/admin/seasons",
      },
      {
        label: "Kuyu Yönetimi",
        icon: Droplet,
        color: "text-orange-700",
        href: "/admin/wells",
      },
      {
        label: "Tarla Yönetimi",
        icon: Map,
        color: "text-emerald-500",
        href: "/admin/fields",
      },
      {
        label: "Ürün Yönetimi",
        icon: Sprout,
        color: "text-green-700",
        href: "/admin/products",
      },
      {
        label: "Gübre Yönetimi",
        icon: Flask,
        color: "text-blue-700",
        href: "/admin/fertilizers",
      }
    );
  }

  if (session?.user?.role === "Ortak") {
    routes.push(
      {
        label: "Kuyu Listesi",
        icon: Droplet,
        color: "text-orange-700",
        href: "/ortak/wells",
      },
      {
        label: "Tarla Listesi",
        icon: Map,
        color: "text-emerald-500",
        href: "/ortak/fields",
      }
    );
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Çiftçilik Sistemi</h1>
        </Link>
        <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href ? "bg-white/10" : ""
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
