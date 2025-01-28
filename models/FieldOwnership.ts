import mongoose from "mongoose";

const FieldOwnershipSchema = new mongoose.Schema(
  {
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
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

export default mongoose.models.FieldOwnership ||
  mongoose.model("FieldOwnership", FieldOwnershipSchema);
