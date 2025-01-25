import mongoose from "mongoose"

const WellSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  fields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
  responsibleUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

export default mongoose.models.Well || mongoose.model("Well", WellSchema)

