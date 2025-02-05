import mongoose, { Schema, type Document } from "mongoose";
import type { Well } from "@/types/well";
import type { Product } from "@/types/product";
import type { Season } from "@/types/season";

export interface FieldOwnership {
  userId: Schema.Types.ObjectId;
  ownershipPercentage: number;
}

export interface Field extends Document {
  name: string;
  size: number;
  location: string;
  well?: Well["_id"];
  crop?: string;
  status: "Ekili" | "Boş" | "Hazırlanıyor" | "Sürüldü";
  isIrrigated: boolean;
  season?: Season["_id"];
  isRented: boolean;
  isShared: boolean;
  blockParcel?: string;
  products: Product["_id"][];
  owners: FieldOwnership[];
}

const FieldSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    location: { type: String, required: true },
    well: { type: Schema.Types.ObjectId, ref: "Well" },
    crop: String,
    status: {
      type: String,
      enum: ["Ekili", "Boş", "Hazırlanıyor", "Sürüldü"],
      default: "Boş",
    },
    isIrrigated: { type: Boolean, default: false },
    season: { type: Schema.Types.ObjectId, ref: "Season" },
    isRented: { type: Boolean, default: false },
    isShared: { type: Boolean, default: false },
    blockParcel: String,
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    owners: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        ownershipPercentage: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Field ||
  mongoose.model<Field>("Field", FieldSchema);
