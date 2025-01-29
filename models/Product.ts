import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    type: { type: String, required: false },
    plantingDate: { type: Date, required: false },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: false,
    },
    harvestDate: { type: Date, required: false },
    revenue: { type: Number, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
