import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ExpenseCategory } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
    const { id } = params;
    const deletedCategory = await ExpenseCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Kategori başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gider kategorisi silinirken hata:", error);
    return NextResponse.json(
      { error: "Gider kategorisi silinirken bir hata oluştu" },
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
    const { id } = params;
    const updateData = await request.json();

    const updatedCategory = await ExpenseCategory.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Gider kategorisi güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Gider kategorisi güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
