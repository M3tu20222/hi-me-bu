import type { Document } from "mongoose";

export interface Fertilizer extends Document {
  _id: string;
  name: string;
  type: "Katı" | "Sıvı";
  unit: "ton" | "litre" | "çuval";
  kgPerBag?: number;
  currentStock: number;
  price: number;
  status: "Aktif" | "Pasif";
  createdAt: Date;
  updatedAt: Date;
}

export interface FertilizerUsage extends Document {
  _id: string;
  fertilizer: string;
  field: string;
  quantity: number;
  usageDate: Date;
  notes?: string;
  appliedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
