import mongoose, { Schema, type Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  isSubcategory: boolean;
  parent?: Schema.Types.ObjectId;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isSubcategory: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
