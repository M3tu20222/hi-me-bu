import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Inventory } from "@/lib/models";
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
    const inventoryItems = await Inventory.find({}).populate({
      path: "owners.userId",
      select: "name",
    });
    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error("Envanter öğeleri yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Envanter öğeleri yüklenirken bir hata oluştu" },
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
    const inventoryData = await request.json();

    // Check if the subCategory already exists for the given category
    const existingSubCategory = await Inventory.findOne({
      category: inventoryData.category,
      subCategory: inventoryData.subCategory,
    });

    if (!existingSubCategory) {
      // If the subCategory doesn't exist, create a new inventory item
      const inventoryItem = await Inventory.create(inventoryData);
      return NextResponse.json(inventoryItem, { status: 201 });
    } else {
      // If the subCategory already exists, update the existing item or create a new one based on your requirements
      // For this example, we'll create a new item even if the subCategory exists
      const inventoryItem = await Inventory.create(inventoryData);
      return NextResponse.json(inventoryItem, { status: 201 });
    }
  } catch (error) {
    console.error("Envanter öğesi oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Envanter öğesi oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
