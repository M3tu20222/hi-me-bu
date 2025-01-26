import type { Document } from "mongoose";

export interface Season extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  status: "Aktif" | "Pasif";
  fields: string[];
  year: number;
}

export type SeasonInput = Omit<Season, keyof Document>;
