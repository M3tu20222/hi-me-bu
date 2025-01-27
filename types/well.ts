import type { Document } from "mongoose";
import type { User } from "./user";

export interface Well extends Document {
  _id: string;
  name: string;
  location: string;
  region: string;
  depth: number;
  capacity: number;
  status: "Aktif" | "Bakımda" | "Kapalı";
  fields: string[];
  responsibleUser?: User;
}
