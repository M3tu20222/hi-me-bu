import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password, role } = await request.json();

    // Basit doğrulama
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Tüm alanlar gereklidir." },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor." },
        { status: 400 }
      );
    }

    // Rol kontrolü
    if (!["Admin", "Ortak", "İşçi"].includes(role)) {
      return NextResponse.json({ error: "Geçersiz rol." }, { status: 400 });
    }

    const user = await User.create({ name, email, password, role });
    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu.", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt işlemi sırasında hata:", error);
    return NextResponse.json(
      { error: "Kullanıcı oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
