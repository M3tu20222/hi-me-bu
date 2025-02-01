import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const product = await Product.findById(params.id).populate("season");
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Ürün yüklenirken bir hata oluştu" },
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
    const productData = await request.json();
    const product = await Product.findByIdAndUpdate(params.id, productData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Ürün güncellenirken bir hata oluştu" },
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
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    return NextResponse.json(
      { error: "Ürün silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
