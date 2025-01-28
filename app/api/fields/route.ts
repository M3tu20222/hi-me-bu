import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Field, Well, User, Season } from "@/lib/models"; // Import all required models
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
        .populate("owner", "name")
        .populate("well", "name")
        .populate("season", "name");
    } else if (session.user.role === "Ortak") {
      fields = await Field.find({ owner: session.user.id })
        .populate("owner", "name")
        .populate("well", "name")
        .populate("season", "name");
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(fields);
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
    const field = await Field.create(fieldData);
    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error("Field creation error:", error);
    return NextResponse.json(
      { error: "Tarla oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
