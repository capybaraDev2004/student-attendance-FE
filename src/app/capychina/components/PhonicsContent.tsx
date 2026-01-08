"use client";

import { useState, useRef, useEffect } from "react";
import {
  finalsByVowel,
  simpleVowels,
  compoundVowels,
  listeningPractice,
  initialsTable,
  bilabialLabiodental,
  alveolar,
  dentalSibilant,
  palatal,
  velar,
  retroflex,
  tones,
} from "../data";

type PhonicsContentProps = {
  speakPinyin: (text: string) => void;
};

// Custom Audio Player Component - Full version với controls
function AudioPlayerFull({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 shadow-md">
        {/* Play Button với icon mũi tên */}
        <button
          onClick={togglePlay}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50 transition-all hover:scale-110 hover:shadow-xl hover:shadow-emerald-300/50 active:scale-95"
          aria-label={isPlaying ? "Tạm dừng" : "Phát"}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Time Display */}
        <div className="flex min-w-[80px] items-center text-sm font-semibold text-emerald-700">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const audio = audioRef.current;
              if (audio) {
                audio.muted = !audio.muted;
                setIsMuted(audio.muted);
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-100"
            aria-label={isMuted ? "Bật âm lượng" : "Tắt âm lượng"}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple Audio Button - Chỉ có nút play (cho thanh điệu)
function SimpleAudioButton({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  return (
    <div className="flex justify-center">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={togglePlay}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50 transition-all hover:scale-110 hover:shadow-xl hover:shadow-emerald-300/50 active:scale-95"
        aria-label={isPlaying ? "Tạm dừng" : "Phát"}
      >
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function PhonicsContent({ speakPinyin }: PhonicsContentProps) {
  return (
    <>
      {/* Header */}
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="premium-heading">
            Khóa học Pinyin nền tảng
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2" style={{ textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>Bảng chữ cái tiếng Trung (Pinyin)</h1>
          <p className="text-lg lg:text-xl text-slate-600 mt-2">
            Pinyin là bảng chữ cái Latinh dành cho việc học phát âm tiếng Trung, gồm thanh mẫu (phụ âm), vận mẫu (nguyên âm) và thanh điệu.
          </p>
        </div>
        </div>

      {/* Bảng 1: VẬN MẪU LÀ GÌ? - Bảng phiên âm tiếng Trung */}
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">1. VẬN MẪU LÀ GÌ?</h2>
        <p className="mb-4 text-base lg:text-lg text-slate-600">
          Vận mẫu có thể hiểu là phụ âm vần của một âm tiết tiếng Trung. Vận mẫu được coi là thành phần cơ bản của một âm tiết tiếng Trung. Vì một âm tiết có thể thiếu Thanh mẫu hoặc Thanh điệu nhưng không thể thiếu Vận mẫu. Tổng cộng có 36 vận mẫu.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50">
                {Object.keys(finalsByVowel).map((vowel) => (
                  <th key={vowel} className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-900">
                    {vowel.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(finalsByVowel).map((finals, colIndex) => (
                  <td key={colIndex} className="border border-slate-200 p-3">
                    <div className="flex flex-wrap gap-2">
                      {finals.map((pinyin) => (
                        <span
                          key={pinyin}
                          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-base lg:text-lg font-semibold text-emerald-700"
                        >
                          {pinyin}
                        </span>
                      ))}
            </div>
                  </td>
          ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bảng 2: PHÂN LOẠI VẬN MẪU */}
        <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">2. PHÂN LOẠI VẬN MẪU</h2>
        <p className="mb-4 text-base lg:text-lg text-slate-600">
          Vận Mẫu (Phụ âm vẫn) được chia thành 4 nhóm là: 6 nguyên âm đơn + 13 nguyên âm kép + 16 nguyên âm mũi + 1 âm uốn lưỡi
        </p>

        {/* Nguyên âm đơn */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Nguyên âm đơn</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Nguyên âm</th>
                  <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Cách phát âm (so sánh với tiếng Việt)</th>
                </tr>
              </thead>
              <tbody>
                {simpleVowels.map((vowel) => (
                  <tr key={vowel.pinyin}>
                    <td className="border border-slate-200 px-4 py-3">
                    <button
                      type="button"
                        onClick={() => speakPinyin(vowel.pinyin)}
                        className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-base font-semibold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                        <span>🔊</span>
                        {vowel.pinyin}
                    </button>
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-base lg:text-lg text-slate-600 text-left">{vowel.pronunciation}</td>
                  </tr>
                  ))}
              </tbody>
            </table>
                </div>
              </div>

        {/* Nguyên âm kép */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Nguyên âm kép</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Nguyên âm kép</th>
                  <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Đọc như</th>
                </tr>
              </thead>
              <tbody>
                {compoundVowels.map((vowel) => (
                  <tr key={vowel.pinyin}>
                    <td className="border border-slate-200 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => speakPinyin(vowel.pinyin)}
                        className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-base font-semibold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        <span>🔊</span>
                        {vowel.pinyin}
                      </button>
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-base lg:text-lg text-slate-600 text-left">{vowel.pronunciation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bảng 3: LUYỆN NGHE */}
        <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">3. LUYỆN NGHE</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200">
            <tbody>
              {listeningPractice.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((pinyin, colIndex) => (
                    <td key={colIndex} className="border border-slate-200 p-3 text-center">
                      {pinyin && (
                        <span className="inline-block rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                          {pinyin}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                  ))}
            </tbody>
          </table>
                </div>
        
        {/* Audio player cho Luyện Nghe */}
        <div className="mt-6 rounded-2xl border-2 border-emerald-200/60 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/80 p-6 shadow-lg shadow-emerald-100/50 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-200/50">
              <span className="text-2xl">🎧</span>
              </div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-800">Nghe phát âm toàn bộ bảng</h3>
          </div>
          <AudioPlayerFull src="https://tiengtrungthuonghai.vn/wp-content/uploads/2019/12/luyen-nghe-bai-3-video-cho-v%C3%A0o-b%C3%A0i-thanh-%C4%91i%E1%BB%87u.mp3" />
          <p className="mt-4 text-sm lg:text-base text-slate-600 flex items-center gap-2">
            <span className="text-base">📝</span>
            <span>Nghe và luyện tập phát âm theo từng âm tiết trong bảng</span>
          </p>
        </div>
      </div>

      {/* Bảng 4: THANH MẪU (PHỤ ÂM) */}
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">4. THANH MẪU (PHỤ ÂM)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200">
            <tbody>
              {initialsTable.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((initial, colIndex) => (
                    <td key={colIndex} className="border border-slate-200 p-3 text-center">
                      {initial && (
                        <span className="inline-block rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                          {initial}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bảng Phụ âm */}
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Bảng Phụ âm</h2>
        
        {/* PHỤ ÂM ĐƠN */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-bold text-orange-600">Phụ âm đơn</h3>

          {/* Nhóm âm hai môi và răng môi */}
          <div className="mb-6">
            <h4 className="mb-3 text-base font-semibold text-slate-700">Nhóm âm hai môi và răng môi</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">Phụ âm</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Cách phát âm</th>
                  </tr>
                </thead>
                <tbody>
                  {bilabialLabiodental.map((consonant) => (
                    <tr key={consonant.pinyin}>
                      <td className="border border-slate-200 px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => speakPinyin(consonant.pinyin)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <span>🔊</span>
                          {consonant.pinyin}
                        </button>
                      </td>
                      <td className="border border-slate-200 px-4 py-3 text-base lg:text-lg text-slate-600 text-left">{consonant.pronunciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nhóm âm đầu lưỡi */}
          <div className="mb-6">
            <h4 className="mb-3 text-base font-semibold text-slate-700">Nhóm âm đầu lưỡi</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">Phụ âm</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Cách phát âm</th>
                  </tr>
                </thead>
                <tbody>
                  {alveolar.map((consonant) => (
                    <tr key={consonant.pinyin}>
                      <td className="border border-slate-200 px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => speakPinyin(consonant.pinyin)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <span>🔊</span>
                          {consonant.pinyin}
                        </button>
                      </td>
                      <td className="border border-slate-200 px-4 py-3 text-base lg:text-lg text-slate-600 text-left">{consonant.pronunciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nhóm âm đầu lưỡi trước */}
          <div className="mb-6">
            <h4 className="mb-3 text-base font-semibold text-slate-700">Nhóm âm đầu lưỡi trước</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">Phụ âm</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Cách phát âm</th>
                  </tr>
                </thead>
                <tbody>
                  {dentalSibilant.map((consonant) => (
                    <tr key={consonant.pinyin}>
                      <td className="border border-slate-200 px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => speakPinyin(consonant.pinyin)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <span>🔊</span>
                          {consonant.pinyin}
                        </button>
                      </td>
                      <td className="border border-slate-200 px-4 py-3 text-base lg:text-lg text-slate-600 text-left">{consonant.pronunciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nhóm âm mặt lưỡi */}
          <div className="mb-6">
            <h4 className="mb-3 text-base font-semibold text-slate-700">Nhóm âm mặt lưỡi</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">Phụ âm</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Cách phát âm</th>
                  </tr>
                </thead>
                <tbody>
                  {palatal.map((consonant) => (
                    <tr key={consonant.pinyin}>
                      <td className="border border-slate-200 px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => speakPinyin(consonant.pinyin)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <span>🔊</span>
                          {consonant.pinyin}
                        </button>
                      </td>
                      <td className="border border-slate-200 px-4 py-3 text-base lg:text-lg text-slate-600 text-left">{consonant.pronunciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nhóm âm cuống lưỡi */}
          <div>
            <h4 className="mb-3 text-base font-semibold text-slate-700">Nhóm âm cuống lưỡi</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">Phụ âm</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Cách phát âm</th>
                  </tr>
                </thead>
                <tbody>
                  {velar.map((consonant) => (
                    <tr key={consonant.pinyin}>
                      <td className="border border-slate-200 px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => speakPinyin(consonant.pinyin)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <span>🔊</span>
                          {consonant.pinyin}
                        </button>
                      </td>
                      <td className="border border-slate-200 px-4 py-3 text-base lg:text-lg text-slate-600 text-left">{consonant.pronunciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PHỤ ÂM KÉP */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-orange-600">Phụ âm kép</h3>

          {/* Nhóm âm đầu lưỡi sau */}
          <div>
            <h4 className="mb-3 text-base font-semibold text-slate-700">Nhóm âm đầu lưỡi sau</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">Phụ âm</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Cách phát âm</th>
                  </tr>
                </thead>
                <tbody>
                  {retroflex.map((consonant) => (
                    <tr key={consonant.pinyin}>
                      <td className="border border-slate-200 px-4 py-3 text-center">
            <button
              type="button"
                          onClick={() => speakPinyin(consonant.pinyin)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
                          <span>🔊</span>
                          {consonant.pinyin}
            </button>
                      </td>
                      <td className="border border-slate-200 px-4 py-3 text-base lg:text-lg text-slate-600 text-left">{consonant.pronunciation}</td>
                    </tr>
          ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* THANH ĐIỆU */}
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-8 shadow-xl">
        <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">THANH ĐIỆU</h2>
        
        {/* Giải thích */}
        <div className="mb-6 rounded-lg bg-amber-50 p-4 text-sm text-slate-700">
          <p className="font-medium">
            * Cách đọc thanh 4 bằng cách dùng tay chém từ trên xuống và giật giọng.
          </p>
        </div>

        {/* 4 thanh điệu */}
        <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {tones.map((tone, index) => (
            <div key={tone.tone} className="flex flex-col items-center rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-4 shadow-md shadow-emerald-50/50 transition-all hover:shadow-lg hover:shadow-emerald-100/50">
              <div className="mb-3 text-center">
                <div className="text-5xl font-bold text-slate-900">{tone.tone}</div>
                <div className="mt-1 text-base font-semibold text-slate-600">{tone.name}</div>
              </div>
              
              {/* Biểu đồ thanh điệu */}
              <div className="mb-4 h-32 w-full rounded-lg bg-white/80 p-4 shadow-inner border border-slate-100">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  {/* Lưới nền */}
                  {[1, 2, 3, 4, 5].map((level) => (
                    <line
                      key={level}
                      x1="0"
                      y1={level * 20}
                      x2="100"
                      y2={level * 20}
                      stroke="#e2e8f0"
                      strokeWidth="0.5"
                    />
                  ))}
                  
                  {/* Đường thanh điệu */}
                  {tone.pattern === "flat" && (
                    <>
                      <line x1="10" y1="20" x2="90" y2="20" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <polygon points="90,20 85,17 85,23" fill="#ef4444" />
                    </>
                  )}
                  {tone.pattern === "rising" && (
                    <>
                      <line x1="10" y1="60" x2="90" y2="20" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <polygon points="90,20 87,25 83,22" fill="#ef4444" />
                    </>
                  )}
                  {tone.pattern === "dipping" && (
                    <>
                      <path d="M 10 40 Q 50 80 90 40" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <polygon points="90,40 85,42 87,37" fill="#ef4444" />
                    </>
                  )}
                  {tone.pattern === "falling" && (
                    <>
                      <line x1="10" y1="20" x2="90" y2="80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <polygon points="90,80 87,75 93,75" fill="#ef4444" />
                    </>
                  )}
                  
                  {/* Số cấp bên phải */}
                  {[1, 2, 3, 4, 5].reverse().map((level, idx) => (
                    <text
                      key={level}
                      x="95"
                      y={(idx + 1) * 20 + 5}
                      fontSize="10"
                      fill="#94a3b8"
                      textAnchor="start"
                >
                      {level}
                    </text>
              ))}
                </svg>
              </div>
              
              {/* Audio player nhỏ - Chỉ có nút play */}
              <SimpleAudioButton src={tone.audio} />
            </div>
          ))}
        </div>

        {/* Ghi chú thanh nhẹ */}
        <div className="rounded-lg border-l-4 border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">
            <span className="font-bold text-red-600">Ghi chú:</span> Trong tiếng phổ thông Trung Quốc, có một số chữ không được đọc theo thanh điệu vốn có, mà phải đọc vừa nhẹ vừa ngắn, đó là thanh nhẹ. Thanh nhẹ xuất hiện trong các trường hợp sau:
          </p>
          </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">Video hướng dẫn</p>
            <h2 className="text-2xl font-bold text-slate-900">Luyện phát âm cùng giáo viên bản xứ</h2>
            <p className="text-sm text-slate-600">
              Xem video để ghi chú khẩu hình, đường gió và vị trí lưỡi trước khi ghép thanh mẫu với vận mẫu.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm rounded-2xl text-base">Mở trên YouTube</button>
        </div>
        <div className="mt-4">
          <div className="relative w-full overflow-hidden rounded-3xl border border-slate-100 pt-[56.25%] shadow-xl">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/MLPq3AvoAbM?start=3"
              title="Khóa học Pinyin nền tảng"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </>
  );
}

