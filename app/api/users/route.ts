import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/lib/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== "Admin" && session.user.role !== "Ortak")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  try {
    await dbConnect();
    let query = {};
    if (role) {
      query = { role };
    }
    const users = await User.find(query).select("-password");
    return NextResponse.json(users);
  } catch (error) {
    console.error("Kullanıcılar yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Kullanıcılar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newUser = new User(body);
    await newUser.save();
    return NextResponse.json({ message: "Kullanıcı başarıyla oluşturuldu" });
  } catch (error) {
    console.error("Kullanıcı oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Kullanıcı oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
