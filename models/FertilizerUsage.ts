import mongoose from "mongoose";

const FertilizerUsageSchema = new mongoose.Schema(
  {
    fertilizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fertilizer",
      required: true,
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    usageDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FertilizerUsage ||
  mongoose.model("FertilizerUsage", FertilizerUsageSchema);
