import mongoose from "mongoose"

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true }, // in decares
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
  well: { type: mongoose.Schema.Types.ObjectId, ref: "Well" },
  isIrrigable: { type: Boolean, default: false },
  isRented: { type: Boolean, default: false },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
})

export default mongoose.models.Field || mongoose.model("Field", FieldSchema)

