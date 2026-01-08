// Các hàm tiện ích validate/chuẩn hóa dữ liệu đầu vào

// Regex khối CJK (tiếng Trung, Nhật, Hàn) và các extension
// Dùng để ngăn meaning_vn chứa kí tự chữ Hán
const CJK_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u{20000}-\u{2EBEF}]/u;

/**
 * Chuẩn hóa và kiểm tra nghĩa tiếng Việt.
 * - Trim, gộp khoảng trắng
 * - Không cho phép kí tự CJK (chữ Hán)
 * Trả về { value, error }
 */
export function sanitizeVietnameseMeaning(raw: unknown): { value?: string; error?: string } {
  if (typeof raw !== 'string') {
    return { error: 'Nghĩa tiếng Việt không hợp lệ' };
  }

  // Chuẩn hóa khoảng trắng
  const normalized = raw.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return { error: 'Nghĩa tiếng Việt không được để trống' };
  }

  // Kiểm tra có chứa kí tự tiếng Trung/CJK hay không
  if (CJK_REGEX.test(normalized)) {
    return { error: 'Nghĩa tiếng Việt chỉ được phép là tiếng Việt, không chứa chữ Hán/CJK' };
  }

  // Có thể bổ sung rule chặt hơn nếu cần: độ dài tối thiểu, ký tự cho phép, v.v.
  return { value: normalized };
}


