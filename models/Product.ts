import mongoose, { Schema, type Document } from "mongoose";
import type { Product } from "@/types/product";

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    field: { type: Schema.Types.ObjectId, ref: "Field" },
    type: String,
    plantingDate: Date,
    harvestDate: Date,
    revenue: Number,
    category: { type: String, required: true },
    unit: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    brand: { type: String, required: true },
    season: { type: Schema.Types.ObjectId, ref: "Season" },
  },
  { timestamps: true }
);

const ProductModel =
  mongoose.models.Product ||
  mongoose.model<Product & Document>("Product", ProductSchema);

export default ProductModel;
