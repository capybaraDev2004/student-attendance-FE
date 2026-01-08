"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export default function WritingContent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [autoRecognize, setAutoRecognize] = useState(true); // Mặc định bật tự động
  const [suggestedCharacters, setSuggestedCharacters] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [pinyin, setPinyin] = useState<string | null>(null);
  const [meaning, setMeaning] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Khởi tạo canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Hàm resize canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      
      // Set size
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Cài đặt context
      ctx.strokeStyle = "#10b981"; // Emerald color
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resizeCanvas();
    
    // Resize khi window thay đổi
    window.addEventListener("resize", resizeCanvas);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
    };
  }, []);

  // Nhận dạng tự động
  const recognizeCharacter = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Kiểm tra canvas có vẽ gì chưa
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some((pixel, index) => {
      if ((index + 1) % 4 === 0) return false; // Bỏ qua alpha channel
      return pixel < 255;
    });

    if (!hasContent) {
      setSuggestedCharacters([]);
      setSelectedCharacter(null);
      setPinyin(null);
      setMeaning(null);
      return;
    }

    setIsRecognizing(true);
    setError(null);
    setSuggestedCharacters([]);
    setSelectedCharacter(null);
    setPinyin(null);
    setMeaning(null);

    try {
      // Chuyển canvas thành base64
      const dataUrl = canvas.toDataURL("image/png");

      const response = await fetch("/api/recognize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Xử lý lỗi rate limit (429)
        if (response.status === 429) {
          // API đã xử lý đầy đủ error message và retry time, chỉ cần sử dụng trực tiếp
          const errorMessage = errorData.error || "Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.";
          throw new Error(errorMessage);
        }
        
        throw new Error(errorData.error || "Không thể nhận dạng chữ. Vui lòng thử lại.");
      }

      const data = await response.json();
      const characters = data.characters || [];
      
      if (characters.length > 0) {
        setSuggestedCharacters(characters);
      } else {
        setError("Không nhận dạng được chữ Hán. Vui lòng vẽ lại rõ ràng hơn.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Recognition error:", error);
      setError(error.message || "Có lỗi xảy ra khi nhận dạng. Vui lòng thử lại.");
    } finally {
      setIsRecognizing(false);
    }
  }, []);

  // Lấy thông tin về chữ Hán đã chọn
  const fetchCharacterInfo = useCallback(async (character: string) => {
    setIsLoadingInfo(true);
    setError(null);

    try {
      const response = await fetch("/api/character-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ character }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể lấy thông tin.");
      }

      const data = await response.json();
      setPinyin(data.pinyin && data.pinyin !== "-" ? data.pinyin : null);
      setMeaning(data.meaning && data.meaning !== "-" ? data.meaning : null);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Character info error:", error);
      setError(error.message || "Có lỗi xảy ra khi lấy thông tin.");
    } finally {
      setIsLoadingInfo(false);
    }
  }, []);

  // Xử lý chọn chữ Hán
  const handleSelectCharacter = (e: React.MouseEvent<HTMLButtonElement>, character: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Hủy timeout nhận dạng nếu đang chờ (tránh nhận dạng lại)
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
      recognitionTimeoutRef.current = null;
    }

    setSelectedCharacter(character);
    fetchCharacterInfo(character);
  };

  // Bắt đầu vẽ
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Hủy timeout nhận dạng nếu đang chờ
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
      recognitionTimeoutRef.current = null;
    }

    setIsDrawing(true);
    setSuggestedCharacters([]);
    setSelectedCharacter(null);
    setPinyin(null);
    setMeaning(null);
    setError(null);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Vẽ
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Dừng vẽ - tự động nhận dạng sau 1.5 giây (nếu bật tự động)
  const stopDrawing = () => {
    // Chỉ nhận dạng nếu đang thực sự vẽ (không phải click vào button)
    if (!isDrawing) return;
    
    setIsDrawing(false);

    // Chỉ tự động nhận dạng nếu đã bật chế độ tự động
    if (!autoRecognize) {
      return;
    }

    // Chỉ nhận dạng nếu chưa có từ gợi ý (tránh nhận dạng lại khi đã có kết quả)
    if (suggestedCharacters.length > 0) {
      return;
    }

    // Hủy timeout cũ nếu có
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }

    // Tự động nhận dạng sau 1.5 giây
    recognitionTimeoutRef.current = setTimeout(() => {
      recognizeCharacter();
    }, 1500);
  };

  // Xóa canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Hủy timeout nhận dạng
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
      recognitionTimeoutRef.current = null;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSuggestedCharacters([]);
    setSelectedCharacter(null);
    setPinyin(null);
    setMeaning(null);
    setError(null);
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Bài tập viết chữ Hán</h2>
      <p className="text-base text-slate-600">
          Vẽ chữ Hán trên canvas. {autoRecognize 
            ? "Hệ thống sẽ tự động nhận dạng khi bạn ngừng vẽ." 
            : "Nhấn nút 'Nhận dạng' để nhận dạng chữ."
          }
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Canvas vẽ */}
        <div className="space-y-4">
          <div className="relative bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-300 p-4">
            {isRecognizing && (
              <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <svg className="animate-spin h-8 w-8 text-emerald-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm text-emerald-700 font-semibold">Đang nhận dạng...</p>
                </div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="w-full h-[400px] bg-white rounded-xl cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: "none" }}
            />
          </div>

          {/* Nút điều khiển */}
          <div className="space-y-3">
            {/* Toggle chế độ tự động */}
            <div className="flex items-center justify-between bg-slate-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Tự động nhận dạng:</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  autoRecognize 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {autoRecognize ? "Bật" : "Tắt"}
                </span>
              </div>
              <button
                onClick={() => {
                  setAutoRecognize(!autoRecognize);
                  // Hủy timeout nếu đang chờ nhận dạng
                  if (recognitionTimeoutRef.current) {
                    clearTimeout(recognitionTimeoutRef.current);
                    recognitionTimeoutRef.current = null;
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  autoRecognize ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRecognize ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Nút điều khiển */}
            <div className="flex gap-3">
              <button
                onClick={clearCanvas}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
              >
                🗑️ Xóa
              </button>
              {!autoRecognize && (
                <button
                  onClick={() => {
                    // Hủy timeout nếu có
                    if (recognitionTimeoutRef.current) {
                      clearTimeout(recognitionTimeoutRef.current);
                      recognitionTimeoutRef.current = null;
                    }
                    recognizeCharacter();
                  }}
                  disabled={isRecognizing}
                  className="flex-1 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRecognizing ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang nhận dạng...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Nhận dạng</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Hướng dẫn */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-800">
              <span className="font-semibold">💡 Mẹo:</span>{" "}
              {autoRecognize 
                ? "Vẽ chữ Hán rõ ràng, đủ nét. Hệ thống sẽ tự động nhận dạng sau khi bạn ngừng vẽ 1.5 giây."
                : "Vẽ chữ Hán rõ ràng, đủ nét. Nhấn nút 'Nhận dạng' khi bạn muốn nhận dạng chữ."
              }
            </p>
          </div>
        </div>

        {/* Kết quả nhận dạng */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-6">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Kết quả nhận dạng</h3>
            
            {/* Danh sách từ gợi ý */}
            {suggestedCharacters.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-emerald-700 mb-3">
                  Các chữ Hán có thể (chọn một chữ để xem chi tiết):
                </p>
                <div className="flex flex-wrap gap-3">
                  {suggestedCharacters.map((char, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => handleSelectCharacter(e, char)}
                      onMouseDown={(e) => e.preventDefault()} // Prevent mousedown from triggering canvas
                      className={`px-6 py-4 bg-white rounded-xl border-2 text-4xl font-bold transition-all hover:scale-105 ${
                        selectedCharacter === char
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
                          : "border-emerald-300 text-slate-900 hover:border-emerald-400 hover:bg-emerald-50"
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thông tin chi tiết về chữ đã chọn */}
            {selectedCharacter && (
              <div className="mb-4 space-y-4">
                {isLoadingInfo ? (
                  <div className="bg-white rounded-xl p-6 border-2 border-emerald-300 text-center">
                    <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm text-slate-500">Đang tải thông tin...</p>
                  </div>
                ) : (
                  <>
                    {/* Chữ Hán */}
                    <div>
                      <p className="text-sm font-semibold text-emerald-700 mb-2">Chữ Hán đã chọn:</p>
                      <div className="bg-white rounded-xl p-6 border-2 border-emerald-300 text-center">
                        <p className="text-7xl font-bold text-slate-900">{selectedCharacter}</p>
                      </div>
                    </div>

                    {/* Pinyin */}
                    {pinyin && (
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 mb-2">Pinyin (Phiên âm):</p>
                        <div className="bg-white rounded-xl p-4 border-2 border-emerald-300 text-center">
                          <p className="text-3xl font-semibold text-emerald-600">{pinyin}</p>
                        </div>
                      </div>
                    )}

                    {/* Nghĩa */}
                    {meaning && (
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 mb-2">Nghĩa tiếng Việt:</p>
                        <div className="bg-white rounded-xl p-4 border-2 border-emerald-300 text-center">
                          <p className="text-xl font-semibold text-slate-800">{meaning}</p>
                        </div>
                      </div>
                    )}

                    {!pinyin && !meaning && !isLoadingInfo && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                          Không tìm thấy thông tin về chữ này.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <p className="text-sm text-rose-800">{error}</p>
              </div>
            )}

            {!suggestedCharacters.length && !selectedCharacter && !error && !isRecognizing && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                <p className="text-slate-500">Vẽ chữ Hán trên canvas để xem kết quả nhận dạng</p>
              </div>
            )}

            {/* Hướng dẫn sử dụng */}
            <div className="mt-6 space-y-2">
              <p className="text-sm font-semibold text-emerald-900">Cách sử dụng:</p>
              <div className="space-y-1 text-sm text-emerald-700">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-900 flex-shrink-0">1.</span>
                  <span className="text-justify">Vẽ một chữ Hán trên canvas</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-900 flex-shrink-0">2.</span>
                  <span className="text-justify">
                    {autoRecognize 
                      ? "Ngừng vẽ - tự động nhận dạng sau 1.5 giây"
                      : "Nhấn nút 'Nhận dạng' để nhận dạng chữ"
                    }
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-900 flex-shrink-0">3.</span>
                  <span className="text-justify">Chọn một chữ từ danh sách gợi ý</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-900 flex-shrink-0">4.</span>
                  <span className="text-justify">Xem thông tin chi tiết (Pinyin và nghĩa)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mẫu chữ để tham khảo */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">💡 Chữ mẫu để thử:</p>
            <div className="flex gap-3 flex-wrap">
              {["人", "好", "学", "我", "你", "他", "是", "的", "了", "一"].map((char) => (
                <button
                  key={char}
                  onClick={() => {
                    clearCanvas();
                    // Gợi ý người dùng vẽ chữ này
                    alert(`Hãy thử vẽ chữ "${char}" trên canvas!`);
                  }}
                  className="w-12 h-12 bg-white border-2 border-emerald-300 rounded-lg text-2xl font-bold text-slate-900 hover:bg-emerald-50 hover:border-emerald-500 transition-colors"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
