import { NextRequest, NextResponse } from "next/server";

// Azure Speech Service Configuration (optional - nếu có env variables thì dùng Azure)
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "eastasia";
const AZURE_SPEECH_ENDPOINT = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
const CHINESE_VOICE = "zh-CN-XiaoyiNeural"; // nữ trẻ

// Base URL cho audio files từ tiengtrungthuonghai.vn (fallback)
const AUDIO_BASE_URL = "https://tiengtrungthuonghai.vn/wp-content/uploads/2019/12";

/**
 * Mapping đặc biệt cho các phụ âm có tên file không theo pattern thông thường
 */
const SPECIAL_AUDIO_MAPPING: Record<string, string> = {
  "b": "https://tiengtrungthuonghai.vn/wp-content/uploads/2019/12/Bài-2.-Học-tiếng-Trung-Cơ-bản-Phụ-âm-Thanh-mẫu-trong-tiếng.mp3",
  "p": "https://tiengtrungthuonghai.vn/wp-content/uploads/2019/12/泼.mp3",
  "f": "https://tiengtrungthuonghai.vn/wp-content/uploads/2019/12/Bài-2.-Học-tiếng-Trung-Cơ-bản-Phụ-âm-Thanh-mẫu-trong-tiếng-2.mp3",
  "m": "https://tiengtrungthuonghai.vn/wp-content/uploads/2019/12/Bài-2.-Học-tiếng-Trung-Cơ-bản-Phụ-âm-Thanh-mẫu-trong-tiếng-3.mp3",
};

/**
 * Lấy các URL audio khả thi cho Pinyin từ tiengtrungthuonghai.vn
 * Thử nhiều pattern để tìm file đúng:
 * 1. TẤT CẢ IN HOA: "iu" -> "IU.mp3"
 * 2. Chữ đầu in hoa: "iu" -> "Iu.mp3"
 * 3. Tất cả lowercase: "iu" -> "iu.mp3"
 */
function getPossibleAudioUrls(pinyin: string): string[] {
  if (!pinyin) return [];

  // Kiểm tra mapping đặc biệt trước
  if (SPECIAL_AUDIO_MAPPING[pinyin]) {
    console.log(`✓ Sử dụng mapping đặc biệt cho "${pinyin}"`);
    return [SPECIAL_AUDIO_MAPPING[pinyin]];
  }

  // Loại bỏ khoảng trắng và chuyển thành lowercase
  let normalized = pinyin.trim().toLowerCase();
  
  // Loại bỏ dấu thanh điệu
  normalized = normalized
    .replace(/[āáǎà]/g, "a")
    .replace(/[ēéěè]/g, "e")
    .replace(/[īíǐì]/g, "i")
    .replace(/[ōóǒò]/g, "o")
    .replace(/[ūúǔù]/g, "u")
    .replace(/[ǖǘǚǜü]/g, "u"); // ü cũng thành u cho filename

  // Tạo các pattern khả thi
  const patterns = [
    // Pattern 1: TẤT CẢ IN HOA (ưu tiên)
    normalized.toUpperCase(),
    // Pattern 2: Chữ đầu in hoa
    normalized.charAt(0).toUpperCase() + normalized.slice(1),
    // Pattern 3: Tất cả lowercase
    normalized,
  ];

  // Loại bỏ duplicate và tạo URL
  return [...new Set(patterns)].map(fileName => `${AUDIO_BASE_URL}/${fileName}.mp3`);
}

/**
 * Chuẩn hóa text
 * - Loại bỏ khoảng trắng thừa
 * - Nếu có dấu phẩy, chỉ lấy phần đầu
 */
function normalizeText(text: string): string {
  if (!text) return text;
  
  // Loại bỏ khoảng trắng thừa
  let normalized = text.trim();
  
  // Nếu có dấu phẩy, chỉ lấy phần đầu (cho các danh sách)
  if (normalized.includes(",")) {
    normalized = normalized.split(",")[0].trim();
  }
  
  return normalized;
}

/**
 * Tạo SSML cho Azure Speech Service
 */
function createSSML(text: string): string {
  // Loại bỏ khoảng trắng thừa và chuẩn hóa
  const cleanText = text.trim().replace(/\s+/g, " ");
  return `<speak version="1.0" xml:lang="zh-CN">
    <voice xml:lang="zh-CN" name="${CHINESE_VOICE}">
      ${cleanText}
    </voice>
  </speak>`;
}

/**
 * Thử dùng Azure TTS để phát âm
 */
async function tryAzureTTS(text: string): Promise<ArrayBuffer | null> {
  if (!AZURE_SPEECH_KEY) {
    return null;
  }

  try {
    const ssml = createSSML(text);
    const response = await fetch(AZURE_SPEECH_ENDPOINT, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
      },
      body: ssml,
    });

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      if (audioBuffer.byteLength > 0) {
        console.log(`✓ Azure TTS thành công cho: ${text} (${audioBuffer.byteLength} bytes)`);
        return audioBuffer;
      }
    } else {
      console.log(`✗ Azure TTS lỗi: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`✗ Azure TTS exception:`, error);
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get("text");

    if (!text) {
      return NextResponse.json({ message: "Thiếu tham số text" }, { status: 400 });
    }

    // Chuẩn hóa text
    const normalizedText = normalizeText(text);

    // Ưu tiên thử Azure TTS trước (nếu có key)
    const azureAudio = await tryAzureTTS(normalizedText);
    if (azureAudio) {
      return new NextResponse(azureAudio, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": azureAudio.byteLength.toString(),
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=86400",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Fallback: Lấy các URL audio khả thi từ tiengtrungthuonghai.vn
    const possibleUrls = getPossibleAudioUrls(normalizedText);
    
    if (possibleUrls.length === 0) {
      console.error(`Không có URL audio cho: ${normalizedText}`);
      return NextResponse.json(
        { message: `Không tìm thấy file audio cho: ${normalizedText}` },
        { status: 404 }
      );
    }

    // Thử từng URL cho đến khi tìm thấy file
    console.log(`Đang thử các URL cho "${normalizedText}":`, possibleUrls);
    
    for (const audioUrl of possibleUrls) {
      try {
        const audioResponse = await fetch(audioUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://tiengtrungthuonghai.vn/",
          },
        });

        if (audioResponse.ok) {
          const audioBuffer = await audioResponse.arrayBuffer();
          
          if (audioBuffer.byteLength > 0) {
            console.log(`✓ Lấy audio thành công từ: ${audioUrl} (${audioBuffer.byteLength} bytes)`);
            
            const contentType = audioResponse.headers.get("content-type") || "audio/mpeg";

            // Trả về audio với header phù hợp
            return new NextResponse(audioBuffer, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Content-Length": audioBuffer.byteLength.toString(),
                "Accept-Ranges": "bytes",
                "Cache-Control": "public, max-age=86400", // Cache 1 ngày
                "Access-Control-Allow-Origin": "*",
              },
            });
          }
        }
        console.log(`✗ Không tìm thấy: ${audioUrl}`);
      } catch (error) {
        console.log(`✗ Lỗi khi thử ${audioUrl}:`, error);
      }
    }

    // Nếu không tìm thấy file nào
    console.error(`Đã thử tất cả pattern nhưng không tìm thấy file audio cho: ${normalizedText}`);
    return NextResponse.json(
      { 
        message: `Không tìm thấy file audio cho "${normalizedText}". Đã thử: ${possibleUrls.join(", ")}`,
        tried: possibleUrls
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Lỗi TTS API:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ", error: String(error) },
      { status: 500 }
    );
  }
}

