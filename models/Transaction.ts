import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Gelir", "Gider", "Borç", "Ödeme"],
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    relatedFieldId: { type: mongoose.Schema.Types.ObjectId, ref: "Field" },
    relatedAssetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
    relatedWellId: { type: mongoose.Schema.Types.ObjectId, ref: "Well" },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
