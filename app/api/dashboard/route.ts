import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field, Well, FieldOwnership } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/models";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Ortak" && session.user.role !== "Admin")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    let dashboardData;

    if (session.user.role === "Ortak") {
      // Existing code for "Ortak" role
      const fieldOwnerships = await FieldOwnership.find({
        userId: session.user.id,
      });
      const fieldIds = fieldOwnerships.map((ownership) => ownership.fieldId);

      const totalFields = fieldIds.length;
      const activeFields = await Field.countDocuments({
        _id: { $in: fieldIds },
        status: "Ekili",
      });
      const wells = await Well.countDocuments({ field: { $in: fieldIds } });

      dashboardData = {
        totalFields,
        activeFields,
        totalWells: wells,
      };
    } else if (session.user.role === "Admin") {
      // New code for "Admin" role
      const totalFields = await Field.countDocuments();
      const activeFields = await Field.countDocuments({ status: "Ekili" });
      const totalWells = await Well.countDocuments();
      const totalUsers = await User.countDocuments();

      dashboardData = {
        totalFields,
        activeFields,
        totalWells,
        totalUsers,
      };
    }

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Dashboard verileri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
