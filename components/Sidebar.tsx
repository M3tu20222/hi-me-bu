"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Users,
  Calendar,
  Droplet,
  Map,
  Sprout,
  FlaskRoundIcon as Flask,
  LogOut,
  X,
  FolderTree,
  Clipboard,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { open, setOpen } = useSidebar();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

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
      },
      {
        label: "Envanter Yönetimi",
        icon: Clipboard,
        color: "text-yellow-500",
        href: "/admin/inventory",
      },
      {
        label: "Kategori Yönetimi",
        icon: FolderTree,
        color: "text-yellow-500",
        href: "/admin/categories",
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

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0a0c10] text-white">
      <div className="flex-1 px-3 py-4">
        <Link href="/dashboard" className="flex items-center pl-3 mb-10">
          <h1 className="text-2xl font-bold">Çiftçilik Sistemi</h1>
        </Link>
        <ScrollArea className="h-[calc(100vh-10rem)]">
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
      <div className="mt-auto p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full w-full flex-col bg-[#0a0c10]">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-[#0a0c10]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white md:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
