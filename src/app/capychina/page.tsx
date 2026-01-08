"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "@/lib/api";
import {
  sidebarItems,
} from "./data";
import ContestContent from "./components/ContestContent";
import LeaderboardContent from "./components/LeaderboardContent";
import PhonicsContent from "./components/PhonicsContent";
import SentenceContent from "./components/SentenceContent";
import SpeakingContent from "./components/SpeakingContent";
import VocabularyContent from "./components/VocabularyContent";
import WritingContent from "./components/WritingContent";

const tipThemes = [
  { wrapper: "bg-emerald-50/80 border-emerald-100", value: "text-emerald-900", subtitle: "text-emerald-700" },
  { wrapper: "bg-sky-50/80 border-sky-100", value: "text-sky-900", subtitle: "text-sky-700" },
  { wrapper: "bg-amber-50/80 border-amber-100", value: "text-amber-900", subtitle: "text-amber-700" },
];

const questThemes = [
  { wrapper: "bg-gradient-to-br from-emerald-50 to-white border-emerald-100", bar: "from-emerald-400 to-emerald-600" },
  { wrapper: "bg-gradient-to-br from-sky-50 to-white border-sky-100", bar: "from-sky-400 to-sky-600" },
  { wrapper: "bg-gradient-to-br from-amber-50 to-white border-amber-100", bar: "from-amber-400 to-amber-600" },
];

const ACTIVE_SECTION_STORAGE_KEY = "capychina-active-section";

