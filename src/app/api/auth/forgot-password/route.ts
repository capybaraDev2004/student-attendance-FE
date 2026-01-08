import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEST_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Lỗi quên mật khẩu:", error);
    return NextResponse.json({ message: "Lỗi máy chủ." }, { status: 500 });
  }
}

