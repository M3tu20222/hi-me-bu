import mongoose, { Schema, type Document } from "mongoose";

export interface IFuelConsumption extends Document {
  inventoryItem: Schema.Types.ObjectId;
  field: Schema.Types.ObjectId;
  date: Date;
  quantity: number;
  totalCost: number;
}

const FuelConsumptionSchema: Schema = new Schema(
  {
    inventoryItem: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    field: { type: Schema.Types.ObjectId, ref: "Field", required: true },
    date: { type: Date, required: true },
    quantity: { type: Number, required: true },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.FuelConsumption ||
  mongoose.model<IFuelConsumption>("FuelConsumption", FuelConsumptionSchema);
