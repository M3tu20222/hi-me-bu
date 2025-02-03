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
    let inventoryItems;

    if (session.user.role === "Admin") {
      // Admins can see all inventory items
      inventoryItems = await Inventory.find({}).populate({
        path: "owners.userId",
        select: "name",
      });
    } else {
      // Ortaks can only see their own inventory items
      inventoryItems = await Inventory.find({
        "owners.userId": session.user.id,
      }).populate({
        path: "owners.userId",
        select: "name",
      });
    }

    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error("Envanter öğeleri yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Envanter öğeleri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
