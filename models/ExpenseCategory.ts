import mongoose, { Schema, type Document } from "mongoose";

export interface IExpenseCategory extends Document {
  name: string;
  parentCategory?: Schema.Types.ObjectId;
  description?: string;
}

const ExpenseCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: "ExpenseCategory" },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ExpenseCategory ||
  mongoose.model<IExpenseCategory>("ExpenseCategory", ExpenseCategorySchema);
