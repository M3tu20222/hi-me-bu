import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Well from "@/models/Well";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const wells = await Well.find({}).populate("responsibleUser", "name");
  return NextResponse.json(wells);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const wellData = await request.json();
  const well = await Well.create(wellData);
  return NextResponse.json(well, { status: 201 });
}
