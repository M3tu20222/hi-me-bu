import mongoose, { Schema, type Document } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  category:
    | "Kalıcı Malzeme"
    | "Traktör Malzemesi"
    | "Sulama Malzemesi"
    | "Diğer Malzeme";
  subCategory?: string;
  quantity: number;
  unit: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  owners: Array<{
    userId: Schema.Types.ObjectId;
    ownershipPercentage: number;
  }>;
  creditDetails?: {
    totalAmount: number;
    remainingAmount: number;
    installments: Array<{
      dueDate: Date;
      amount: number;
      isPaid: boolean;
    }>;
  };
}

const InventoryItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Kalıcı Malzeme",
        "Traktör Malzemesi",
        "Sulama Malzemesi",
        "Diğer Malzeme",
      ],
    },
    subCategory: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    owners: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        ownershipPercentage: { type: Number, required: true },
      },
    ],
    creditDetails: {
      totalAmount: Number,
      remainingAmount: Number,
      installments: [
        {
          dueDate: Date,
          amount: Number,
          isPaid: Boolean,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Inventory ||
  mongoose.model<IInventoryItem>("Inventory", InventoryItemSchema);
