import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
  field: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true },
  type: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  harvestDate: { type: Date },
  revenue: { type: Number },
})

export default mongoose.models.Product || mongoose.model("Product", ProductSchema)

