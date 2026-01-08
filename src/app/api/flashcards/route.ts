import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT = 15000; // 15 giây

function getApiBaseUrl() {
  const raw =
    process.env.NEST_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001";
  return raw.replace(/\/+$/, "");
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

interface Flashcard {
  id: number;
  image_url?: string | null;
  answer: string;
  status: string;
}

export async function GET() {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/flashcards`;
  try {
    const res = await fetchWithTimeout(
      url,
      { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" },
      REQUEST_TIMEOUT
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[Flashcards API] Backend response not ok:", {
        url,
        status: res.status,
        body: text?.slice?.(0, 500),
      });
      // Trả về items rỗng để UI vẫn chạy được
      return NextResponse.json({ items: [], error: "Backend flashcards lỗi hoặc không phản hồi." }, { status: 200 });
    }

    const data = (await res.json().catch(() => [])) as Flashcard[];
    const safe = Array.isArray(data) ? data : [];
    // Trả về tối đa 25 phần tử
    const items = safe.slice(0, 25);
    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("[Flashcards API] Error:", {
      message: error?.message,
      url,
      code: error?.cause?.code,
    });
    // Nếu backend down (ECONNREFUSED) hoặc timeout, trả items rỗng để UI không bị 500 liên tục
    return NextResponse.json(
      { items: [], error: "Không thể kết nối backend để tải flashcard. Hãy bật server NestJS." },
      { status: 200 }
    );
  }
}


