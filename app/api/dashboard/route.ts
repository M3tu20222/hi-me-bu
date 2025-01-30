import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field, Well, FieldOwnership } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Ortak") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    // Get field ownerships for the user
    const fieldOwnerships = await FieldOwnership.find({
      userId: session.user.id,
    });
    const fieldIds = fieldOwnerships.map((ownership) => ownership.fieldId);

    // Get total fields
    const totalFields = fieldIds.length;

    // Get active fields (assuming 'status' field exists and 'Ekili' means active)
    const activeFields = await Field.countDocuments({
      _id: { $in: fieldIds },
      status: "Ekili",
    });

    // Get total wells (assuming there's a relation between fields and wells)
    const wells = await Well.countDocuments({ field: { $in: fieldIds } });

    return NextResponse.json({
      totalFields,
      activeFields,
      totalWells: wells,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Dashboard verileri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
