import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Ortak", "İşçi"], required: true },
  assignedFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
  assignedWells: [{ type: mongoose.Schema.Types.ObjectId, ref: "Well" }],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
