"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Edit } from "lucide-react";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  fuelConsumptionRate: number;
}

interface FieldOwnership {
  userId: string;
  ownershipPercentage: number;
  ownerName: string;
}

interface Field {
  _id: string;
  name: string;
  size: number;
  owners: FieldOwnership[];
}

interface ProcessingRecord {
  _id: string;
  inventoryItemId: string;
  inventoryItemName: string;
  fieldId: string;
  fieldName: string;
  date: Date;
  processedArea: number;
  totalFuelConsumption: number;
  totalCost: number;
  fieldOwners: FieldOwnership[];
}

export default function TarlaIslemeKaydi() {
  const { data: session } = useSession();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [records, setRecords] = useState<ProcessingRecord[]>([]);
  const [selectedInventoryItem, setSelectedInventoryItem] =
    useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [fuelPrice, setFuelPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFieldOwners, setSelectedFieldOwners] = useState<
    FieldOwnership[]
  >([]);
  const [editingRecord, setEditingRecord] = useState<ProcessingRecord | null>(
    null
  );

  useEffect(() => {
    fetchInventoryItems();
    fetchFields();
    fetchRecords();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch("/api/inventory?category=Traktör Malzemesi");
      if (!response.ok) {
        throw new Error("Envanter öğeleri yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setInventoryItems(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setIsLoading(false);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await fetch("/api/fields");
      if (!response.ok) {
        throw new Error("Tarlalar yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setFields(data.fields || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching fields:", err);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setIsLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/tarla-isleme-kaydi");
      if (!response.ok) {
        throw new Error("Kayıtlar yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setRecords(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const inventoryItem = inventoryItems.find(
      (item) => item._id === selectedInventoryItem
    );
    const field = fields.find((f) => f._id === selectedField);

    if (!inventoryItem || !field) {
      setError("Lütfen envanter öğesi ve tarla seçin.");
      return;
    }

    const totalFuelConsumption = inventoryItem.fuelConsumptionRate * field.size;
    const totalCost = totalFuelConsumption * fuelPrice;

    const newRecord = {
      inventoryItemId: selectedInventoryItem,
      inventoryItemName: inventoryItem.name,
      fieldId: selectedField,
      fieldName: field.name,
      date: new Date(date),
      processedArea: field.size,
      totalFuelConsumption,
      totalCost,
      fieldOwners: field.owners,
    };

    try {
      const url = editingRecord
        ? `/api/tarla-isleme-kaydi/${editingRecord._id}`
        : "/api/tarla-isleme-kaydi";
      const method = editingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Kayıt oluşturulurken bir hata oluştu"
        );
      }

      const savedRecord = await response.json();

      if (editingRecord) {
        setRecords(
          records.map((record) =>
            record._id === savedRecord._id ? savedRecord : record
          )
        );
      } else {
        setRecords([...records, savedRecord]);
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const resetForm = () => {
    setSelectedInventoryItem("");
    setSelectedField("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setFuelPrice(0);
    setSelectedFieldOwners([]);
    setEditingRecord(null);
  };

  const handleEdit = (record: ProcessingRecord) => {
    if (session?.user?.role !== "Admin") {
      setError("Sadece admin kullanıcılar kayıtları düzenleyebilir.");
      return;
    }

    setEditingRecord(record);
    setSelectedInventoryItem(record.inventoryItemId);
    setSelectedField(record.fieldId);
    setDate(format(new Date(record.date), "yyyy-MM-dd"));
    setFuelPrice(record.totalCost / record.totalFuelConsumption);
    setSelectedFieldOwners(record.fieldOwners);
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
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-neon-blue shadow-lg shadow-neon-blue/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-neon-pink">
          Tarla İşleme Kaydı
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label htmlFor="inventoryItem" className="text-neon-blue">
              Envanter Öğesi
            </Label>
            <Select
              value={selectedInventoryItem}
              onValueChange={setSelectedInventoryItem}
            >
              <SelectTrigger
                id="inventoryItem"
                className="bg-gray-800 border-neon-blue text-white"
              >
                <SelectValue placeholder="Envanter öğesi seçin" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name} ({item.fuelConsumptionRate} L/Dekar)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field" className="text-neon-blue">
              Tarla
            </Label>
            <Select
              value={selectedField}
              onValueChange={(value) => {
                setSelectedField(value);
                const selectedFieldData = fields.find((f) => f._id === value);
                if (selectedFieldData) {
                  setSelectedFieldOwners(selectedFieldData.owners);
                }
              }}
            >
              <SelectTrigger
                id="field"
                className="bg-gray-800 border-neon-blue text-white"
              >
                <SelectValue placeholder="Tarla seçin" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(fields) &&
                  fields.map((field) => (
                    <SelectItem key={field._id} value={field._id}>
                      {field.name} ({field.size} Dekar)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFieldOwners.length > 0 && (
            <div className="space-y-2">
              <Label className="text-neon-blue">Tarla Sahipleri</Label>
              <div className="bg-gray-800 border border-neon-blue rounded p-2">
                {selectedFieldOwners.map((owner, index) => (
                  <div key={index} className="text-white">
                    {owner.ownerName}: %{owner.ownershipPercentage}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fieldSize" className="text-neon-blue">
              İşlenen Alan (Dekar)
            </Label>
            <Input
              id="fieldSize"
              type="text"
              value={fields.find((f) => f._id === selectedField)?.size || ""}
              readOnly
              className="bg-gray-800 border-neon-blue text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-neon-blue">
              Tarih
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-800 border-neon-blue text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelPrice" className="text-neon-blue">
              Mazot Fiyatı (TL/L)
            </Label>
            <Input
              id="fuelPrice"
              type="number"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              className="bg-gray-800 border-neon-blue text-white"
            />
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-neon-blue hover:bg-neon-pink text-black font-bold"
          >
            {editingRecord ? "Güncelle" : "Kaydet"}
          </Button>
          {editingRecord && (
            <Button
              type="button"
              onClick={resetForm}
              className="w-full bg-neon-pink hover:bg-neon-blue text-black font-bold mt-2"
            >
              İptal
            </Button>
          )}
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-neon-blue mb-4">Kayıtlar</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-neon-pink">Tarih</TableHead>
                <TableHead className="text-neon-pink">Envanter Öğesi</TableHead>
                <TableHead className="text-neon-pink">Tarla</TableHead>
                <TableHead className="text-neon-pink">
                  İşlenen Alan (Dekar)
                </TableHead>
                <TableHead className="text-neon-pink">
                  Toplam Mazot Tüketimi (L)
                </TableHead>
                <TableHead className="text-neon-pink">
                  Toplam Maliyet (TL)
                </TableHead>
                {session?.user?.role === "Admin" && (
                  <TableHead className="text-neon-pink">İşlemler</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record._id}>
                  <TableCell className="text-white">
                    {format(new Date(record.date), "dd.MM.yyyy")}
                  </TableCell>
                  <TableCell className="text-white">
                    {record.inventoryItemName}
                  </TableCell>
                  <TableCell className="text-white">
                    {record.fieldName}
                  </TableCell>
                  <TableCell className="text-white">
                    {record.processedArea}
                  </TableCell>
                  <TableCell className="text-white">
                    {record.totalFuelConsumption.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-white">
                    {record.totalCost.toFixed(2)}
                  </TableCell>
                  {session?.user?.role === "Admin" && (
                    <TableCell>
                      <Button
                        onClick={() => handleEdit(record)}
                        className="bg-neon-blue hover:bg-neon-pink text-black font-bold p-2"
                      >
                        <Edit size={16} />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
