import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    console.error("Ürünler yüklenirken hata oluştu:", error);
    return NextResponse.json(
      { error: "Ürünler yüklenirken bir hata oluştu" },
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
    const productData = await request.json();
    console.log("Gelen ürün verisi:", productData);

    // Gerekli alanların kontrolü
    if (!productData.name || !productData.category || !productData.unit) {
      return NextResponse.json(
        { error: "Eksik bilgi. Ad, kategori ve birim gereklidir." },
        { status: 400 }
      );
    }

    // Opsiyonel alanları kontrol et ve ekle
    const optionalFields = [
      "type",
      "plantingDate",
      "field",
      "harvestDate",
      "revenue",
    ];
    optionalFields.forEach((field) => {
      if (productData[field] === undefined || productData[field] === "") {
        delete productData[field];
      }
    });

    const product = await Product.create(productData);
    console.log("Oluşturulan ürün:", product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Ürün oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Ürün oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
