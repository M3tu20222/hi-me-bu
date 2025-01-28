import type { Document } from "mongoose";
import type { User } from "./user";
import type { Well } from "./well";

export interface Field extends Document {
  _id: string;
  name: string;
  size: number;
  location: string;
  owner?: User;
  well?: Well;
  crop?: string;
  status: "Ekili" | "Boş" | "Hazırlanıyor" | "Sürüldü";
  isIrrigated: boolean;
  season?: { _id: string; name: string };
  isRented: boolean;
  isShared: boolean;
  blockParcel?: string;
  createdAt: Date;
  updatedAt: Date;
}
