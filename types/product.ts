import type { Document } from "mongoose";
import type { Field } from "./field";

export interface Product extends Document {
  _id: string;
  name: string;
  field?: Field["_id"];
  type?: string;
  plantingDate?: Date;
  harvestDate?: Date;
  revenue?: number;
  category: string;
  unit: string;
  isActive: boolean;
}

export interface SimpleProduct {
  _id: string;
  name: string;
}
