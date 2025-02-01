import type { Document } from "mongoose";
import type { Season } from "./season";

export interface Fertilizer extends Document {
  _id: string;
  name: string;
  type: "Katı" | "Sıvı";
  unit: "ton" | "litre" | "çuval";
  kgPerBag?: number;
  currentStock: number;
  price: number;
  status: "Aktif" | "Pasif";
  season: Season | string;
  createdAt: Date;
  updatedAt: Date;
}
