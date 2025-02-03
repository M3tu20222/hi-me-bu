import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Inventory } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { error: "Category parameter is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const subCategories = await Inventory.distinct("subCategory", { category });
    return NextResponse.json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Alt kategoriler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
