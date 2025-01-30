import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field, FieldOwnership, User } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User not authenticated or lacks necessary role",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    let fields: any[] = [];
    const debugInfo = {
      role: session.user.role,
      userId: session.user.id,
      query: {},
      ownerships: 0,
      fieldsFound: 0,
      allFieldsCount: 0,
    };

    if (session.user.role === "Admin") {
      fields = await Field.find({})
        .populate("season")
        .populate("products")
        .populate("well")
        .lean();
      debugInfo.query = "All fields (Admin)";
    } else if (session.user.role === "Ortak") {
      const ownerships = await FieldOwnership.find({
        userId: session.user.id,
      }).select("fieldId");
      debugInfo.ownerships = ownerships.length;
      const fieldIds = ownerships.map((ownership) => ownership.fieldId);
      fields = await Field.find({ _id: { $in: fieldIds } })
        .populate("season")
        .populate("products")
        .populate("well")
        .lean();
      debugInfo.query = { _id: { $in: fieldIds } };
    }

    // Fetch ownership information for all fields
    const fieldIds = fields.map((field) => field._id);
    const ownerships = await FieldOwnership.find({
      fieldId: { $in: fieldIds },
    }).lean();

    // Fetch user information for all owners
    const userIds = Array.from(
      new Set(ownerships.map((ownership) => ownership.userId))
    );
    const users = await User.find({ _id: { $in: userIds } })
      .select("_id name")
      .lean();
    const userMap = new Map(
      users.map((user) => [(user as any)._id.toString(), user.name])
    );

    // Add ownership information to each field
    const fieldsWithOwnership = fields.map((field) => {
      const fieldOwnerships = ownerships.filter(
        (ownership) => ownership.fieldId.toString() === field._id.toString()
      );
      return {
        ...field,
        owners: fieldOwnerships.map((ownership) => ({
          userId: ownership.userId,
          ownershipPercentage: ownership.ownershipPercentage,
          ownerName: userMap.get(ownership.userId.toString()) || "Unknown",
        })),
      };
    });

    debugInfo.fieldsFound = fieldsWithOwnership.length;
    debugInfo.allFieldsCount = await Field.countDocuments();

    console.log("Debug info:", JSON.stringify(debugInfo, null, 2));

    return NextResponse.json({ fields: fieldsWithOwnership, debugInfo });
  } catch (error) {
    console.error("Error while fetching fields:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Tarlalar yüklenirken bir hata oluştu", details: errorMessage },
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
