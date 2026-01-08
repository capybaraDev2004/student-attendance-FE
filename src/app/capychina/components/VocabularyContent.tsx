"use client";

import { useState, useEffect } from "react";

type VocabularyContentProps = {
  speakPinyin: (text: string) => void;
  authToken?: string | null;
};

type VocabularyCategory = {
  id: number;
  name: string;
  wordCount: number;
  reviewDays: number;
};

type VocabularyWord = {
  vocabId?: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string;
  audio_url?: string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const CATEGORY_ICONS: { keywords: string[]; icon: string }[] = [
  { keywords: ["con người", "quan hệ"], icon: "👥" },
  { keywords: ["nghề nghiệp", "công việc", "kinh doanh"], icon: "💼" },
  { keywords: ["sức khỏe", "cơ thể"], icon: "💪" },
  { keywords: ["động vật", "thực vật"], icon: "🌿" },
  { keywords: ["món ăn", "đồ uống"], icon: "🍜" },
  { keywords: ["đồ dùng", "quần áo"], icon: "👗" },
  { keywords: ["phương tiện", "giao thông"], icon: "🚊" },
  { keywords: ["địa điểm", "môi trường"], icon: "🌍" },
  { keywords: ["thời gian", "thời tiết"], icon: "⏰" },
  { keywords: ["giải trí", "sở thích"], icon: "🎨" },
  { keywords: ["trường học", "học tập"], icon: "🏫" },
  { keywords: ["ngôn ngữ", "giao tiếp"], icon: "💬" },
  { keywords: ["tính từ", "đặc điểm"], icon: "✨" },
  { keywords: ["từ loại đặc biệt", "trợ từ"], icon: "🧭" },
  { keywords: ["văn hóa", "thói quen", "lễ nghi"], icon: "🎎" },
  { keywords: ["mua sắm"], icon: "🛍️" },
  { keywords: ["hoạt động thường ngày"], icon: "🔄" },
  { keywords: ["động từ"], icon: "⚡" },
  { keywords: ["số đếm", "số lượng"], icon: "🔢" },
];

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  const match = CATEGORY_ICONS.find(({ keywords }) =>
    keywords.some((keyword) => lower.includes(keyword)),
  );
  return match?.icon ?? "📘";
};

