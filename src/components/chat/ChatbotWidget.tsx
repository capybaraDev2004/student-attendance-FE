/* Chatbot Gemini cho CapyChina
 * Icon tròn ở góc dưới bên phải, click mở/đóng khung chat
 */

"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [activeNews, setActiveNews] = useState<Array<{
    id: number;
    title: string;
    content: string;
    start_date: string;
    end_date: string;
  }>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const newsContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll xuống cuối khi có tin nhắn mới hoặc khi đang loading
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Fetch active news
  useEffect(() => {
    const fetchActiveNews = async () => {
      try {
        const response = await fetch("/api/news/active");
        if (response.ok) {
          const data = await response.json();
          setActiveNews(data.news || []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tin tức:", error);
      }
    };
    fetchActiveNews();
  }, []);

  // Đóng popup khi click ra ngoài trên mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Không tự đóng khi click vào icon
        const target = event.target as HTMLElement;
        if (target.closest("[data-capy-chatbot-trigger]")) return;
        // Có thể tắt auto close nếu không muốn
        // setIsOpen(false);
      }
      if (
        showNews &&
        newsContainerRef.current &&
        !newsContainerRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (target.closest("[data-news-trigger]")) return;
        setShowNews(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showNews]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setShowNews(false);
    }
  };

  const handleToggleNews = () => {
    setShowNews((prev) => !prev);
    if (showNews) {
      setIsOpen(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const newUserMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyForApi,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Chatbot error:", errorText);
        const errorMsg: Message = {
          id: `${Date.now()}-err`,
          role: "assistant",
          content:
            "Xin lỗi, chatbot đang gặp lỗi kết nối. Bạn thử lại sau một chút nhé.",
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const data = (await res.json()) as { reply?: string; error?: string };

      const replyText =
        data.reply ??
        data.error ??
        "Xin lỗi, mình chưa nhận được phản hồi. Bạn thử hỏi lại giúp mình nhé.";

      const botMessage: Message = {
        id: `${Date.now()}-bot`,
        role: "assistant",
        content: replyText,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot fetch error:", error);
      const errorMsg: Message = {
        id: `${Date.now()}-err2`,
        role: "assistant",
        content:
          "Có lỗi mạng khi gửi tin nhắn. Vui lòng kiểm tra kết nối và thử lại.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Khung tin tức */}
      <div
        ref={newsContainerRef}
        className="fixed bottom-20 right-4 z-50 flex flex-col max-h-[calc(100vh-5rem)]"
      >
        {showNews && (
          <div className="w-[400px] max-w-[85vw] max-h-[calc(100vh-5rem)] rounded-2xl border border-purple-200 bg-white shadow-xl shadow-purple-200/40 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎆</span>
                <div>
                  <p className="text-sm font-semibold">Tin tức</p>
                  <p className="text-[11px] text-purple-100">
                    Cập nhật mới nhất từ CapyChina
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleNews}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-600/80 text-xs hover:bg-purple-700"
                aria-label="Đóng tin tức"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-purple-50/40 min-h-0">
              {activeNews.length === 0 ? (
                <div className="rounded-lg bg-white/80 p-4 text-sm text-slate-600 text-center">
                  <p className="text-slate-500">Hiện tại chưa có tin tức nào.</p>
                </div>
              ) : (
                activeNews.map((news) => (
                  <div
                    key={news.id}
                    className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-purple-900 mb-2">{news.title}</h4>
                    <p className="text-sm text-purple-700 whitespace-pre-line">{news.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Khung chat */}
      <div
        ref={containerRef}
        className="fixed bottom-20 right-4 z-50 flex flex-col max-h-[calc(100vh-5rem)]"
      >
        {isOpen && (
          <div className="w-[400px] max-w-[85vw] h-[520px] max-h-[calc(100vh-5rem)] rounded-2xl border border-emerald-200 bg-white shadow-xl shadow-emerald-200/40 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between bg-emerald-500 px-3 py-2 text-white">
              <div>
                <p className="text-sm font-semibold">CapyChat AI</p>
                <p className="text-[11px] text-emerald-100">
                  Hỏi nhanh về lộ trình, từ vựng, cách học tiếng Trung
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggle}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/80 text-xs hover:bg-emerald-700"
                aria-label="Đóng chatbot"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-emerald-50/40 min-h-0">
              {messages.length === 0 && (
                <div className="rounded-lg bg-white/80 p-3 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">
                    Xin chào 👋
                  </p>
                  <p className="mb-2">
                    Mình là CapyChat AI - trợ lý chuyên về học tiếng Trung. Mình có thể giúp bạn:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Học Pinyin, Hanzi, từ vựng tiếng Trung</li>
                    <li>Dịch giữa tiếng Trung và tiếng Việt</li>
                    <li>Giải thích ngữ pháp và cách dùng từ</li>
                    <li>Gợi ý phương pháp học hiệu quả</li>
                  </ul>
                  <p className="mt-2 text-xs text-slate-500 italic">
                    💡 Mình chỉ trả lời các câu hỏi liên quan đến tiếng Trung và tiếng Việt thôi nhé!
                  </p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-emerald-500 text-white rounded-br-sm"
                        : "bg-white text-slate-800 border border-emerald-100 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-white border border-emerald-100 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                      <span className="text-sm text-slate-500 italic">Đang soạn trả lời...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-emerald-100 bg-white px-3 py-2">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full resize-none rounded-lg border border-emerald-200 bg-emerald-50/40 px-[14px] py-[8px] text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
                placeholder="Nhập câu hỏi của bạn... (Enter để gửi, Shift+Enter xuống dòng)"
              />
              <div className="mt-1 flex items-center justify-between">
                <p className="text-[10px] text-slate-400">
                  Chatbot dùng AI để gợi ý, có thể đôi lúc chưa chính xác 100%.
                </p>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:opacity-50 transition-colors"
                  style={{ fontSize: '16px' }}
                  aria-label="Gửi tin nhắn"
                >
                  <span>Gửi</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Icon loa tin tức - luôn hiển thị trên nút chat */}
      <button
        type="button"
        data-news-trigger
        onClick={handleToggleNews}
        className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-300 hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all"
        aria-label={showNews ? "Đóng tin tức" : "Mở tin tức"}
      >
        <span className="relative inline-flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-400 border border-white animate-pulse" />
        </span>
      </button>

      {/* Icon bật/tắt chatbot */}
      <button
        type="button"
        data-capy-chatbot-trigger
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-300 hover:bg-emerald-600 active:scale-95"
        aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot"}
      >
        <span className="relative inline-flex items-center justify-center">
          <span className="text-xl">💬</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-400 border border-white animate-pulse" />
        </span>
      </button>
    </>
  );
}


