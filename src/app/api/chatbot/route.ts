import { NextResponse } from "next/server";

// Cấu hình Azure OpenAI
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "https://chinese-openai.openai.azure.com";
const AZURE_OPENAI_API_VERSION = "2025-01-01-preview";
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

type ChatRequestBody = {
  message: string;
  history?: { role: "user" | "model"; content: string }[];
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    console.log("[Chatbot API] API Key check:", apiKey ? "✓ Found" : "✗ Missing");
    
    if (!apiKey) {
      console.error("[Chatbot API] ❌ Missing AZURE_OPENAI_API_KEY");
      return NextResponse.json(
        { error: "Thiếu cấu hình AZURE_OPENAI_API_KEY trên server." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as ChatRequestBody;
    const prompt = body?.message?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Vui lòng nhập nội dung câu hỏi." },
        { status: 400 }
      );
    }

    console.log("[Chatbot API] Processing prompt:", prompt.substring(0, 50) + "...");

    // System prompt tối ưu, ngắn gọn hơn để phản hồi nhanh
    const systemInstruction = `Bạn là CapyChat AI - trợ lý chuyên giúp người Việt học tiếng Trung.

⚠️ PHẠM VI: CHỈ trả lời về tiếng Trung, tiếng Việt, phương pháp học. Từ chối lịch sự các câu hỏi ngoài phạm vi.

Nhiệm vụ:
- Giải thích Pinyin, Hanzi, từ vựng, ngữ pháp tiếng Trung
- Dịch giữa tiếng Trung và tiếng Việt
- Hướng dẫn phương pháp học hiệu quả
- Gợi ý lộ trình học

Nguyên tắc:
- Trả lời ngắn gọn, dễ hiểu, bằng tiếng Việt
- Ví dụ kèm Hanzi, Pinyin, nghĩa tiếng Việt
- Từ chối nhẹ nhàng câu hỏi không liên quan, nhắc lại phạm vi

Khi câu hỏi ngoài phạm vi, trả lời: "Xin lỗi, mình chỉ giúp về tiếng Trung và tiếng Việt. Bạn có câu hỏi nào về học tiếng Trung không?"`;

    // Chuẩn bị lịch sử hội thoại - giới hạn để tối ưu
    const maxHistory = 10; // Chỉ lấy 10 tin nhắn gần nhất
    const historyParts = (body.history?.slice(-maxHistory) || []).map((h) => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.content,
    }));

    // Chuyển lịch sử sang định dạng Azure OpenAI
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemInstruction },
      ...historyParts.map((h) => ({
        role: h.role,
        content: h.content,
      })),
      { role: "user", content: prompt },
    ];

    const requestBody = {
      messages,
      temperature: 0.7,
      max_tokens: 512, // Giữ phản hồi ngắn gọn, nhanh
      top_p: 0.9,
      model: AZURE_OPENAI_DEPLOYMENT,
    };

    const apiUrl = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;
    console.log("[Chatbot API] Calling Azure OpenAI API...");

    // Sử dụng fetchWithTimeout thay vì fetch thông thường
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
      
      console.error("[Chatbot API] ❌ Gemini API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorJson,
      });

      return NextResponse.json(
        {
          error: "Không gọi được AI. Vui lòng thử lại sau.",
          details: process.env.NODE_ENV === "development" ? {
            status: response.status,
            error: errorJson,
          } : undefined,
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("[Chatbot API] ✓ Azure OpenAI response received");

    if (!data.choices || data.choices.length === 0) {
      console.warn("[Chatbot API] ⚠️ No choices in response");
      return NextResponse.json(
        { 
          error: "AI không trả về kết quả. Vui lòng thử lại.",
        },
        { status: 500 }
      );
    }

    const firstChoice = data.choices[0];
    const replyText = firstChoice.message?.content || 
      "Xin lỗi, mình chưa hiểu câu hỏi. Bạn mô tả lại rõ hơn giúp mình nhé.";

    console.log("[Chatbot API] ✓ Reply generated");

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("[Chatbot API] ❌ Exception:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack?.substring(0, 500),
    });

    // Xử lý các loại lỗi cụ thể
    let errorMessage = "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau.";
    
    if (error?.message?.includes("timeout")) {
      errorMessage = "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại với câu hỏi ngắn hơn.";
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
