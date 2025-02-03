"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IInventoryItem } from "@/models/Inventory";

export default function InventoryList() {
  const { data: session } = useSession();
  const [inventoryItems, setInventoryItems] = useState<IInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        throw new Error("Envanter öğeleri yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setInventoryItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (
      window.confirm("Bu envanter öğesini silmek istediğinizden emin misiniz?")
    ) {
      try {
        const response = await fetch(`/api/inventory/${itemId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Envanter öğesi silinirken bir hata oluştu");
        }
        setInventoryItems(inventoryItems.filter((item) => item._id !== itemId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    }
  };

  if (isLoading)
    return (
      <div className="text-center p-4 text-neon-blue animate-pulse">
        Yükleniyor...
      </div>
    );
  if (error)
    return <div className="text-center text-neon-pink p-4">{error}</div>;

  return (
    <Card className="w-full bg-gray-900 border border-neon-blue shadow-lg shadow-neon-blue/50">
      <CardHeader className="border-b border-neon-blue">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-neon-pink">
            Envanter Listesi
          </CardTitle>
          {session?.user.role === "Admin" && (
            <Link href="/admin/inventory/add" passHref>
              <Button className="bg-neon-blue hover:bg-neon-pink text-black font-bold transition-colors duration-300">
                Yeni Envanter Öğesi Ekle
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neon-blue">
              <TableHead className="text-neon-pink">Ad</TableHead>
              <TableHead className="text-neon-pink">Kategori</TableHead>
              <TableHead className="text-neon-pink">Miktar</TableHead>
              <TableHead className="text-neon-pink">Birim</TableHead>
              <TableHead className="text-neon-pink">Mevcut Değer</TableHead>
              <TableHead className="text-neon-pink">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow
                key={item._id}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200"
              >
                <TableCell className="text-neon-blue">{item.name}</TableCell>
                <TableCell className="text-neon-green">
                  {item.category}
                </TableCell>
                <TableCell className="text-neon-yellow">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-neon-orange">{item.unit}</TableCell>
                <TableCell className="text-neon-purple">
                  {item.currentValue} TL
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/inventory/edit/${item._id}`} passHref>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-black transition-colors duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                      className="bg-neon-pink/20 hover:bg-neon-pink text-neon-pink hover:text-black transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
