import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field } from "@/lib/models";
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

  try {
    await dbConnect();
    const fields = await Field.find({})
      .populate("season")
      .populate("products")
      .populate("well")
      .populate("owners.userId", "name")
      .lean();

    return NextResponse.json(fields);
  } catch (error) {
    console.error("Error fetching all fields:", error);
    return NextResponse.json(
      { error: "Tüm tarlalar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
