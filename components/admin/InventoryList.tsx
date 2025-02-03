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

interface OwnershipDisplay {
  userId: string;
  ownershipPercentage: number;
  ownerName: string;
}

interface Owner {
  userId: {
    _id: string;
    name?: string;
  };
  ownershipPercentage: number;
}

// Update the IInventoryItem interface
interface IInventoryItem {
  _id: string;
  name: string;
  category: string;
  subCategory?: string;
  owners: Owner[];
  quantity: number;
  unit: string;
  currentValue: number;
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
  ownership: OwnershipDisplay;
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

  const isAdmin = session?.user?.role === "Admin";

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
          {isAdmin && (
            <Link href="/admin/inventory/add" passHref>
              <Button className="bg-neon-blue hover:bg-neon-pink text-black font-bold transition-colors duration-300">
                Yeni Envanter Öğesi Ekle
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-neon-blue">
                <TableHead className="text-neon-pink">Ad</TableHead>
                <TableHead className="text-neon-pink">Kategori</TableHead>
                <TableHead className="text-neon-pink">Alt Kategori</TableHead>
                <TableHead className="text-neon-pink">Sahipler</TableHead>
                <TableHead className="text-neon-pink">Miktar</TableHead>
                <TableHead className="text-neon-pink">Birim</TableHead>
                <TableHead className="text-neon-pink">Mevcut Değer</TableHead>
                {isAdmin && (
                  <TableHead className="text-neon-pink">İşlemler</TableHead>
                )}
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
                  <TableCell className="text-neon-green">
                    {item.subCategory || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap">
                      {item.owners && item.owners.length > 0 ? (
                        item.owners.map((owner, index) => (
                          <OwnershipBadge
                            key={owner.userId._id.toString()}
                            ownership={{
                              userId: owner.userId._id.toString(),
                              ownershipPercentage: owner.ownershipPercentage,
                              ownerName: owner.userId.name || "?",
                            }}
                            index={index}
                            totalOwners={item.owners.length}
                          />
                        ))
                      ) : (
                        <span className="text-gray-500">Sahip bilgisi yok</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-neon-yellow">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-neon-orange">
                    {item.unit}
                  </TableCell>
                  <TableCell className="text-neon-purple">
                    {item.currentValue} TL
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/inventory/edit/${item._id}`}
                          passHref
                        >
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
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {inventoryItems.map((item) => (
            <Card key={item._id} className="mb-4 bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-neon-blue mb-2">
                  {item.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Kategori:</span>
                    <span className="text-neon-green ml-1">
                      {item.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Alt Kategori:</span>
                    <span className="text-neon-green ml-1">
                      {item.subCategory || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Miktar:</span>
                    <span className="text-neon-yellow ml-1">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Birim:</span>
                    <span className="text-neon-orange ml-1">{item.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Mevcut Değer:</span>
                    <span className="text-neon-purple ml-1">
                      {item.currentValue} TL
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400">Sahipler:</span>
                  <div className="flex flex-wrap mt-1">
                    {item.owners && item.owners.length > 0 ? (
                      item.owners.map((owner, index) => (
                        <OwnershipBadge
                          key={owner.userId._id.toString()}
                          ownership={{
                            userId: owner.userId._id.toString(),
                            ownershipPercentage: owner.ownershipPercentage,
                            ownerName: owner.userId.name || "?",
                          }}
                          index={index}
                          totalOwners={item.owners.length}
                        />
                      ))
                    ) : (
                      <span className="text-gray-500">Sahip bilgisi yok</span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex justify-end gap-2">
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
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
