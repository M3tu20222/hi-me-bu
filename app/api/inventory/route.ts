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
  const subCategory = searchParams.get("subCategory");

  try {
    await dbConnect();
    let query = {};
    if (category) query = { ...query, category };
    if (subCategory) query = { ...query, subCategory };

    const inventoryItems = await Inventory.find(query).select(
      "name category subCategory fuelConsumptionRate"
    );
    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
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
    const inventoryItem = await Inventory.create({
      ...inventoryData,
      fuelConsumptionRate: inventoryData.fuelConsumptionRate,
    });
    return NextResponse.json(inventoryItem, { status: 201 });
  } catch (error) {
    console.error("Envanter öğesi oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Envanter öğesi oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const id = request.url.split("/").pop();
    const inventoryData = await request.json();
    const updatedInventoryItem = await Inventory.findByIdAndUpdate(
      id,
      {
        ...inventoryData,
        fuelConsumptionRate: inventoryData.fuelConsumptionRate,
      },
      { new: true, runValidators: true }
    );
    return NextResponse.json(updatedInventoryItem);
  } catch (error) {
    console.error("Envanter öğesi güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Envanter öğesi güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
