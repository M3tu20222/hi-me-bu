import mongoose from "mongoose";

const WellSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    depth: { type: Number, required: true },
    capacity: { type: Number, required: true }, // m3/hour
    status: {
      type: String,
      enum: ["Aktif", "Bakımda", "Kapalı"],
      default: "Aktif",
    },
    fields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
    responsibleUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Well || mongoose.model("Well", WellSchema);
