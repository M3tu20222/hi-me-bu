import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Season from "@/models/Season";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { year } = await request.json();

  try {
    const seasonData = {
      year: Number(year),
    };
    const season = await Season.create(seasonData);
    return NextResponse.json(season, { status: 201 });
  } catch (error) {
    console.error("Sezon oluşturma hatası:", error);
    let errorMessage = "Sezon oluşturulamadı";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const seasons = await Season.find({}).sort({ year: -1 });
  return NextResponse.json(seasons);
}
