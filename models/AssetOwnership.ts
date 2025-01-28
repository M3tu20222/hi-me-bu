import mongoose from "mongoose";

const AssetOwnershipSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownershipPercentage: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

export default mongoose.models.AssetOwnership ||
  mongoose.model("AssetOwnership", AssetOwnershipSchema);
