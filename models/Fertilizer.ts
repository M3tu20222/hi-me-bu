import mongoose, { type Document, Schema } from "mongoose";

interface IFertilizer extends Document {
  name: string;
  type: "Katı" | "Sıvı";
  unit: "ton" | "litre" | "çuval";
  kgPerBag?: number;
  currentStock: number;
  price: number;
  status: "Aktif" | "Pasif";
  season: Schema.Types.ObjectId;
}

const FertilizerSchema = new mongoose.Schema<IFertilizer>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Katı", "Sıvı"],
      required: true,
    },
    unit: {
      type: String,
      enum: ["ton", "litre", "çuval"],
      required: true,
    },
    kgPerBag: {
      type: Number,
      required: function (this: IFertilizer) {
        return this.unit === "çuval";
      },
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Aktif", "Pasif"],
      default: "Aktif",
    },
    season: {
      type: Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Fertilizer ||
  mongoose.model<IFertilizer>("Fertilizer", FertilizerSchema);
