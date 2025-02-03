import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Inventory } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Sahip")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const inventoryItem = await Inventory.findById(params.id).populate(
      "owners.userId",
      "name"
    );
    if (!inventoryItem) {
      return NextResponse.json(
        { error: "Envanter öğesi bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json(inventoryItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Envanter öğesi yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const inventoryData = await request.json();
    const inventoryItem = await Inventory.findByIdAndUpdate(
      params.id,
      inventoryData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!inventoryItem) {
      return NextResponse.json(
        { error: "Envanter öğesi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(inventoryItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Envanter öğesi güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const inventoryItem = await Inventory.findByIdAndDelete(params.id);
    if (!inventoryItem) {
      return NextResponse.json(
        { error: "Envanter öğesi bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Envanter öğesi başarıyla silindi" });
  } catch (error) {
    return NextResponse.json(
      { error: "Envanter öğesi silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
