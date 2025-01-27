import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Well from "@/models/Well";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const well = await Well.findById(params.id).populate(
    "responsibleUser",
    "name"
  );
  if (!well) {
    return NextResponse.json({ error: "Well not found" }, { status: 404 });
  }
  return NextResponse.json(well);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const wellData = await request.json();
  const well = await Well.findByIdAndUpdate(params.id, wellData, {
    new: true,
    runValidators: true,
  });
  if (!well) {
    return NextResponse.json({ error: "Well not found" }, { status: 404 });
  }
  return NextResponse.json(well);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const well = await Well.findByIdAndDelete(params.id);
  if (!well) {
    return NextResponse.json({ error: "Well not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Well deleted successfully" });
}
