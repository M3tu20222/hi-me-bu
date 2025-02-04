import mongoose, { Schema, type Document } from "mongoose";

export interface ITarlaIslemeKaydi extends Document {
  inventoryItemId: Schema.Types.ObjectId;
  inventoryItemName: string;
  fieldId: Schema.Types.ObjectId;
  fieldName: string;
  date: Date;
  processedArea: number;
  totalFuelConsumption: number;
  totalCost: number;
  expenseDistribution: Array<{
    userId: Schema.Types.ObjectId;
    amount: number;
  }>;
}

const TarlaIslemeKaydiSchema: Schema = new Schema(
  {
    inventoryItemId: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    inventoryItemName: { type: String, required: true },
    fieldId: { type: Schema.Types.ObjectId, ref: "Field", required: true },
    fieldName: { type: String, required: true },
    date: { type: Date, required: true },
    processedArea: { type: Number, required: true },
    totalFuelConsumption: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    expenseDistribution: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.TarlaIslemeKaydi ||
  mongoose.model<ITarlaIslemeKaydi>("TarlaIslemeKaydi", TarlaIslemeKaydiSchema);
