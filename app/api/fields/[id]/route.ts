import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field, FieldOwnership } from "@/lib/models";
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
    const field = await Field.findById(params.id).populate("season", "name");
    if (!field) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }

    const ownership = await FieldOwnership.find({
      fieldId: field._id,
    }).populate("userId", "name");
    const fieldWithOwnership = { ...field.toObject(), ownership };

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
    const { owners, ...fieldData } = await request.json();
    const field = await Field.findByIdAndUpdate(params.id, fieldData, {
      new: true,
      runValidators: true,
    });
    if (!field) {
      return NextResponse.json({ error: "Tarla bulunamadı" }, { status: 404 });
    }

    // Update ownership information
    await FieldOwnership.deleteMany({ fieldId: field._id });
    if (owners && owners.length > 0) {
      await FieldOwnership.insertMany(
        owners.map((owner: { userId: string; percentage: number }) => ({
          fieldId: field._id,
          userId: owner.userId,
          ownershipPercentage: owner.percentage,
        }))
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
