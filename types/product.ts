import type { Document } from "mongoose";
import type { Season } from "./season";

export interface Product extends Document {
  _id: string;
  name: string;
  field?: string;
  type?: string;
  plantingDate?: Date;
  harvestDate?: Date;
  revenue?: number;
  category: string;
  unit: string;
  isActive: boolean;
  brand: string;
  season?: Season | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimpleProduct {
  _id: string;
  name: string;
}
