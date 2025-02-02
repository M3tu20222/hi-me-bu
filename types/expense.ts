import type { Document } from "mongoose";
import type { Category } from "./category";

export interface Expense extends Document {
  _id: string;
  owner: string;
  amount: number;
  date: Date;
  category: string | Category;
  subcategory: string | Category;
  description: string;
  field?: string;
  sharedWith?: string[];
  status: "Ödendi" | "Beklemede" | "İptal Edildi";
  expenseType: "Peşin" | "Kredi" | "Kredi Kartı" | "Diğer";
  createdAt: Date;
  updatedAt: Date;
}
