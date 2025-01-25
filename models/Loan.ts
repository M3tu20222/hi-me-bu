import mongoose from "mongoose"

const LoanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
})

export default mongoose.models.Loan || mongoose.model("Loan", LoanSchema)

