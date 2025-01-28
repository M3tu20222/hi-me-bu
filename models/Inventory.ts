import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemType: { type: String, required: true }, // Gübre, Tohum, İlaç vb.
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // kg, litre, adet vb.
  },
  { timestamps: true }
);

export default mongoose.models.Inventory ||
  mongoose.model("Inventory", InventorySchema);
