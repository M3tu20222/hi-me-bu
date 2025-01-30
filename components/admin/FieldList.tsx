"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Check, X } from "lucide-react";
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

interface Product {
  _id: string;
  name: string;
  category: string;
  unit: string;
  isActive: boolean;
}

interface Season {
  _id: string;
  name: string;
}

interface Field {
  _id: string;
  name: string;
  size: number;
  location: string;
  products: Product[];
  season: Season;
  status: "Boş" | "Sürüldü" | "Hazırlanıyor" | "Ekili";
  isIrrigated: boolean;
  isRented: boolean;
  blockParcel: string;
}

const statusColors = {
  Boş: "text-red-500",
  Sürüldü: "text-orange-500",
  Hazırlanıyor: "text-yellow-500",
  Ekili: "text-green-500",
};

export default function FieldList() {
  const { data: session } = useSession();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await fetch("/api/fields");
      if (!response.ok) {
        throw new Error("Tarlalar yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setFields(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fieldId: string) => {
    if (window.confirm("Bu tarlayı silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/fields/${fieldId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Tarla silinirken bir hata oluştu");
        }
        setFields(fields.filter((field) => field._id !== fieldId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    }
  };

  if (isLoading) return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">
            Tarla Listesi
          </CardTitle>
          {session?.user.role === "Admin" && (
            <Link href="/admin/fields/add" className="cyberpunk-button">
              Yeni Tarla Ekle
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-neon-blue">Ad</TableHead>
              <TableHead className="text-neon-blue">Boyut (Dönüm)</TableHead>
              <TableHead className="text-neon-blue">Konum</TableHead>
              <TableHead className="text-neon-blue">Ürün</TableHead>
              <TableHead className="text-neon-blue">Sezon</TableHead>
              <TableHead className="text-neon-blue">Durum</TableHead>
              <TableHead className="text-neon-blue">Sulanan</TableHead>
              <TableHead className="text-neon-blue">Kiralık</TableHead>
              <TableHead className="text-neon-blue">Ada-Parsel</TableHead>
              <TableHead className="text-neon-blue">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field._id} className="border-gray-800">
                <TableCell className="text-white">
                  {field.name || "-"}
                </TableCell>
                <TableCell className="text-white">
                  {field.size ? field.size.toFixed(3) : "-"}
                </TableCell>
                <TableCell className="text-white">
                  {field.location || "-"}
                </TableCell>
                <TableCell className="text-white">
                  {field.products && field.products.length > 0
                    ? field.products.map((p) => p.name).join(", ")
                    : field.status === "Ekili"
                    ? "Belirtilmemiş"
                    : "-"}
                </TableCell>
                <TableCell className="text-white">
                  {field.season
                    ? field.season.name.replace(" Sezonu", "")
                    : "-"}
                </TableCell>
                <TableCell
                  className={statusColors[field.status] || "text-white"}
                >
                  {field.status || "-"}
                </TableCell>
                <TableCell>
                  {field.isIrrigated ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  {field.isRented ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell className="text-white">
                  {field.blockParcel || "-"}
                </TableCell>
                <TableCell className="space-x-2">
                  <Link
                    href={`/admin/fields/edit/${field._id}`}
                    className="text-neon-blue hover:text-neon-pink inline-block"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(field._id)}
                    className="text-neon-pink hover:text-neon-blue inline-block"
                  >
                    <Trash2 size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
