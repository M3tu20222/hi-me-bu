"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Check, X } from "lucide-react";
import type { Field } from "@/types/field";
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

interface FieldOwnership {
  userId: string;
  ownershipPercentage: number;
  ownerName: string;
}

interface FieldWithOwnership extends Field {
  owners: FieldOwnership[];
}

const getOwnershipColor = (index: number) => {
  const colors = [
    "from-blue-500",
    "from-green-500",
    "from-purple-500",
    "from-yellow-500",
    "from-pink-500",
  ];
  return colors[index % colors.length];
};

const OwnershipBadge = ({
  ownership,
  index,
  totalOwners,
}: {
  ownership: FieldOwnership;
  index: number;
  totalOwners: number;
}) => {
  return (
    <div
      className="relative w-8 h-8 rounded-full overflow-hidden mr-1 mb-1 inline-block group"
      title={`${ownership.ownerName}: ${ownership.ownershipPercentage}%`}
    >
      {totalOwners === 1 ? (
        <div
          className={`absolute inset-0 bg-gradient-to-b ${getOwnershipColor(
            index
          )} to-transparent`}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-b ${getOwnershipColor(
            index
          )} to-transparent`}
          style={{
            height: `${ownership.ownershipPercentage}%`,
            top: index === 0 ? "0" : `${100 - ownership.ownershipPercentage}%`,
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
        {ownership.ownerName ? ownership.ownerName[0].toUpperCase() : "?"}
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-75 text-white text-xs transition-opacity duration-200">
        {ownership.ownershipPercentage}%
      </div>
    </div>
  );
};

export default function FieldList() {
  const { data: session } = useSession();
  const [fields, setFields] = useState<FieldWithOwnership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = session?.user?.role === "Admin";

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch("/api/fields");
        if (!response.ok) {
          throw new Error("Tarlalar yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setFields(data.fields || []);
      } catch (err) {
        console.error("Error fetching fields:", err);
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFields();
  }, []);

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
    <Card className="bg-[#0a0c10] border-[#1b1f2a] overflow-hidden">
      <CardHeader className="border-b border-[#1b1f2a]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">
            Tarla Listesi
          </CardTitle>
          {isAdmin && (
            <Link
              href="/admin/fields/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Yeni Tarla Ekle
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
                  <TableHead className="w-[140px]">Ad</TableHead>
                  <TableHead className="w-[100px]">Dekar</TableHead>
                  <TableHead className="w-[140px]">Sahipler</TableHead>
                  <TableHead className="w-[140px]">Ürün</TableHead>
                  <TableHead className="w-[140px]">Durum</TableHead>
                  <TableHead className="w-[100px]">Sulanan</TableHead>
                  <TableHead className="w-[100px]">Kiralık</TableHead>
                  <TableHead className="w-[140px]">Ada-Parsel</TableHead>
                  <TableHead className="w-[100px]">Sezon</TableHead>
                  {isAdmin && (
                    <TableHead className="w-[100px]">İşlemler</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow
                    key={field._id}
                    className="border-b border-gray-700"
                  >
                    <TableCell className="font-medium text-pink-500">
                      {field.name}
                    </TableCell>
                    <TableCell>{field.size}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap">
                        {field.owners && field.owners.length > 0 ? (
                          field.owners.map((ownership, index) => (
                            <OwnershipBadge
                              key={index}
                              ownership={ownership}
                              index={index}
                              totalOwners={field.owners.length}
                            />
                          ))
                        ) : (
                          <span className="text-gray-500">
                            Sahip bilgisi yok
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {field.products && field.products.length > 0
                        ? field.products
                            .map((product) => product.name)
                            .join(", ")
                        : field.crop || "Belirlenmemiş"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          field.status === "Ekili"
                            ? "bg-green-500 text-white"
                            : field.status === "Sürüldü"
                            ? "bg-yellow-500 text-black"
                            : field.status === "Boş"
                            ? "bg-red-500 text-white"
                            : field.status === "Hazırlanıyor"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {field.status}
                      </span>
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
                    <TableCell>{field.blockParcel || "-"}</TableCell>
                    <TableCell>
                      {field.season?.year
                        ? `${field.season.year.toString().slice(-2)}-${(
                            field.season.year + 1
                          )
                            .toString()
                            .slice(-2)}`
                        : "Belirlenmemiş"}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/fields/edit/${field._id}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(field._id)}
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
          {fields.map((field) => (
            <Card key={field._id} className="mb-4 bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-pink-500 mb-2">
                  {field.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Dekar:</span>
                    <span className="text-white ml-1">{field.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ürün:</span>
                    <span className="text-white ml-1">
                      {field.products && field.products.length > 0
                        ? field.products
                            .map((product) => product.name)
                            .join(", ")
                        : field.crop || "Belirlenmemiş"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Durum:</span>
                    <span
                      className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        field.status === "Ekili"
                          ? "bg-green-500 text-white"
                          : field.status === "Sürüldü"
                          ? "bg-yellow-500 text-black"
                          : field.status === "Boş"
                          ? "bg-red-500 text-white"
                          : field.status === "Hazırlanıyor"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {field.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Sulanan:</span>
                    <span className="text-white ml-1">
                      {field.isIrrigated ? (
                        <Check className="h-5 w-5 text-green-500 inline" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 inline" />
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Kiralık:</span>
                    <span className="text-white ml-1">
                      {field.isRented ? (
                        <Check className="h-5 w-5 text-green-500 inline" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 inline" />
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ada-Parsel:</span>
                    <span className="text-white ml-1">
                      {field.blockParcel || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Sezon:</span>
                    <span className="text-white ml-1">
                      {field.season?.year
                        ? `${field.season.year.toString().slice(-2)}-${(
                            field.season.year + 1
                          )
                            .toString()
                            .slice(-2)}`
                        : "Belirlenmemiş"}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400">Sahipler:</span>
                  <div className="flex flex-wrap mt-1">
                    {field.owners && field.owners.length > 0 ? (
                      field.owners.map((ownership, index) => (
                        <OwnershipBadge
                          key={index}
                          ownership={ownership}
                          index={index}
                          totalOwners={field.owners.length}
                        />
                      ))
                    ) : (
                      <span className="text-gray-500">Sahip bilgisi yok</span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex justify-end gap-2">
                    <Link
                      href={`/admin/fields/edit/${field._id}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(field._id)}
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
