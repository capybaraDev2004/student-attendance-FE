import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT = 30000; // 30 giây

function getApiBaseUrl() {
  const raw =
    process.env.NEST_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001";
  return raw.replace(/\/+$/, "");
}

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

// Azure OpenAI (cho feedback)
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "https://chinese-openai.openai.azure.com";
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview";
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY;

type AssessRequestBody = {
  audioBase64: string; // base64 data URL hoặc raw base64
  referenceText: string;
  mimeType?: string; // ví dụ: audio/webm; codecs=opus hoặc audio/wav
};

// Decode base64 data URL -> base64 string
function decodeBase64(data: string): string | null {
  if (!data) return null;
  const parts = data.split(",");
  return parts.length > 1 ? parts[1] : parts[0];
}

async function callAzureOpenAI(payload: {
  transcript: string;
  referenceText: string;
  accuracy?: number;
  fluency?: number;
  completeness?: number;
}) {
  if (!AZURE_OPENAI_KEY) {
    return null;
  }

  const { transcript, referenceText, accuracy, fluency, completeness } = payload;

  const system = `Bạn là trợ lý chấm điểm phát âm tiếng Trung. Trả lời ngắn gọn, JSON duy nhất, không thêm chú thích.`;
  const user = `Bài đọc (STT): "${transcript}"
Mẫu chuẩn (reference): "${referenceText}"
Điểm Azure Speech: accuracy=${accuracy ?? "-"}, fluency=${fluency ?? "-"}, completeness=${completeness ?? "-"}

Yêu cầu:
1) Dịch transcript sang tiếng Trung (nếu không phải tiếng Trung, hãy dịch)
2) Dịch nghĩa tiếng Việt ngắn gọn
3) Tóm tắt lỗi phát âm chính (nếu có)
4) Gợi ý sửa/ luyện tập ngắn

Format JSON:
{
  "translation": "<bản dịch tiếng Trung>",
  "meaning_vi": "<nghĩa tiếng Việt ngắn>",
  "issues": ["vấn đề 1", "vấn đề 2"],
  "advice": "gợi ý ngắn"
}`;

  const apiUrl = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;
  const resp = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_OPENAI_KEY,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0,
      max_tokens: 300,
      model: AZURE_OPENAI_DEPLOYMENT,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Azure OpenAI lỗi ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch {
    return { raw: content };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssessRequestBody;
    const { audioBase64, referenceText } = body || {};

    if (!audioBase64) {
      return NextResponse.json({ error: "Thiếu audioBase64" }, { status: 400 });
    }
    if (!referenceText) {
      return NextResponse.json({ error: "Thiếu referenceText" }, { status: 400 });
    }

    const base64String = decodeBase64(audioBase64);
    if (!base64String) {
      return NextResponse.json({ error: "Audio không hợp lệ" }, { status: 400 });
    }

    // Gọi backend NestJS để chấm điểm phát âm bằng Azure Speech SDK
    const baseUrl = getApiBaseUrl();
    const backendUrl = `${baseUrl}/speech/pronunciation`;

    let speechResult;
    try {
      const response = await fetchWithTimeout(
        backendUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioBase64: base64String,
            text: referenceText.trim(),
          }),
        },
        REQUEST_TIMEOUT
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Assess API] Backend error:", {
          status: response.status,
          body: errorText.substring(0, 500),
        });
        throw new Error(
          `Backend lỗi ${response.status}: ${errorText.substring(0, 200)}`
        );
      }

      speechResult = await response.json();
    } catch (err: any) {
      console.error("[Assess API] Backend call failed:", err);
      return NextResponse.json(
        {
          error: `Lỗi khi gọi backend: ${err?.message || "Vui lòng kiểm tra cấu hình AZURE_SPEECH_KEY và thử lại."}`,
          details: process.env.NODE_ENV === "development" ? { message: err?.message } : undefined,
        },
        { status: 502 }
      );
    }

    // Parse kết quả từ Azure Speech SDK
    const transcript = speechResult?.text || "";
    const assessment = {
      accuracy: speechResult?.accuracyScore,
      fluency: speechResult?.fluencyScore,
      completeness: speechResult?.completenessScore,
      pronScore: speechResult?.pronunciationScore,
      words: speechResult?.words || [],
    };

    // Nếu không có điểm, trả lỗi để frontend hiển thị rõ
    if (!speechResult?.pronunciationScore && speechResult?.pronunciationScore !== 0) {
      console.warn("[Assess API] No pronunciation score in response:", speechResult);
      return NextResponse.json(
        {
          error: "Không nhận được điểm phát âm từ Azure Speech. Có thể do format audio không được hỗ trợ (cần WAV PCM 16kHz) hoặc audio quá ngắn. Vui lòng thử ghi lại.",
          transcript,
          raw: speechResult,
        },
        { status: 502 }
      );
    }

    // Gọi Azure OpenAI để phân tích nhanh (optional)
    let aiFeedback = null;
    try {
      aiFeedback = await callAzureOpenAI({
        transcript,
        referenceText,
        accuracy: assessment.accuracy,
        fluency: assessment.fluency,
        completeness: assessment.completeness,
      });
    } catch (err) {
      console.error("[Assess] Azure OpenAI feedback error:", err);
    }

    return NextResponse.json({
      success: true,
      transcript,
      assessment,
      aiFeedback: aiFeedback || undefined,
      raw: speechResult,
    });
  } catch (error: any) {
    console.error("[Assess API] ❌ Exception:", error);
    return NextResponse.json(
      {
        error: error?.message || "Lỗi server khi chấm điểm phát âm",
      },
      { status: 500 }
    );
  }
}

