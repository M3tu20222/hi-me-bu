import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field, FieldOwnership, Product } from "@/lib/models";
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
    const field = await Field.findById(params.id)
      .populate("season", "name")
      .populate("products")
      .populate("well")
      .lean();

    if (!field) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }

    const ownership = await FieldOwnership.find({ fieldId: params.id })
      .populate("userId", "name")
      .lean();

    const fieldWithOwnership = { ...field, owners: ownership };

    return NextResponse.json(fieldWithOwnership);
  } catch (error) {
    console.error("Field fetch error:", error);
    return NextResponse.json(
      { error: "Tarla bilgileri yüklenirken bir hata oluştu" },
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
    const fieldData = await request.json();
    const { products, owners, ...restFieldData } = fieldData;

    const field = await Field.findByIdAndUpdate(
      params.id,
      { ...restFieldData, products },
      { new: true, runValidators: true }
    );

    if (!field) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }

    // Update field ownership
    await FieldOwnership.deleteMany({ fieldId: field._id });
    if (owners && owners.length > 0) {
      await FieldOwnership.insertMany(
        owners.map(
          (owner: { userId: string; ownershipPercentage: number }) => ({
            fieldId: field._id,
            userId: owner.userId,
            ownershipPercentage: owner.ownershipPercentage,
          })
        )
      );
    }

    return NextResponse.json(field);
  } catch (error) {
    console.error("Field update error:", error);
    return NextResponse.json(
      { error: "Tarla güncellenirken bir hata oluştu" },
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
    const field = await Field.findByIdAndDelete(params.id);
    if (!field) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }

    // Delete associated ownership records
    await FieldOwnership.deleteMany({ fieldId: params.id });

    return NextResponse.json({ message: "Tarla başarıyla silindi" });
  } catch (error) {
    console.error("Field deletion error:", error);
    return NextResponse.json(
      { error: "Tarla silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
