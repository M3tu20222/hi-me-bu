import mongoose from "mongoose"

const OperationSchema = new mongoose.Schema({
  field: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true },
  type: { type: String, required: true },
  fuelUsage: { type: Number, required: true }, // in liters
  fertilizerUsage: { type: Number, required: true }, // in kg
  seedUsage: { type: Number, required: true }, // in kg
  date: { type: Date, default: Date.now },
})

export default mongoose.models.Operation || mongoose.model("Operation", OperationSchema)