export default function VocabularyContent({
  speakPinyin,
  authToken,
}: VocabularyContentProps) {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<VocabularyCategory[]>([]);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedWords, setSelectedWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWords, setLoadingWords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // 4 hàng x 2 cột (mobile)
  const [memorizedMap, setMemorizedMap] = useState<Record<number, boolean>>({});
  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  // Set mounted state để tránh hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Tính toán số items mỗi trang dựa trên số cột responsive (4 hàng)
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const width = window.innerWidth;
      let cols = 2; // mobile default
      if (width >= 1024) cols = 6; // desktop
      else if (width >= 768) cols = 3; // tablet
      setItemsPerPage(cols * 4); // 4 hàng
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);
    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  // Reset về trang 1 khi chọn category mới
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  const updateMemorizedState = async (word: VocabularyWord, next: boolean) => {
    if (!word.vocabId) return;

    setMemorizedMap((prev) => ({
      ...prev,
      [word.vocabId!]: next,
    }));

    if (!authToken) return;

    try {
      await fetch(`${API_BASE}/vocabulary/state/memorized`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          vocabId: word.vocabId,
          isMemorized: next,
        }),
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái nhớ từ vựng:", error);
    }
  };

  const handlePlayWord = async (word: VocabularyWord) => {
    speakPinyin(word.pinyin);

    if (!authToken || !word.vocabId) return;

    try {
      await fetch(`${API_BASE}/vocabulary/state/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          vocabId: word.vocabId,
        }),
      });

      // Gửi request đến server để tăng vocabulary_count (server sẽ kiểm tra giới hạn và date)
      if (typeof window !== "undefined") {
        // Gửi request đến server trước, sau đó mới dispatch event
        fetch(`${API_BASE}/daily-tasks/increment-vocabulary`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            // Chỉ dispatch event nếu server trả về thành công và có dữ liệu hợp lệ
            if (data && data.vocabulary_count !== undefined) {
              // Dispatch event để refresh UI với dữ liệu từ server (đảm bảo đúng)
              window.dispatchEvent(new CustomEvent("progress-updated", {
                detail: { 
                  type: "vocabulary",
                  value: data.vocabulary_count // Gửi giá trị tuyệt đối từ server
                }
              }));
            }
          }
        })
        .catch((error) => {
          // Silent error - không log để tránh spam console
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đọc từ vựng:", error);
    }
  };

  // Fetch categories từ database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/vocabulary/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
          setTotalWords(data.totalWords || 0);
        } else {
          console.error("Lỗi khi lấy categories:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi khi fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch words khi chọn category
  useEffect(() => {
    if (selectedCategoryId === null) {
      setSelectedWords([]);
      return;
    }

    const fetchWords = async () => {
      try {
        setLoadingWords(true);
        console.log(`[Component] Đang fetch words cho category_id: ${selectedCategoryId}`);
        
        const response = await fetch(`/api/vocabulary/by-category/${selectedCategoryId}`);
        
        // Parse response - có thể fail nếu không phải JSON
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error("[Component] ❌ Lỗi parse JSON:", parseError);
          const text = await response.text();
          console.error("[Component] Response text:", text.substring(0, 500));
          setSelectedWords([]);
          return;
        }
        
        console.log(`[Component] Response status: ${response.status}`);
        console.log(`[Component] Response data:`, data);
        
        if (response.ok) {
          // Đảm bảo data là array
          if (Array.isArray(data)) {
            console.log(`[Component] ✅ Nhận được ${data.length} từ vựng`);
            setSelectedWords(data);
          } else {
            console.error("[Component] ❌ Data không phải array:", data);
            setSelectedWords([]);
          }
        } else {
          // Error response - đảm bảo log đầy đủ
          const errorInfo = {
            status: response.status,
            statusText: response.statusText,
            error: data?.error || data?.message || "Unknown error",
            code: data?.code || "NO_ERROR_CODE",
            categoryId: data?.categoryId || selectedCategoryId,
            stack: data?.stack,
            meta: data?.meta,
            fullData: JSON.stringify(data, null, 2),
          };
          console.error("[Component] ❌ Lỗi khi lấy vocabulary:", errorInfo);
          console.error("[Component] ❌ Full error response:", data);
          setSelectedWords([]);
        }
      } catch (error: any) {
        console.error("[Component] ❌ Exception khi fetch vocabulary:", {
          message: error?.message,
          name: error?.name,
          stack: error?.stack?.substring(0, 500),
          error,
        });
        setSelectedWords([]);
      } finally {
        setLoadingWords(false);
      }
    };

    fetchWords();
  }, [selectedCategoryId]);

  // Tránh hydration mismatch: chỉ render nội dung động sau khi mounted
  if (!mounted) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Học theo chủ đề</h2>
            <p className="text-base text-slate-600">
              Học theo chủ đề đời sống, áp dụng SRS để ôn tập đúng thời điểm. Mỗi từ gồm Hanzi, Pinyin, nghĩa tiếng Việt và câu ví dụ ngắn.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Học theo chủ đề</h2>
          <p className="text-base text-slate-600">
            Học theo chủ đề đời sống, áp dụng SRS để ôn tập đúng thời điểm. Mỗi từ gồm Hanzi, Pinyin, nghĩa tiếng Việt và câu ví dụ ngắn.
          </p>
        </div>

        {/* Ô tổng số từ vựng */}
        {!selectedCategory && !loading && categories.length > 0 && mounted && (
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Tổng số từ vựng</p>
                <p className="mt-1 text-3xl font-bold text-emerald-900">
                  {totalWords.toLocaleString("vi-VN")} từ
                </p>
                <p className="mt-1 text-sm text-emerald-600">Từ {categories.length} chủ đề</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách chủ đề */}
        {!selectedCategory && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Đang tải danh sách chủ đề...</div>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Chưa có chủ đề nào</div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md text-center"
                  >
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                        {getCategoryIcon(category.name)}
                      </div>
                      <p className="text-base font-semibold text-emerald-700">{category.name}</p>
                    </div>
                    <p className="text-xl font-bold text-emerald-900">{category.wordCount} từ cốt lõi</p>
                    <p className="text-base text-emerald-700">Ôn lại mỗi {category.reviewDays} ngày</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Danh sách từ vựng khi chọn chủ đề */}
        {selectedCategory && (
          <div>
            {/* Header với nút quay lại */}
            <div className="mb-4 flex items-center gap-4">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm"
                aria-label="Quay lại"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900">{selectedCategory.name}</h3>
              <span className="text-sm text-slate-500">({selectedCategory.wordCount} từ vựng)</span>
              </div>
            </div>

            {/* Ghi chú phát âm */}
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 space-y-1">
              <p className="text-sm text-emerald-800 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <span className="font-semibold">💡 Mẹo:</span>
                <span>Click ô chữ để nghe phát âm</span>
              </p>
              <p className="text-sm text-emerald-800 flex items-center gap-2 pl-6">
                <span className="font-semibold">💡 Mẹo:</span>
                <span>Ấn checkbox để lưu đã nhớ</span>
              </p>
            </div>

            {/* Danh sách từ vựng */}
            {loadingWords ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Đang tải từ vựng...</div>
              </div>
            ) : selectedWords.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Chưa có từ vựng nào trong chủ đề này</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                  {selectedWords
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((word, index) => {
                      const isMemorized =
                        typeof word.vocabId === "number"
                          ? !!memorizedMap[word.vocabId]
                          : false;

                      return (
                  <div
                    key={index}
                          onClick={() => handlePlayWord(word)}
                          className="relative group flex flex-col rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md hover:bg-emerald-50/30 cursor-pointer active:scale-[0.98]"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePlayWord(word);
                            }
                          }}
                          aria-label={`Phát âm ${word.hanzi} - ${word.pinyin}`}
                        >
                          {/* Checkbox đánh dấu đã nhớ */}
                          {typeof word.vocabId === "number" && (
                      <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMemorizedState(word, !isMemorized);
                              }}
                              className={`absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-md border-2 text-[11px] font-bold transition-all shadow-sm ${
                                isMemorized
                                  ? "border-emerald-600 bg-emerald-500 text-white shadow-emerald-200"
                                  : "border-emerald-300 bg-white text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                              }`}
                              aria-label={
                                isMemorized ? "Bỏ đánh dấu đã nhớ" : "Đánh dấu đã nhớ"
                              }
                            >
                              ✓
                      </button>
                          )}

                          <div className="flex-1 space-y-1.5">
                            {/* Hàng 1: Từ tiếng Trung */}
                            <p className="text-lg capy-hanzi-550 text-slate-700 break-words">
                              {word.hanzi}
                            </p>
                            {/* Hàng 2: Pinyin */}
                            <p className="text-base text-slate-500 break-words">
                              {word.pinyin}
                            </p>
                            {/* Hàng 3: Nghĩa tiếng Việt */}
                            <p className="text-base font-semibold text-emerald-700 break-words">
                              {word.meaning}
                            </p>
                    </div>
                    {/* Câu ví dụ */}
                    {word.example && (
                            <div className="mt-2 rounded-lg bg-slate-50 p-2">
                              <p className="text-xs text-slate-600">
                          <span className="font-semibold text-slate-700">Ví dụ: </span>
                          {word.example}
                        </p>
                      </div>
                    )}
                  </div>
                      );
                    })}
                </div>

                {/* Phân trang */}
                {selectedWords.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 lg:h-9 lg:w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 text-sm lg:text-xs transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 disabled:hover:text-slate-700"
                      aria-label="Trang trước"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.ceil(selectedWords.length / itemsPerPage) }, (_, i) => i + 1)
                        .filter((page) => {
                          const totalPages = Math.ceil(selectedWords.length / itemsPerPage);
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          return false;
                        })
                        .map((page, index, array) => {
                          const totalPages = Math.ceil(selectedWords.length / itemsPerPage);
                          const prevPage = array[index - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;

                          return (
                            <div key={page} className="flex items-center gap-1">
                              {showEllipsis && (
                                <span className="px-2 text-slate-400">...</span>
                              )}
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`flex h-10 w-10 lg:h-9 lg:w-9 items-center justify-center rounded-lg border text-sm lg:text-xs transition-all ${
                                  currentPage === page
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                                    : "border-slate-300 bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                                }`}
                                aria-label={`Trang ${page}`}
                              >
                                {page}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(selectedWords.length / itemsPerPage), prev + 1))}
                      disabled={currentPage >= Math.ceil(selectedWords.length / itemsPerPage)}
                      className="flex h-10 w-10 lg:h-9 lg:w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 text-sm lg:text-xs transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 disabled:hover:text-slate-700"
                      aria-label="Trang sau"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Thông tin phân trang */}
                {selectedWords.length > itemsPerPage && (
                  <div className="text-center mt-4 text-sm text-slate-600">
                    Trang {currentPage} / {Math.ceil(selectedWords.length / itemsPerPage)} • 
                    Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, selectedWords.length)} / {selectedWords.length} từ vựng
              </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Ví dụ ban đầu (chỉ hiển thị khi chưa chọn chủ đề và có categories) */}
        {!selectedCategory && categories.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-500">
              Chọn một chủ đề ở trên để xem danh sách từ vựng
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

