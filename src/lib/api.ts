export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type FetchOptions = RequestInit & { authToken?: string };

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (options.authToken) {
    headers.set("Authorization", `Bearer ${options.authToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  const rawText = await response.text();

  if (!response.ok) {
    let message = response.statusText || `Yêu cầu thất bại (${response.status})`;
    try {
      const data = JSON.parse(rawText) as { error?: string; message?: string };
      if (data?.error || data?.message) {
        message = data.error || data.message || message;
      }
    } catch {
      // bỏ qua lỗi parse JSON
    }

    // Chuẩn hóa thông báo 401/403 về tiếng Việt thân thiện
    if (response.status === 401) {
      message = "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.";
    } else if (response.status === 403) {
      message = "Bạn không có quyền thực hiện thao tác này.";
    }

    throw new ApiError(message, response.status);
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    return rawText as unknown as T;
  }
}
