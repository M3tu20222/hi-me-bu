import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Fertilizer } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" &&
      session.user.role !== "Ortak" &&
      session.user.role !== "İşçi")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const fertilizer = await Fertilizer.findById(params.id);
    if (!fertilizer) {
      return NextResponse.json({ error: "Gübre bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(fertilizer);
  } catch (error) {
    return NextResponse.json(
      { error: "Gübre yüklenirken bir hata oluştu" },
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
    const fertilizerData = await request.json();

    if (fertilizerData.unit === "çuval" && !fertilizerData.kgPerBag) {
      return NextResponse.json(
        { error: "Çuval birimi için kg/çuval değeri gereklidir" },
        { status: 400 }
      );
    }

    const fertilizer = await Fertilizer.findByIdAndUpdate(
      params.id,
      fertilizerData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!fertilizer) {
      return NextResponse.json({ error: "Gübre bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(fertilizer);
  } catch (error) {
    return NextResponse.json(
      { error: "Gübre güncellenirken bir hata oluştu" },
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
    const fertilizer = await Fertilizer.findByIdAndDelete(params.id);
    if (!fertilizer) {
      return NextResponse.json({ error: "Gübre bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Gübre başarıyla silindi" });
  } catch (error) {
    return NextResponse.json(
      { error: "Gübre silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
