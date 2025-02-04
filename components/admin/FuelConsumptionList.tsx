"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface FuelConsumption {
  _id: string;
  inventoryItem: {
    _id: string;
    name: string;
  };
  field: {
    _id: string;
    name: string;
  };
  date: string;
  quantity: number;
  totalCost: number;
}

export default function FuelConsumptionList() {
  const { data: session } = useSession();
  const [fuelConsumptions, setFuelConsumptions] = useState<FuelConsumption[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newConsumption, setNewConsumption] = useState({
    inventoryItemId: "",
    fieldId: "",
    date: "",
    quantity: 0,
    totalCost: 0,
  });
  const [inventoryItems, setInventoryItems] = useState<
    { _id: string; name: string }[]
  >([]);
  const [fields, setFields] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    fetchFuelConsumptions();
    fetchInventoryItems();
    fetchFields();
  }, []);

  const fetchFuelConsumptions = async () => {
    try {
      const response = await fetch("/api/fuel-consumption");
      if (!response.ok) {
        throw new Error("Mazot harcamaları yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setFuelConsumptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        throw new Error("Envanter öğeleri yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setInventoryItems(data);
    } catch (err) {
      console.error("Envanter öğeleri yüklenirken hata:", err);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await fetch("/api/fields");
      if (!response.ok) {
        throw new Error("Tarlalar yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setFields(data.fields);
    } catch (err) {
      console.error("Tarlalar yüklenirken hata:", err);
    }
  };

  const handleAddNew = async () => {
    try {
      const response = await fetch("/api/fuel-consumption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConsumption),
      });
      if (!response.ok) {
        throw new Error("Mazot harcaması eklenirken bir hata oluştu");
      }
      fetchFuelConsumptions();
      setIsAddingNew(false);
      setNewConsumption({
        inventoryItemId: "",
        fieldId: "",
        date: "",
        quantity: 0,
        totalCost: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Bu mazot harcamasını silmek istediğinizden emin misiniz?")
    ) {
      try {
        const response = await fetch(`/api/fuel-consumption/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Mazot harcaması silinirken bir hata oluştu");
        }
        fetchFuelConsumptions();
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
            Mazot Harcamaları
          </CardTitle>
          <Button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="bg-neon-blue hover:bg-neon-pink text-black font-bold"
          >
            {isAddingNew ? "İptal" : "Yeni Harcama Ekle"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAddingNew && (
          <div className="mb-6 space-y-4 p-4 bg-gray-800 rounded-lg">
            <Select
              onValueChange={(value) =>
                setNewConsumption({ ...newConsumption, inventoryItemId: value })
              }
              value={newConsumption.inventoryItemId}
            >
              <SelectTrigger className="bg-gray-700 border-neon-blue text-white">
                <SelectValue placeholder="Envanter Öğesi Seçin" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setNewConsumption({ ...newConsumption, fieldId: value })
              }
              value={newConsumption.fieldId}
            >
              <SelectTrigger className="bg-gray-700 border-neon-blue text-white">
                <SelectValue placeholder="Tarla Seçin" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field._id} value={field._id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newConsumption.date}
              onChange={(e) =>
                setNewConsumption({ ...newConsumption, date: e.target.value })
              }
              className="bg-gray-700 border-neon-blue text-white"
            />
            <Input
              type="number"
              placeholder="Miktar (Litre)"
              value={newConsumption.quantity}
              onChange={(e) =>
                setNewConsumption({
                  ...newConsumption,
                  quantity: Number.parseFloat(e.target.value),
                })
              }
              className="bg-gray-700 border-neon-blue text-white"
            />
            <Input
              type="number"
              placeholder="Toplam Maliyet (TL)"
              value={newConsumption.totalCost}
              onChange={(e) =>
                setNewConsumption({
                  ...newConsumption,
                  totalCost: Number.parseFloat(e.target.value),
                })
              }
              className="bg-gray-700 border-neon-blue text-white"
            />
            <Button
              onClick={handleAddNew}
              className="w-full bg-neon-green hover:bg-neon-blue text-black font-bold"
            >
              Ekle
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-neon-blue">
                <TableHead className="text-neon-pink">Envanter Öğesi</TableHead>
                <TableHead className="text-neon-pink">Tarla</TableHead>
                <TableHead className="text-neon-pink">Tarih</TableHead>
                <TableHead className="text-neon-pink">Miktar (L)</TableHead>
                <TableHead className="text-neon-pink">
                  Toplam Maliyet (TL)
                </TableHead>
                <TableHead className="text-neon-pink">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelConsumptions.map((consumption) => (
                <TableRow
                  key={consumption._id}
                  className="border-b border-gray-800"
                >
                  <TableCell className="text-neon-blue">
                    {consumption.inventoryItem.name}
                  </TableCell>
                  <TableCell className="text-neon-green">
                    {consumption.field.name}
                  </TableCell>
                  <TableCell className="text-neon-yellow">
                    {format(new Date(consumption.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-neon-orange">
                    {consumption.quantity}
                  </TableCell>
                  <TableCell className="text-neon-purple">
                    {consumption.totalCost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(consumption._id)}
                      className="bg-neon-pink hover:bg-neon-blue text-black"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
