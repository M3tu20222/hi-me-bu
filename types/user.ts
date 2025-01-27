import type { Document } from "mongoose";

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Ortak" | "İşçi";
  assignedFields?: string[];
  assignedWells?: string[];
}
