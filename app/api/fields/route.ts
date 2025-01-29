import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field, FieldOwnership, Product } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    let fields;

    if (session.user.role === "Admin") {
      fields = await Field.find({})
        .populate("season", "name")
        .populate("products", "name");
    } else if (session.user.role === "Ortak") {
      const ownedFields = await FieldOwnership.find({
        userId: session.user.id,
      }).distinct("fieldId");
      fields = await Field.find({ _id: { $in: ownedFields } })
        .populate("season", "name")
        .populate("products", "name");
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch ownership information for each field
    const fieldsWithOwnership = await Promise.all(
      fields.map(async (field) => {
        const ownership = await FieldOwnership.find({
          fieldId: field._id,
        }).populate("userId", "name");
        return { ...field.toObject(), ownership };
      })
    );

    return NextResponse.json(fieldsWithOwnership);
  } catch (error) {
    console.error("Fields fetch error:", error);
    return NextResponse.json(
      { error: "Tarlalar yüklenirken bir hata oluştu" },
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
    const fieldData = await request.json();
    const { owners, products, ...fieldInfo } = fieldData;

    const field = await Field.create({ ...fieldInfo, products });

    if (owners && owners.length > 0) {
      await FieldOwnership.insertMany(
        owners.map(
          (owner: { userId: string; ownershipPercentage: number }) => ({
            fieldId: field._id,
            userId: owner.userId,
            ownershipPercentage: owner.ownershipPercentage || 0,
          })
        )
      );
    }

    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error("Field creation error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Tarla oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
