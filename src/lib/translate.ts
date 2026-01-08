// Hàm dịch nhanh tiếng Trung -> tiếng Việt dùng endpoint công khai của Google Translate
// Lưu ý: Đây là endpoint không chính thức; nên dùng cho tác vụ nội bộ/admin.

/**
 * Dịch văn bản từ tiếng Trung (zh-CN) sang tiếng Việt (vi)
 * Trả về chuỗi đã dịch hoặc ném lỗi nếu thất bại
 */
type TranslateChunk = [translatedText: string, ...rest: unknown[]];

function extractTranslation(data: unknown): string {
  if (!Array.isArray(data)) {
    return "";
  }

  const firstLayer = data[0];
  if (!Array.isArray(firstLayer)) {
    return "";
  }

  const translated = (firstLayer as unknown[])
    .filter((chunk): chunk is TranslateChunk => Array.isArray(chunk) && typeof chunk[0] === "string")
    .map((chunk) => chunk[0])
    .join("");

  return translated.trim();
}

export async function translateZhToVi(text: string): Promise<string> {
  if (!text || typeof text !== 'string') return '';

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=vi&dt=t&q=${encodeURIComponent(
    text
  )}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Translate request failed with status ${res.status}`);
  }
  const data = await res.json();
  return extractTranslation(data);
}

/**
 * Dịch văn bản từ tiếng Anh (en) sang tiếng Việt (vi)
 */
export async function translateEnToVi(text: string): Promise<string> {
  if (!text || typeof text !== 'string') return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(
    text
  )}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return '';
  const data = await res.json();
  return extractTranslation(data);
}


