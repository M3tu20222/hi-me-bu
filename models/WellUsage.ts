import mongoose from "mongoose";

const WellUsageSchema = new mongoose.Schema(
  {
    wellId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Well",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usageAmount: { type: Number, required: true }, // m3 cinsinden
    usageDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.WellUsage ||
  mongoose.model("WellUsage", WellUsageSchema);
