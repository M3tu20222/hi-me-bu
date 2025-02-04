import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FuelConsumption, Inventory, Field } from "@/lib/models";
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
    const fuelConsumptions = await FuelConsumption.find({})
      .populate("inventoryItem")
      .populate("field");
    return NextResponse.json(fuelConsumptions);
  } catch (error) {
    console.error("Mazot harcamaları yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Mazot harcamaları yüklenirken bir hata oluştu" },
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
    const fuelConsumptionData = await request.json();

    // Envanter öğesini ve tarlayı kontrol et
    const inventoryItem = await Inventory.findById(
      fuelConsumptionData.inventoryItem
    );
    const field = await Field.findById(fuelConsumptionData.field);

    if (!inventoryItem || !field) {
      return NextResponse.json(
        { error: "Geçersiz envanter öğesi veya tarla" },
        { status: 400 }
      );
    }

    // Mazot tüketimini hesapla
    const fuelConsumption = inventoryItem.fuelConsumptionRate * field.size;
    const totalCost = fuelConsumption * fuelConsumptionData.fuelPrice; // fuelPrice, litre başına mazot fiyatı olmalı

    const newFuelConsumption = await FuelConsumption.create({
      ...fuelConsumptionData,
      quantity: fuelConsumption,
      totalCost,
    });

    return NextResponse.json(newFuelConsumption, { status: 201 });
  } catch (error) {
    console.error("Mazot harcaması oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Mazot harcaması oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
