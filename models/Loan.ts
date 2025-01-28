import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    remainingAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Loan || mongoose.model("Loan", LoanSchema);
