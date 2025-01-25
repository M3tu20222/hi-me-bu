import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Season from "@/models/Season";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const season = await Season.findById(params.id);
  if (!season) {
    return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(season);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await request.json();
  const season = await Season.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true,
  });
  if (!season) {
    return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(season);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const season = await Season.findByIdAndDelete(params.id);
  if (!season) {
    return NextResponse.json({ error: "Sezon bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ message: "Sezon başarıyla silindi" });
}
