import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Fertilizer } from "@/lib/models";
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
    const fertilizers = await Fertilizer.find({});
    return NextResponse.json(fertilizers);
  } catch (error) {
    console.error("Gübreler yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Gübreler yüklenirken bir hata oluştu" },
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
    const fertilizerData = await request.json();

    if (fertilizerData.unit === "çuval" && !fertilizerData.kgPerBag) {
      return NextResponse.json(
        { error: "Çuval birimi için kg/çuval değeri gereklidir" },
        { status: 400 }
      );
    }

    const fertilizer = await Fertilizer.create(fertilizerData);
    return NextResponse.json(fertilizer, { status: 201 });
  } catch (error) {
    console.error("Gübre oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Gübre oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
