import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// API seed admin an toàn cơ bản qua ENV FLAG
export async function POST() {
  try {
    const allowSeed = process.env.ALLOW_SEED_ADMIN === "true";
    if (!allowSeed) {
      return NextResponse.json({ message: "Seed bị tắt." }, { status: 403 });
    }

    const username = "capybara";
    const email = "capybaradev2004@gmail.com";
    const rawPassword = "1998";

    const existed = await prisma.users.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existed) {
      // Đảm bảo set role admin nếu đã tồn tại
      if (existed.role !== "admin") {
        await prisma.users.update({ where: { user_id: existed.user_id }, data: { role: "admin" } });
      }
      return NextResponse.json({ message: "Admin đã tồn tại." }, { status: 200 });
    }

    const password_hash = await bcrypt.hash(rawPassword, 10);
    await prisma.users.create({
      data: {
        username,
        email,
        password_hash,
        role: "admin",
        email_confirmed: true,
        account_status: "vip",
        account_type: "local",
        must_set_password: false,
      },
    });

    return NextResponse.json({ message: "Tạo admin thành công." }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Lỗi máy chủ." }, { status: 500 });
  }
}


