import mongoose from "mongoose"

const ExpenseSchema = new mongoose.Schema({
  field: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true },
  fuelCost: { type: Number, required: true },
  fertilizerCost: { type: Number, required: true },
  seedCost: { type: Number, required: true },
  electricityCost: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  date: { type: Date, default: Date.now },
})

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema)

