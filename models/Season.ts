import mongoose from "mongoose";

const SeasonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Aktif", "Pasif"], default: "Aktif" },
  fields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
  fertilizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fertilizer" }],
  year: { type: Number, required: true },
});

SeasonSchema.pre("validate", function (next) {
  if (this.isNew && this.year) {
    const year = this.year;
    this.name = `${year}-${year + 1} Sezonu`;
    this.startDate = new Date(year, 9, 1); // 1 Ekim
    this.endDate = new Date(year + 1, 8, 30); // 30 Eylül
  }
  next();
});

export default mongoose.models.Season || mongoose.model("Season", SeasonSchema);
