import type { Document, Types } from "mongoose";

export interface Category {
  _id: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  isSubcategory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDocument extends Omit<Category, "_id">, Document {}
