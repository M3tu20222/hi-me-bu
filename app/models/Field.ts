import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true }, // Dönüm cinsinden
    location: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    well: { type: mongoose.Schema.Types.ObjectId, ref: "Well" },
    crop: { type: String },
    status: {
      type: String,
      enum: ["Ekili", "Boş", "Hazırlanıyor"],
      default: "Boş",
    },
    season: { type: mongoose.Schema.Types.ObjectId, ref: "Season" },
    isIrrigated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Field || mongoose.model("Field", FieldSchema);
