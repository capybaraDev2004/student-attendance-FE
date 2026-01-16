import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { showNotification } from "@/components/notification/NotificationSystem";

type SentenceCategory = {
  id: number;
  name: string;
  sentenceCount: number;
  reviewDays: number;
};

type SentenceItem = {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
};

const SENTENCE_CATEGORY_ICONS: { keywords: string[]; icon: string }[] = [
  { keywords: ["chào hỏi", "greetings", "chào"], icon: "🙋" },
  { keywords: ["giới thiệu bản thân", "self introduction", "giới thiệu"], icon: "👤" },
  { keywords: ["gia đình", "family"], icon: "👨‍👩‍👧‍👦" },
  { keywords: ["màu sắc", "colors", "màu"], icon: "🎨" },
  { keywords: ["số đếm", "numbers", "số"], icon: "🔢" },
  { keywords: ["thời gian", "time", "giờ"], icon: "⏰" },
  { keywords: ["thời tiết", "weather"], icon: "🌤️" },
  { keywords: ["thực phẩm", "food", "đồ ăn", "món ăn"], icon: "🍽️" },
  { keywords: ["mua sắm", "shopping", "mua"], icon: "🛍️" },
  { keywords: ["giao thông", "transportation", "xe", "đi lại"], icon: "🚗" },
  { keywords: ["sức khỏe", "health", "bệnh"], icon: "💊" },
  { keywords: ["học tập", "education", "học", "giáo dục"], icon: "📚" },
  { keywords: ["công việc", "work", "làm việc", "việc"], icon: "💼" },
  { keywords: ["du lịch", "travel", "đi du lịch"], icon: "✈️" },
  { keywords: ["thể thao", "sports", "thể dục"], icon: "⚽" },
  { keywords: ["sở thích", "hobbies"], icon: "🎯" },
  { keywords: ["cảm xúc", "emotions", "cảm giác"], icon: "💚" },
  { keywords: ["địa điểm", "places", "nơi", "chỗ"], icon: "📍" },
  { keywords: ["mua bán", "buying and selling", "bán"], icon: "💰" },
  { keywords: ["điện thoại và internet", "phone and internet", "điện thoại", "internet", "mạng"], icon: "📱" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getSentenceIcon = (name: string) => {
  const lower = name.toLowerCase();
  const match = SENTENCE_CATEGORY_ICONS.find(({ keywords }) =>
    keywords.some((k) => lower.includes(k)),
  );
  return match?.icon ?? "💬";
};

export default function SentenceContent() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken ?? null;
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<SentenceCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSentences, setLoadingSentences] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const itemsPerPage = 4; // 4 hàng, mỗi hàng 2 ô (PC) hoặc 1 ô (mobile)

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) || null,
    [categories, selectedCategoryId],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch("/api/sentences/categories");
        if (!res.ok) return;
        const data = await res.json();
        setCategories(data.categories || []);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId === null) {
      setSentences([]);
      return;
    }

    const fetchSentences = async () => {
      try {
        setLoadingSentences(true);
        const res = await fetch(
          `/api/sentences/by-category/${selectedCategoryId}`,
        );
        if (!res.ok) {
          setSentences([]);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setSentences(data);
        } else {
          setSentences([]);
        }
      } finally {
        setLoadingSentences(false);
      }
    };

    fetchSentences();
  }, [selectedCategoryId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  const handlePlayAudio = async (text: string) => {
    if (!text || playingAudio === text) return;

    try {
      setPlayingAudio(text);
      const response = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
      
      if (!response.ok) {
        throw new Error('Không thể phát âm');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setPlayingAudio(null);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setPlayingAudio(null);
      };

      await audio.play();

      // Tăng số câu nói đã học trong daily_tasks sau khi phát audio thành công
      if (accessToken && typeof window !== "undefined") {
        fetch(`${API_BASE}/daily-tasks/increment-sentence`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            console.log("[SentenceContent] Increment sentence response:", data);
            // Chỉ dispatch event nếu server trả về thành công và có dữ liệu hợp lệ
            if (data && data.sentence_count !== undefined) {
              // Dispatch event để refresh UI với dữ liệu từ server (đảm bảo đúng)
              window.dispatchEvent(new CustomEvent("progress-updated", {
                detail: { 
                  type: "sentence",
                  value: data.sentence_count // Gửi giá trị tuyệt đối từ server
                }
              }));
              
              // Show notification when reaching milestones
              if (data.sentence_count === 5) {
                showNotification({
                  type: "success",
                  title: "Hoàn thành nhiệm vụ! 🎉",
                  message: "Bạn đã học 5 câu nói hôm nay!",
                  duration: 4000,
                });
              }
            }
          } else {
            const errorText = await response.text();
            console.error("[SentenceContent] Failed to increment sentence:", response.status, errorText);
          }
        })
        .catch((error) => {
          console.error("[SentenceContent] Error when incrementing sentence_count:", error);
        });
      } else {
        console.warn("[SentenceContent] Cannot increment sentence: accessToken missing or not in browser");
      }
    } catch (error) {
      console.error('Lỗi khi phát âm:', error);
      setPlayingAudio(null);
    }
  };

  if (!mounted) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 lg:whitespace-nowrap">
            Ghép câu chuẩn cấu trúc
          </h2>
          <p className="text-base lg:text-lg text-slate-600 lg:whitespace-nowrap">
            Bài tập Hanzi theo khung S + V + O, chú trọng trật tự thời gian/địa
            điểm và trợ từ ngữ khí.
          </p>
        <div className="flex items-center justify-center py-12 text-slate-500">
          Đang tải...
        </div>
      </div>
    );
  }

  const paginatedSentences = sentences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages =
    sentences.length > 0 ? Math.ceil(sentences.length / itemsPerPage) : 1;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
      <div className="flex flex-col gap-4 mb-4">
        <h2 className="text-3xl font-bold text-slate-900">Ghép câu chuẩn cấu trúc</h2>
        <p className="text-base text-slate-600">
          Bài tập Hanzi theo khung S + V + O, chú trọng trật tự thời gian/địa điểm và trợ từ ngữ khí.
        </p>
      </div>

      {/* Khi chưa chọn chủ đề: hiển thị danh sách chủ đề câu */}
      {!selectedCategory && (
        <div className="space-y-4">
          {loadingCategories ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              Đang tải chủ đề câu...
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              Chưa có chủ đề câu nào.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {getSentenceIcon(cat.name)}
                    </span>
                    <p className="text-lg font-semibold text-slate-900">
                      {cat.name}
                    </p>
                  </div>
                  <p className="text-base font-semibold text-emerald-700 text-center">
                    {cat.sentenceCount} câu mẫu
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Khi đã chọn chủ đề: hiển thị danh sách câu */}
      {selectedCategory && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm"
              aria-label="Quay lại danh sách chủ đề"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {getSentenceIcon(selectedCategory.name)}
              </span>
              <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 lg:whitespace-nowrap">
                {selectedCategory.name}
              </h3>
                <p className="text-sm text-slate-500">
                  {sentences.length} câu luyện tập
                </p>
              </div>
            </div>
          </div>

          {loadingSentences ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              Đang tải câu mẫu...
            </div>
          ) : sentences.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              Chưa có câu mẫu nào trong chủ đề này.
            </div>
          ) : (
            <>
              {/* Lưới câu: PC 2 ô / hàng, mobile 1 ô / hàng */}
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {paginatedSentences.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handlePlayAudio(s.hanzi)}
                    className="capychina-card rounded-2xl border border-slate-100 bg-slate-50/80 p-4 cursor-pointer transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-500">
                          Câu gốc
                        </p>
                        <p className="mt-1 text-xl font-semibold text-slate-900">
                          {s.hanzi}
                        </p>
                        {s.pinyin && (
                          <p className="mt-1 text-sm text-slate-500">{s.pinyin}</p>
                        )}
                        {s.meaning && (
                          <>
                            <p className="mt-3 text-sm text-slate-500">
                              Nghĩa tiếng Việt
                            </p>
                            <p className="text-base font-semibold text-emerald-700">
                              {s.meaning}
                            </p>
                          </>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(s.hanzi);
                        }}
                        className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-all hover:bg-emerald-200 hover:scale-110 active:scale-95"
                        aria-label="Phát âm"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang giống trang từ vựng, nhưng 2 ô / hàng ở PC */}
              {sentences.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex h-9 w-9 lg:h-8 lg:w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 text-sm lg:text-xs transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 disabled:hover:text-slate-700"
                    aria-label="Trang trước"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true;
                        if (page === 1 || page === totalPages) return true;
                        if (Math.abs(page - currentPage) <= 1) return true;
                        return false;
                      })
                      .map((page, index, array) => {
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showEllipsis && (
                              <span className="px-2 text-slate-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`flex h-9 w-9 lg:h-8 lg:w-8 items-center justify-center rounded-lg border text-sm lg:text-xs transition-all ${
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
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages, prev + 1),
                      )
                    }
                    disabled={currentPage >= totalPages}
                    className="flex h-9 w-9 lg:h-8 lg:w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 text-sm lg:text-xs transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 disabled:hover:text-slate-700"
                    aria-label="Trang sau"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

