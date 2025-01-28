import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Field from "@/models/Field";
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
  const field = await Field.findById(params.id)
    .populate("owner", "name")
    .populate("well", "name");
  if (!field) {
    return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(field);
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
  const fieldData = await request.json();
  const field = await Field.findByIdAndUpdate(params.id, fieldData, {
    new: true,
    runValidators: true,
  });
  if (!field) {
    return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(field);
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
  const field = await Field.findByIdAndDelete(params.id);
  if (!field) {
    return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ message: "Tarla başarıyla silindi" });
}
