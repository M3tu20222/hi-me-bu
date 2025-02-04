import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { TarlaIslemeKaydi } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { Types } from "mongoose";

interface FieldOwner {
  userId: string | Types.ObjectId;
  ownershipPercentage: number;
  ownerName: string;
}

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
    const records = await TarlaIslemeKaydi.find({}).sort({ date: -1 });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching tarla isleme kaydi:", error);
    return NextResponse.json(
      { error: "Kayıtlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "inventoryItemId",
      "fieldId",
      "date",
      "processedArea",
      "totalFuelConsumption",
      "totalCost",
      "fieldOwners",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Ensure fieldOwners is an array and not empty
    if (!Array.isArray(data.fieldOwners) || data.fieldOwners.length === 0) {
      return NextResponse.json(
        { error: "Tarla sahipleri bilgisi geçersiz veya eksik" },
        { status: 400 }
      );
    }

    // Calculate expense distribution
    const expenseDistribution = data.fieldOwners.map((owner: FieldOwner) => ({
      userId: owner.userId,
      amount: (data.totalCost * owner.ownershipPercentage) / 100,
      ownerName: owner.ownerName,
    }));

    const newRecord = new TarlaIslemeKaydi({
      ...data,
      expenseDistribution,
    });

    await newRecord.save();

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating tarla isleme kaydi:", error);
    return NextResponse.json(
      { error: "Kayıt oluşturulurken bir hata oluştu" },
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
    const { id } = params;
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "inventoryItemId",
      "fieldId",
      "date",
      "processedArea",
      "totalFuelConsumption",
      "totalCost",
      "fieldOwners",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Ensure fieldOwners is an array and not empty
    if (!Array.isArray(data.fieldOwners) || data.fieldOwners.length === 0) {
      return NextResponse.json(
        { error: "Tarla sahipleri bilgisi geçersiz veya eksik" },
        { status: 400 }
      );
    }

    // Calculate expense distribution
    const expenseDistribution = data.fieldOwners.map((owner: FieldOwner) => ({
      userId: owner.userId,
      amount: (data.totalCost * owner.ownershipPercentage) / 100,
      ownerName: owner.ownerName,
    }));

    const updatedRecord = await TarlaIslemeKaydi.findByIdAndUpdate(
      id,
      {
        ...data,
        expenseDistribution,
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Error updating tarla isleme kaydi:", error);
    return NextResponse.json(
      { error: "Kayıt güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
