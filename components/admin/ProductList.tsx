"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ProductList() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = session?.user?.role === "Admin";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Ürünler yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Ürün silinirken bir hata oluştu");
        }
        setProducts(products.filter((product) => product._id !== productId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    }
  };

  if (isLoading) return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="bg-[#0a0c10] border-[#1b1f2a] overflow-hidden">
      <CardHeader className="border-b border-[#1b1f2a]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">
            Ürün Listesi
          </CardTitle>
          {isAdmin && (
            <Link
              href="/admin/products/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Yeni Ürün Ekle
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop view */}
        <div className="hidden md:block">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Ürün Adı</TableHead>
                  <TableHead className="w-[150px]">Kategori</TableHead>
                  <TableHead className="w-[150px]">Marka</TableHead>
                  <TableHead className="w-[100px]">Birim</TableHead>
                  <TableHead className="w-[150px]">Sezon</TableHead>
                  {isAdmin && (
                    <TableHead className="w-[100px]">İşlemler</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product._id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      {product.season &&
                      typeof product.season === "object" &&
                      "name" in product.season
                        ? product.season.name
                        : "Belirlenmemiş"}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-pink-500 hover:text-pink-400"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {products.map((product) => (
            <Card
              key={product._id}
              className="mb-4 bg-gray-800 border-gray-700"
            >
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Kategori:</span>
                    <span className="text-white ml-1">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Marka:</span>
                    <span className="text-white ml-1">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Birim:</span>
                    <span className="text-white ml-1">{product.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Sezon:</span>
                    <span className="text-white ml-1">
                      {product.season &&
                      typeof product.season === "object" &&
                      "name" in product.season
                        ? product.season.name
                        : "Belirlenmemiş"}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex justify-end gap-2">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-pink-500 hover:text-pink-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