export default function CapyChinaEntryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const accessToken = session?.accessToken ?? null;
  const [activeKey, setActiveKey] = useState(sidebarItems[0].key);
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Khởi tạo với giá trị mặc định để tránh hydration mismatch
  const [progressCards, setProgressCards] = useState(() => [
    { title: "Điểm chuyên cần", value: "0 ngày", subtitle: "Làm 1 bài hôm nay để mở streak" },
    { title: "Chuỗi học", value: "0 ngày", subtitle: "Làm 1 bài hôm nay để mở streak" },
  ]);
  const [dailyTasks, setDailyTasks] = useState<{
    vocabulary_count: number;
    sentence_count: number;
    contest_completed: boolean;
  }>(() => ({ vocabulary_count: 0, sentence_count: 0, contest_completed: false }));
  const [activeNews, setActiveNews] = useState<Array<{
    id: number;
    title: string;
    content: string;
    start_date: string;
    end_date: string;
  }>>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobilePanelWidth, setMobilePanelWidth] = useState(0);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const isVip = session?.user?.account_status === "vip";
  const sidebarRef = useRef<HTMLElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch daily tasks từ CSDL
  const fetchDailyTasks = useCallback(async (silent = false) => {
    if (!accessToken) {
      setDailyTasks({ vocabulary_count: 0, sentence_count: 0, contest_completed: false });
      return;
    }
    try {
      const data = await apiFetch<{
        vocabulary_count: number;
        sentence_count: number;
        contest_completed: boolean;
      }>("/daily-tasks/today", {
        method: "GET",
        authToken: accessToken,
      });
      setDailyTasks(data);
    } catch (error) {
      // Silent error - không log để tránh spam console
      // Giữ nguyên giá trị hiện tại nếu có lỗi
      if (!silent && typeof window !== "undefined") {
        // Chỉ log trong development
        if (process.env.NODE_ENV === "development") {
          console.error("Lỗi khi lấy nhiệm vụ hôm nay:", error);
        }
      }
    }
  }, [accessToken]);

  // Optimistic update - cập nhật ngay lập tức trên UI
  const updateDailyTaskOptimistic = useCallback((updates: {
    vocabulary_count?: number;
    sentence_count?: number;
    contest_completed?: boolean;
    type?: string;
    value?: number; // Giá trị tuyệt đối từ server
  }) => {
    setDailyTasks((prev) => {
      const current = prev;
      
      // Nếu có value (giá trị tuyệt đối từ server), dùng nó
      if (updates.type === "vocabulary" && updates.value !== undefined) {
        return {
          ...current,
          vocabulary_count: Math.min(10, Math.max(0, updates.value)),
        };
      }
      if (updates.type === "sentence" && updates.value !== undefined) {
        return {
          ...current,
          sentence_count: Math.min(5, Math.max(0, updates.value)),
        };
      }
      
      // Fallback: cộng thêm (cho backward compatibility)
      return {
        vocabulary_count: updates.vocabulary_count !== undefined 
          ? Math.min(10, Math.max(0, current.vocabulary_count + updates.vocabulary_count))
          : current.vocabulary_count,
        sentence_count: updates.sentence_count !== undefined 
          ? Math.min(5, Math.max(0, current.sentence_count + updates.sentence_count))
          : current.sentence_count,
        contest_completed: updates.contest_completed !== undefined 
          ? updates.contest_completed 
          : current.contest_completed,
      };
    });
  }, []);

  useEffect(() => {
    // Chỉ fetch khi đã có session
    if (session !== undefined) {
      fetchDailyTasks();
    }
    
    // Lắng nghe event để cập nhật realtime
    const handleProgressUpdate = (e: CustomEvent<{
      vocabulary_count?: number;
      sentence_count?: number;
      contest_completed?: boolean;
      type?: string;
      value?: number;
    }>) => {
      const updates = e.detail;
      if (updates) {
        // Optimistic update ngay lập tức (không chờ server)
        updateDailyTaskOptimistic(updates);
        
        // Debounce sync với server (chờ 500ms sau lần cập nhật cuối)
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
        if (accessToken) {
          syncTimeoutRef.current = setTimeout(() => {
            fetchDailyTasks(true).catch(() => {
              // Silent fail - đã có optimistic update
            });
          }, 500);
        }
      } else {
        // Fallback: refresh toàn bộ nếu không có detail
        if (accessToken) {
          fetchDailyTasks(true);
        }
      }
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener("progress-updated", handleProgressUpdate as EventListener);
      return () => {
        window.removeEventListener("progress-updated", handleProgressUpdate as EventListener);
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
    }
  }, [session, accessToken, fetchDailyTasks, updateDailyTaskOptimistic]);

  // Fetch active news
  const fetchActiveNews = useCallback(async () => {
    try {
      const response = await fetch("/api/news/active");
      if (response.ok) {
        const data = await response.json();
        setActiveNews(data.news || []);
      }
    } catch (error) {
      // Silent error - không log để tránh spam console
      console.error("Lỗi khi lấy tin tức:", error);
    }
  }, []);

  // Fetch active news khi component mount
  useEffect(() => {
    fetchActiveNews();
  }, [fetchActiveNews]);

  // Tạo quests từ daily tasks
  const currentQuests = useMemo(() => {
    return [
      { title: "Học 10 từ vựng", progress: dailyTasks.vocabulary_count || 0, total: 10 },
      { title: "Học 5 câu nói", progress: dailyTasks.sentence_count || 0, total: 5 },
      { title: "Làm 1 bài thi", progress: dailyTasks.contest_completed ? 1 : 0, total: 1 },
    ];
  }, [dailyTasks]);
  
  // Hiện scrollbar khi scroll, ẩn sau 1 giây
  useEffect(() => {
    const sidebar = sidebarRef.current;
    const rightPanel = rightPanelRef.current;

    let sidebarTimeout: NodeJS.Timeout | null = null;
    let rightPanelTimeout: NodeJS.Timeout | null = null;

    const handleSidebarScroll = () => {
      if (!sidebar) return;
      sidebar.classList.add("scrolling");
      if (sidebarTimeout) clearTimeout(sidebarTimeout);
      sidebarTimeout = setTimeout(() => {
        sidebar.classList.remove("scrolling");
      }, 1000);
    };

    const handleRightPanelScroll = () => {
      if (!rightPanel) return;
      rightPanel.classList.add("scrolling");
      if (rightPanelTimeout) clearTimeout(rightPanelTimeout);
      rightPanelTimeout = setTimeout(() => {
        rightPanel.classList.remove("scrolling");
      }, 1000);
    };

    if (sidebar) {
      sidebar.addEventListener("scroll", handleSidebarScroll, { passive: true });
    }
    if (rightPanel) {
      rightPanel.addEventListener("scroll", handleRightPanelScroll, { passive: true });
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("scroll", handleSidebarScroll);
        if (sidebarTimeout) clearTimeout(sidebarTimeout);
      }
      if (rightPanel) {
        rightPanel.removeEventListener("scroll", handleRightPanelScroll);
        if (rightPanelTimeout) clearTimeout(rightPanelTimeout);
      }
    };
  }, [isMobileView]);

  const formatDate = useCallback((isoString?: string | null) => {
    if (!isoString) return null;
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }, []);

  // Lấy chuỗi chuyên cần từ bảng chấm điểm cuộc thi - auto refresh mỗi 5 giây
  useEffect(() => {
    if (!accessToken) return;

    const applyStreakToCards = (value: string, subtitle: string) => {
      setProgressCards((prev) => {
        const next = [...prev];
        if (next[0]) next[0] = { ...next[0], value, subtitle };
        if (next[1]) next[1] = { ...next[1], value, subtitle };
        return next;
      });
    };

    const loadAttendance = async () => {
      try {
        const data = await apiFetch<{
          streakDays: number;
          hasToday: boolean;
          lastActiveDate: string | null;
        }>("/contest-progress/streak", {
          authToken: accessToken,
        });

        const streakValue = `${data.streakDays} ngày`;
        const subtitle =
          data.streakDays > 0 && data.lastActiveDate
            ? `Liên tục đến ${formatDate(data.lastActiveDate) ?? "gần nhất"}`
            : "Làm 1 bài hôm nay để mở streak";

        applyStreakToCards(streakValue, subtitle);
      } catch (error) {
        // Silent error - chỉ log trong development
        if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
          console.error("Không tải được chuỗi chuyên cần:", error);
        }
        // Giữ nguyên giá trị hiện tại hoặc set default
        applyStreakToCards("0 ngày", "Làm 1 bài hôm nay để mở streak");
      }
    };

    // Load ngay lập tức
    loadAttendance();

    // Auto refresh mỗi 5 giây
    const interval = setInterval(loadAttendance, 5000);

    // Lắng nghe event từ ContestContent khi finish bài thi
    const handleProgressUpdate = () => {
      loadAttendance();
    };
    window.addEventListener("progress-updated", handleProgressUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("progress-updated", handleProgressUpdate);
    };
  }, [accessToken, formatDate]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const mobile = window.innerWidth <= 1026;
      setIsMobileView(mobile);
      // Tablet (iPad Pro) có thể dùng panel rộng hơn mobile
      const computedWidth = window.innerWidth <= 1026 
        ? Math.min(window.innerWidth * 0.85, 400)
        : 0;
      setMobilePanelWidth(computedWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileView) {
      setIsLeftPanelOpen(true);
      setIsRightPanelOpen(true);
    } else {
      setIsLeftPanelOpen(false);
      setIsRightPanelOpen(false);
    }
  }, [isMobileView]);

  const toggleLeftPanel = () => {
    if (!isMobileView) return;
    setIsLeftPanelOpen((prev) => !prev);
    if (isRightPanelOpen) {
      setIsRightPanelOpen(false);
    }
  };

  const toggleRightPanel = () => {
    if (!isMobileView) return;
    setIsRightPanelOpen((prev) => !prev);
    if (isLeftPanelOpen) {
      setIsLeftPanelOpen(false);
    }
  };

  const closePanels = () => {
    setIsLeftPanelOpen(false);
    setIsRightPanelOpen(false);
  };

  const showMobileOverlay = isMobileView && (isLeftPanelOpen || isRightPanelOpen);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedKey = window.localStorage.getItem(ACTIVE_SECTION_STORAGE_KEY);
    if (storedKey && sidebarItems.some((item) => item.key === storedKey)) {
      // Kiểm tra nếu mục đã lưu bị khóa (chỉ dành cho VIP)
      const isLocked = !isVip && (storedKey === "speaking" || storedKey === "writing");
      if (isLocked) {
        // Reset về mục đầu tiên không bị khóa
        const firstUnlocked = sidebarItems.find(
          (item) => item.key !== "speaking" && item.key !== "writing"
        );
        if (firstUnlocked) {
          setActiveKey(firstUnlocked.key);
        }
      } else {
        setActiveKey(storedKey);
      }
    }
  }, [isVip]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACTIVE_SECTION_STORAGE_KEY, activeKey);
  }, [activeKey]);

  // Kiểm tra khi refresh token hết hạn (sau 7 ngày)
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      setShowLoginModal(true);
    }
  }, [session?.error]);

  const speakPinyin = useCallback(async (text: string) => {
    if (typeof window === "undefined" || !text) return;
    
    try {
      // Sử dụng API route trực tiếp để phát audio
      // Tạo URL với timestamp để tránh cache issues
      const apiUrl = `/api/tts?text=${encodeURIComponent(text)}&t=${Date.now()}`;
      
      // Tạo Audio element với URL trực tiếp
      const audio = new Audio(apiUrl);
      
      // Đặt preload để load audio trước
      audio.preload = "auto";
      
      // Xử lý lỗi phát audio
      audio.onerror = (e) => {
        console.error("Lỗi phát audio:", e, audio.error);
      };

      // Phát audio và đợi cho đến khi phát xong
      await audio.play();
      
      // Trả về promise để có thể await
      return new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve(); // Resolve ngay cả khi có lỗi để không block
      });
    } catch (error) {
      console.error("Lỗi phát âm:", error);
      // Không throw error để không làm gián đoạn UI
    }
  }, []);

  const renderContent = () => {
    // Kiểm tra nếu user cố truy cập vào chức năng bị khóa
    if (!isVip && (activeKey === "speaking" || activeKey === "writing")) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-10 w-10 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Tính năng này chỉ dành cho tài khoản VIP
            </h2>
            <p className="mb-6 text-slate-600">
              Nâng cấp lên VIP để sử dụng đầy đủ các tính năng học tập nâng cao.
            </p>
            <button
              onClick={() => {
                // Reset về mục đầu tiên không bị khóa
                const firstUnlocked = sidebarItems.find(
                  (item) => item.key !== "speaking" && item.key !== "writing"
                );
                if (firstUnlocked) {
                  setActiveKey(firstUnlocked.key);
                }
              }}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }

    switch (activeKey) {
      case "phonics":
        return <PhonicsContent speakPinyin={speakPinyin} />;
      case "vocabulary":
        return (
          <VocabularyContent
            speakPinyin={speakPinyin}
            authToken={accessToken}
          />
        );
      case "sentence":
        return <SentenceContent />;
      case "speaking":
        return <SpeakingContent />;
      case "writing":
        return <WritingContent />;
      case "contest":
        return <ContestContent />;
      case "leaderboard":
        return <LeaderboardContent />;
      default:
        return null;
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <main className="min-h-screen w-full bg-white px-4 py-6 text-left lg:px-12">
      {/* Popup thông báo hết hạn đăng nhập */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <svg
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Phiên đăng nhập đã hết hạn
              </h2>
              <p className="mb-6 text-slate-600">
                Phiên đăng nhập của bạn đã hết hạn sau 7 ngày. Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.
              </p>
              <button
                onClick={handleGoToLogin}
                className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
        {/* Top bar */}
        <div className="rounded-3xl border border-white/60 bg-white/90 p-4 sm:p-6 shadow-xl shadow-slate-200/60 backdrop-blur overflow-hidden">
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-start gap-2 sm:gap-3 min-w-0 w-full">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-xl sm:text-2xl font-bold text-white shadow-lg flex-shrink-0">
                中
              </div>
              <div className="flex flex-col gap-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent break-words">
                    CapyChina
                  </span>
                  {isVip && (
                    <span className="vip-badge relative inline-flex items-center gap-1 rounded-full border border-amber-200 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-50 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-700 shadow-sm flex-shrink-0">
                      <span className="vip-star text-xs sm:text-base text-amber-500">★</span>
                      VIP
                    </span>
                  )}
                </div>
                {/* Nút nâng cấp VIP - chỉ hiển thị với tài khoản normal */}
                {!isVip && session?.user && (
                  <button
                    className="self-start px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5 text-xs sm:text-sm"
                    onClick={() => {
                      // TODO: Xử lý nâng cấp VIP
                      alert("Tính năng nâng cấp VIP đang được phát triển");
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    Nâng cấp VIP
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col flex-1 items-center text-center px-2 min-w-0 w-full">
              <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm lg:text-base break-words">
                Tiếng Trung toàn diện
              </p>
              <p className="text-lg sm:text-xl lg:text-3xl font-bold text-slate-900 mt-2 px-2 sm:px-4 break-words w-full" style={{ textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
                Nghe – nói – đọc – viết
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 mt-2 px-2 sm:px-4 break-words w-full">
                Phù hợp người mới bắt đầu: phát âm, từ vựng, ghép câu, kỹ năng giao tiếp ứng dụng ngay.
              </p>
            </div>

            <div className="flex flex-1 justify-center lg:justify-end w-full mt-4 lg:mt-0">
              <Link
                href="/"
                className="btn btn-outline btn-sm rounded-2xl border-emerald-500/70 font-semibold text-emerald-700 text-xs sm:text-sm whitespace-nowrap"
              >
                ↩ Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className={`relative grid gap-6 items-start ${isMobileView ? '' : 'lg:grid-cols-[260px_1fr_320px]'}`}>
          {showMobileOverlay && (
            <div
              className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[1px]"
              onClick={closePanels}
            />
          )}

          {isMobileView && (
            <>
              {/* Nút mở panel trái - ẩn khi panel phải đang mở */}
              {!isRightPanelOpen && (
                <button
                  type="button"
                  onClick={toggleLeftPanel}
                  className="fixed top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-600 shadow-md transition-all"
                  style={{ left: isLeftPanelOpen ? `${mobilePanelWidth + 16}px` : "8px" }}
                  aria-label={isLeftPanelOpen ? "Ẩn trạm điều hướng" : "Mở trạm điều hướng"}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`transition-transform ${isLeftPanelOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              {/* Nút mở panel phải - ẩn khi panel trái đang mở */}
              {!isLeftPanelOpen && (
                <button
                  type="button"
                  onClick={toggleRightPanel}
                  className="fixed top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-600 shadow-md transition-all"
                  style={{ right: isRightPanelOpen ? `${mobilePanelWidth + 16}px` : "8px" }}
                  aria-label={isRightPanelOpen ? "Ẩn bảng thông tin" : "Mở bảng thông tin"}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`transition-transform ${isRightPanelOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </>
          )}

          <aside 
            ref={sidebarRef}
            className={[
              "rounded-3xl border border-slate-200 bg-white/90 px-4 py-6 shadow-lg shadow-slate-200/70 auto-hide-scrollbar transition-all duration-300",
              isMobileView
                ? `fixed z-40 top-20 left-4 max-h-[75vh] overflow-y-auto overflow-x-visible ${isLeftPanelOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-6 pointer-events-none"}`
                : "lg:sticky lg:top-5 lg:max-h-[calc(100vh-40px)] lg:overflow-y-auto lg:overflow-x-visible"
            ].join(" ")}
            style={isMobileView ? { width: `${mobilePanelWidth}px` } : undefined}
          >
            <div className="mb-4">
              <p className="text-sm lg:text-base font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Trạm điều hướng
              </p>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Khu vực học tập</h2>
              <p className="text-base lg:text-lg text-slate-500">Chạm để mở nội dung tương ứng ở giữa trang.</p>
            </div>
            <div className="space-y-3">
              {sidebarItems.map((item) => {
                const isActive = item.key === activeKey;
                // Khóa "Bài tập nói" và "Bài tập viết" cho tài khoản normal
                const isLocked = !isVip && (item.key === "speaking" || item.key === "writing");
                
                return (
                  <div key={item.label} className="relative group overflow-visible">
                    <button
                      onClick={() => {
                        if (!isLocked) {
                          setActiveKey(item.key);
                        }
                      }}
                      disabled={isLocked}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isLocked
                          ? "border-slate-200 bg-slate-100/50 opacity-60 cursor-not-allowed"
                          : isActive
                          ? "border-emerald-300 bg-emerald-50 hover:-translate-y-0.5"
                          : "border-slate-100 bg-slate-50/70 hover:border-emerald-200 hover:bg-white hover:-translate-y-0.5"
                      }`}
                    >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <p className={`text-lg lg:text-xl font-semibold ${
                          isLocked ? "text-slate-500" : "text-slate-900"
                        }`}>
                          {item.label}
                        </p>
                        {isLocked && (
                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        )}
                      </div>
                      {isActive && !isLocked && <div className="h-2 w-2 rounded-full bg-emerald-400" />}
                    </div>
                    <p className={`mt-2 text-base lg:text-lg ${
                      isLocked ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {item.description}
                    </p>
                  </button>
                  {isLocked && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 px-3.5 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 transition-all duration-200 ease-out pointer-events-none z-[100] shadow-2xl max-w-[220px] min-w-[180px] text-center backdrop-blur-sm border border-slate-700/50">
                      <span className="block leading-snug break-words">
                        Hãy nâng cấp lên tài khoản VIP để sử dụng chức năng
                      </span>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-px w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-slate-800"></div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </aside>

          <section className={`space-y-6 min-w-0 relative z-10 ${isMobileView ? 'w-full' : ''}`}>
            {renderContent()}
          </section>

          <div 
            ref={rightPanelRef}
            className={[
              "space-y-6 auto-hide-scrollbar transition-all duration-300",
              isMobileView
                ? `fixed z-40 top-20 right-4 max-h-[75vh] overflow-y-auto ${isRightPanelOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-6 pointer-events-none"}`
                : "lg:sticky lg:top-5 lg:max-h-[calc(100vh-40px)] lg:overflow-y-auto"
            ].join(" ")}
            style={isMobileView ? { width: `${mobilePanelWidth}px` } : undefined}
          >
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-white p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900">Tiến độ cá nhân</h3>
              <div className="mt-4 space-y-4">
                {progressCards.map((tip, index) => {
                  const theme = tipThemes[index % tipThemes.length];
                  return (
                  <div
                      key={tip.title}
                      className={`rounded-2xl border p-4 ${theme.wrapper}`}
                  >
                    <p className="text-sm font-semibold text-slate-500">{tip.title}</p>
                      <p className={`text-2xl font-bold ${theme.value}`}>{tip.value}</p>
                      <p className={`text-sm ${theme.subtitle}`}>{tip.subtitle}</p>
                  </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-white p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900">Nhiệm vụ hôm nay</h3>
              <p className="mt-2 text-sm text-sky-700 font-medium">
                Hãy hoàn thành nhiệm vụ hôm nay để nhận 10 điểm
              </p>
              <div className="mt-4 space-y-4">
                {currentQuests.map((quest, index) => {
                  const percent = Math.min(100, Math.round((quest.progress / quest.total) * 100));
                  const isCompleted = quest.progress >= quest.total;
                  const theme = questThemes[index % questThemes.length];
                  return (
                    <div
                      key={quest.title}
                      className={`rounded-2xl border p-4 ${theme.wrapper} ${isCompleted ? 'ring-2 ring-emerald-300' : ''}`}
                    >
                      <div className="flex items-center justify-between text-sm text-slate-800">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">{quest.title}</p>
                          {isCompleted && (
                            <span className="px-2 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full">
                              ✓ Hoàn thành
                            </span>
                          )}
                        </div>
                        <p className={`font-semibold ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {quest.progress}/{quest.total}
                        </p>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${theme.bar} ${isCompleted ? 'opacity-100' : ''}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tin tức */}
            {activeNews.length > 0 && (
              <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-white p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎆</span>
                  <h3 className="text-lg font-semibold text-purple-900">Tin tức</h3>
                </div>
                <div className="space-y-3">
                  {activeNews.map((news) => (
                    <div
                      key={news.id}
                      className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-purple-900 mb-2">{news.title}</h4>
                      <p className="text-sm text-purple-700 whitespace-pre-line">{news.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-amber-100 bg-amber-50/80 p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900">Lời nhắc thân thiện</h3>
              <p className="mt-2 text-sm text-amber-800">
                Đừng quá cầu toàn trong lần luyện đầu. Quan trọng nhất là giữ nhịp học liên tục và ghi nhận sai
                khác khi so sánh với mẫu.
              </p>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-4 text-sm text-amber-900">
                💡 Mẹo: Luyện thanh điệu trước gương để thấy khẩu hình và đường đi của giọng nói.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

