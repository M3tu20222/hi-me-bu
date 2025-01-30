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
    const fields = await Field.find({}).populate("season").populate("products");
    return NextResponse.json(fields);
  } catch (error) {
    console.error("Tarlalar yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Tarlalar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const fieldData = await request.json();
    const field = await Field.create(fieldData);
    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error("Tarla oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Tarla oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
