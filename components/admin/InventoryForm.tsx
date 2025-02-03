"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { IInventoryItem } from "@/models/Inventory";
import type { User } from "@/types/user";
import { Types } from "mongoose";
import type React from "react";

interface InventoryFormProps {
  inventoryItem?: IInventoryItem;
}

export default function InventoryForm({ inventoryItem }: InventoryFormProps) {
  const [formData, setFormData] = useState<Partial<IInventoryItem>>(() => {
    if (inventoryItem) {
      return {
        ...inventoryItem,
        purchaseDate:
          inventoryItem.purchaseDate instanceof Date
            ? inventoryItem.purchaseDate
            : new Date(inventoryItem.purchaseDate),
      };
    } else {
      return {
        name: "",
        category: "Kalıcı Malzeme",
        subCategory: "",
        quantity: 0,
        unit: "",
        purchaseDate: new Date(),
        purchasePrice: 0,
        currentValue: 0,
        owners: [],
      };
    }
  });
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users?role=Ortak");
        if (!response.ok) {
          throw new Error("Failed to fetch partners");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching partners:", error);
        setError("Ortaklar yüklenirken bir hata oluştu");
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: any }
  ) => {
    const name = "target" in e ? e.target.name : e.name;
    const value = "target" in e ? e.target.value : e.value;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "purchaseDate" ? new Date(value) : value,
    }));
  };

  const handleOwnershipChange = (userId: string, isChecked: boolean) => {
    setFormData((prev) => {
      const updatedOwners = isChecked
        ? [
            ...(prev.owners || []),
            { userId: new Types.ObjectId(userId), ownershipPercentage: 0 },
          ]
        : (prev.owners || []).filter(
            (owner) => owner.userId.toString() !== userId
          );

      return { ...prev, owners: updatedOwners as IInventoryItem["owners"] };
    });
  };

  const handleOwnershipPercentageChange = (
    userId: string,
    percentage: number
  ) => {
    setFormData((prev) => {
      const updatedOwners = (prev.owners || []).map((owner) =>
        owner.userId.toString() === userId
          ? { ...owner, ownershipPercentage: percentage }
          : owner
      );

      return { ...prev, owners: updatedOwners as IInventoryItem["owners"] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = inventoryItem
        ? `/api/inventory/${inventoryItem._id}`
        : "/api/inventory";
      const method = inventoryItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Envanter öğesi kaydedilirken bir hata oluştu");
      }

      router.push("/admin/inventory");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-neon-blue shadow-lg shadow-neon-blue/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-neon-pink">
          {inventoryItem
            ? "Envanter Öğesi Düzenle"
            : "Yeni Envanter Öğesi Ekle"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-neon-blue">
              Envanter Öğesi Adı
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Envanter Öğesi Adı"
              required
              className="bg-gray-800 border-neon-blue text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-neon-blue">
              Kategori
            </Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) =>
                handleChange({ name: "category", value })
              }
            >
              <SelectTrigger className="bg-gray-800 border-neon-blue text-white">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-neon-blue">
                <SelectItem value="Kalıcı Malzeme">Kalıcı Malzeme</SelectItem>
                <SelectItem value="Traktör Malzemesi">
                  Traktör Malzemesi
                </SelectItem>
                <SelectItem value="Sulama Malzemesi">
                  Sulama Malzemesi
                </SelectItem>
                <SelectItem value="Diğer Malzeme">Diğer Malzeme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategory" className="text-neon-blue">
              Alt Kategori
            </Label>
            <Input
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              placeholder="Alt Kategori"
              className="bg-gray-800 border-neon-blue text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-neon-blue">
              Miktar
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Miktar"
              required
              className="bg-gray-800 border-neon-blue text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit" className="text-neon-blue">
              Birim
            </Label>
            <Input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Birim"
              required
              className="bg-gray-800 border-neon-blue text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate" className="text-neon-blue">
              Satın Alma Tarihi
            </Label>
            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              value={
                formData.purchaseDate instanceof Date
                  ? formData.purchaseDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange({
                  name: "purchaseDate",
                  value: new Date(e.target.value),
                })
              }
              required
              className="bg-gray-800 border-neon-blue text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePrice" className="text-neon-blue">
              Satın Alma Fiyatı
            </Label>
            <Input
              id="purchasePrice"
              name="purchasePrice"
              type="number"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="Satın Alma Fiyatı"
              required
              className="bg-gray-800 border-neon-blue text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentValue" className="text-neon-blue">
              Mevcut Değer
            </Label>
            <Input
              id="currentValue"
              name="currentValue"
              type="number"
              value={formData.currentValue}
              onChange={handleChange}
              placeholder="Mevcut Değer"
              required
              className="bg-gray-800 border-neon-blue text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neon-blue">Sahipler (Ortaklar)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <div
                  key={user._id.toString()}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`user-${user._id}`}
                    checked={formData.owners?.some(
                      (owner) => owner.userId.toString() === user._id.toString()
                    )}
                    onCheckedChange={(checked) =>
                      handleOwnershipChange(
                        user._id.toString(),
                        checked as boolean
                      )
                    }
                    className="border-neon-blue"
                  />
                  <Label
                    htmlFor={`user-${user._id}`}
                    className="text-neon-green"
                  >
                    {user.name}
                  </Label>
                  {formData.owners?.some(
                    (owner) => owner.userId.toString() === user._id.toString()
                  ) && (
                    <Input
                      type="number"
                      value={
                        formData.owners.find(
                          (owner) =>
                            owner.userId.toString() === user._id.toString()
                        )?.ownershipPercentage || 0
                      }
                      onChange={(e) =>
                        handleOwnershipPercentageChange(
                          user._id.toString(),
                          Number(e.target.value)
                        )
                      }
                      placeholder="Sahiplik %"
                      className="w-24 bg-gray-800 border-neon-blue text-neon-yellow placeholder-neon-yellow/50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-neon-pink">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-neon-blue hover:bg-neon-pink text-black font-bold transition-colors duration-300"
          >
            {inventoryItem ? "Güncelle" : "Ekle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
