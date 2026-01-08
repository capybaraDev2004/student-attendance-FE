import { NextResponse } from "next/server";

// Cấu hình Azure OpenAI
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "https://chinese-openai.openai.azure.com";
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview";
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";
const REQUEST_TIMEOUT = 30000; // 30 giây

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

type RecognizeRequestBody = {
  image: string; // Base64 data URL
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY;
    console.log("[Recognize API] API Key check:", apiKey ? "✓ Found" : "✗ Missing");
    
    if (!apiKey) {
      console.error("[Recognize API] ❌ Missing AZURE_OPENAI_API_KEY");
      return NextResponse.json(
        { error: "Thiếu cấu hình AZURE_OPENAI_API_KEY trên server." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RecognizeRequestBody;
    const imageDataUrl = body?.image;

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp hình ảnh để nhận dạng." },
        { status: 400 }
      );
    }

    console.log("[Recognize API] Processing image recognition...");

    // Kiểm tra nhanh định dạng data URL
    const isDataUrl = /^data:image\/(png|jpg|jpeg);base64,/.test(imageDataUrl);
    if (!isDataUrl) {
      return NextResponse.json(
        { error: "Định dạng hình ảnh không hợp lệ." },
        { status: 400 }
      );
    }

    // Chuẩn bị prompt Azure OpenAI (multimodal)
    const prompt = `Nhận diện tất cả chữ Hán trong ảnh. Trả về JSON array:
[
  { "character": "好", "pinyin": "hǎo", "meaning": "tốt", "confidence": "high" }
]
Nếu không chắc, đặt "confidence": "low". Chỉ trả về JSON, không thêm chú thích khác.`;

    const messages = [
      { role: "system", content: "Bạn là chuyên gia nhận dạng chữ Hán viết tay. Chỉ trả về kết quả ngắn gọn dưới dạng JSON." },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl, // data URL; nếu Azure không chấp nhận, cần upload và truyền URL công khai
            },
          },
        ],
      },
    ];

    const requestBody = {
      messages,
      temperature: 0,
      max_tokens: 800,
      model: AZURE_OPENAI_DEPLOYMENT,
    };

    const apiUrl = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;
    console.log("[Recognize API] Calling Azure OpenAI for image recognition...");

    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: any = { raw: errorText };
      
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        // Nếu không parse được JSON, giữ nguyên raw text
      }
      
      console.error("[Recognize API] ❌ Azure OpenAI error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorJson,
      });

      // Xử lý lỗi 429 (Rate Limit / Quota exceeded)
      if (response.status === 429) {
        let errorMessage = "Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.";
        let retryAfter: number | undefined;

        // Tìm thông tin retry time trong error message
        const errorMessageText = errorJson?.error?.message || errorText || "";
        const retryMatch = errorMessageText.match(/retry in ([\d.]+)s/i);
        if (retryMatch) {
          retryAfter = Math.ceil(parseFloat(retryMatch[1]));
          errorMessage = `Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau ${retryAfter} giây.`;
        }

        // Kiểm tra nếu có thông báo về quota
        if (errorMessageText.includes("quota") || errorMessageText.includes("Quota exceeded")) {
          errorMessage = "Đã hết hạn mức sử dụng miễn phí của API. Vui lòng kiểm tra tài khoản hoặc thử lại sau.";
          if (retryAfter) {
            errorMessage = `Đã hết hạn mức sử dụng miễn phí. Vui lòng thử lại sau ${retryAfter} giây.`;
          }
        }

        return NextResponse.json(
          {
            error: errorMessage,
            code: "RATE_LIMIT_EXCEEDED",
            retryAfter,
            details: process.env.NODE_ENV === "development" ? {
              status: response.status,
              error: errorJson,
            } : undefined,
          },
          { status: 429 }
        );
      }

      // Xử lý các lỗi khác
      let errorMessage = "Không thể nhận dạng chữ. Vui lòng thử lại.";
      
      if (response.status === 400) {
        errorMessage = "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.";
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = "Lỗi xác thực API. Vui lòng liên hệ quản trị viên.";
      } else if (response.status >= 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: process.env.NODE_ENV === "development" ? {
            status: response.status,
            error: errorJson,
          } : undefined,
        },
        { status: response.status >= 500 ? 500 : response.status }
      );
    }

    const data = await response.json();
    console.log("[Recognize API] ✓ Azure OpenAI response received");

    const responseText = data?.choices?.[0]?.message?.content?.trim() || "";
    let parsedResults: any[] = [];

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        if (Array.isArray(parsed)) {
          parsedResults = parsed;
        } else if (parsed?.character) {
          parsedResults = [parsed];
        }
      } catch (e) {
        // Không parse được JSON, fallback phía dưới
      }
    }

    // Lấy danh sách chữ Hán
    let characters: string[] = [];

    if (parsedResults.length > 0) {
      characters = parsedResults
        .map((item) => item.character)
        .filter((c: string | undefined) => typeof c === "string" && c.trim())
        .map((c: string) => c.trim());
    } else if (responseText) {
      const matches = responseText.match(/[\u4e00-\u9fff]+/g);
      if (matches) {
        characters = matches;
      }
    }

    characters = [...new Set(characters)].slice(0, 5);

    console.log("[Recognize API] ✓ Parsed characters:", characters);

    return NextResponse.json({ 
      characters,
      results: parsedResults.length > 0 ? parsedResults : undefined,
      raw: responseText || undefined,
      success: true,
    });
  } catch (error: any) {
    console.error("[Recognize API] ❌ Exception:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack?.substring(0, 500),
    });

    let errorMessage = "Có lỗi xảy ra khi nhận dạng chữ. Vui lòng thử lại sau.";
    
    if (error?.message?.includes("timeout")) {
      errorMessage = "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.";
    } else if (error?.message?.includes("fetch failed") || error?.name === "TypeError") {
      errorMessage = "Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng và thử lại.";
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? {
          message: error?.message,
          name: error?.name,
        } : undefined,
      },
      { status: 500 }
    );
  }
}


