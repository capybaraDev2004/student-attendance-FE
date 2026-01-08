import { NextResponse } from "next/server";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const REQUEST_TIMEOUT = 20000; // 20 giây

// Helper function để tạo fetch với timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request timeout sau ${timeoutMs / 1000} giây`);
    }
    throw error;
  }
}

type CharacterInfoRequestBody = {
  character: string; // Chữ Hán
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu cấu hình GEMINI_API_KEY trên server." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as CharacterInfoRequestBody;
    const character = body?.character?.trim();

    if (!character) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp chữ Hán." },
        { status: 400 }
      );
    }

    console.log("[Character Info API] Getting info for:", character);

    // Prompt để lấy thông tin về chữ Hán
    const prompt = `Bạn là chuyên gia về chữ Hán (Chinese characters).

Nhiệm vụ: Cung cấp thông tin về chữ Hán "${character}"

Format trả về (theo đúng thứ tự này, mỗi thông tin một dòng):
Pinyin: [cách đọc pinyin]
Nghĩa: [nghĩa tiếng Việt]

Ví dụ cho chữ "人":
Pinyin: rén
Nghĩa: người

Lưu ý:
- Chỉ trả về Pinyin và Nghĩa, không thêm giải thích khác
- Nếu không biết, trả về:
Pinyin: -
Nghĩa: -

Hãy cung cấp thông tin về chữ Hán "${character}".`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 100,
        topP: 0.8,
        topK: 20,
      },
    };

    const apiUrl = `${GEMINI_API_BASE}/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Character Info API] ❌ Error:", response.status);
      return NextResponse.json(
        {
          error: "Không thể lấy thông tin về chữ Hán.",
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json(
        { 
          error: "Không lấy được thông tin.",
        },
        { status: 500 }
      );
    }

    const candidate = data.candidates[0];
    const responseText = candidate.content.parts[0].text?.trim() || "";

    // Parse response
    let pinyin = "-";
    let meaning = "-";

    if (responseText) {
      const lines = responseText.split("\n").map((line) => line.trim()).filter((line) => line);
      
      for (const line of lines) {
        if (line.startsWith("Pinyin:")) {
          pinyin = line.replace("Pinyin:", "").trim();
        } else if (line.startsWith("Nghĩa:")) {
          meaning = line.replace("Nghĩa:", "").trim();
        }
      }
    }

    console.log("[Character Info API] ✓ Info:", { character, pinyin, meaning });

    return NextResponse.json({ 
      character,
      pinyin,
      meaning,
      success: true,
    });
  } catch (error: any) {
    console.error("[Character Info API] ❌ Exception:", error?.message);
    
    return NextResponse.json(
      { 
        error: "Có lỗi xảy ra khi lấy thông tin. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}

