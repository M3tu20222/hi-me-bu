import mongoose, { Schema, type Document } from "mongoose";

export interface IExpense extends Document {
  owner: Schema.Types.ObjectId;
  amount: number;
  date: Date;
  category: Schema.Types.ObjectId;
  subcategory: Schema.Types.ObjectId;
  description: string;
  field?: Schema.Types.ObjectId;
  sharedWith?: Schema.Types.ObjectId[];
  status: "Ödendi" | "Beklemede" | "İptal Edildi";
  expenseType: "Peşin" | "Kredi" | "Kredi Kartı" | "Diğer";
}

const ExpenseSchema: Schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    field: {
      type: Schema.Types.ObjectId,
      ref: "Field",
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["Ödendi", "Beklemede", "İptal Edildi"],
      default: "Beklemede",
    },
    expenseType: {
      type: String,
      required: true,
      enum: ["Peşin", "Kredi", "Kredi Kartı", "Diğer"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
