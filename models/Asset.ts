import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
