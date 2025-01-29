import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field } from "@/lib/models";
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

  try {
    await dbConnect();
    const field = await Field.findById(params.id).populate("products");
    if (!field) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(field.products);
  } catch (error) {
    console.error("Field products fetch error:", error);
    return NextResponse.json(
      { error: "Tarla ürünleri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
