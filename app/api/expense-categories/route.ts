import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ExpenseCategory } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function createInitialCategories() {
  const initialCategories = [
    { name: "Yakıt", isSubcategory: false },
    { name: "Gübre", isSubcategory: false },
    { name: "İşçilik", isSubcategory: false },
    { name: "Bakım", isSubcategory: false },
  ];

  for (const category of initialCategories) {
    await ExpenseCategory.findOneAndUpdate({ name: category.name }, category, {
      upsert: true,
      new: true,
    });
  }
}

export async function GET() {
  console.log("GET /api/expense-categories called");
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    let categories = await ExpenseCategory.find({}).populate(
      "parentCategory",
      "name"
    );

    if (categories.length === 0) {
      console.log("No categories found. Creating initial categories.");
      await createInitialCategories();
      categories = await ExpenseCategory.find({}).populate(
        "parentCategory",
        "name"
      );
    }

    console.log("Fetched categories:", JSON.stringify(categories, null, 2));
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Gider kategorileri yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Gider kategorileri yüklenirken bir hata oluştu" },
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
    const categoryData = await request.json();

    // If parentCategory is "none", set it to null
    if (categoryData.parentCategory === "none") {
      categoryData.parentCategory = null;
    }

    const category = await ExpenseCategory.create(categoryData);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Gider kategorisi oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Gider kategorisi oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
