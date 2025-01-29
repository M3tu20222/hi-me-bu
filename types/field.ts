import type { Document } from "mongoose";
import type { User } from "./user";
import type { Well } from "./well";
import type { Product } from "./product";
import type { Season } from "./season";

export interface FieldOwnership {
  userId: string;
  ownershipPercentage: number;
}

export interface Field extends Document {
  _id: string;
  name: string;
  size: number;
  location: string;
  well?: Well;
  crop?: string;
  status: "Ekili" | "Boş" | "Hazırlanıyor" | "Sürüldü";
  isIrrigated: boolean;
  season?: Season;
  isRented: boolean;
  isShared: boolean;
  blockParcel?: string;
  products: Array<{ _id: string; name: string }>;
  owners: FieldOwnership[];
  createdAt: Date;
  updatedAt: Date;
}
