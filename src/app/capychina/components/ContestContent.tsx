import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { vocabularyCategories } from "../data";
import { API_BASE, apiFetch } from "@/lib/api";

type Word = { hanzi: string; pinyin: string; meaning: string; example?: string };

type QuizQuestion =
  | {
      kind: "vocab";
      prompt: string; // nghĩa tiếng Việt
      pinyin: string;
      correct: string; // hanzi
      options: string[];
    }
  | {
      kind: "flashcard";
      prompt: string; // hanzi
      correct: string; // meaning
      options: string[];
      image: string;
    }
  | {
      kind: "sentence";
      sentenceWithBlank: string;
      expected: string; // hanzi
      hint: string;
    };

type Lesson = {
  id: number;
  questions: QuizQuestion[];
};

const chineseKeyboard = [
  ..."你好谢谢中国学习学生老师朋友机场火车飞机酒店房间米饭面条水茶咖啡苹果香蕉工作公司老板会议手机电脑"
];

// Inline SVG placeholders để tránh lỗi tải ảnh
const flashcardImages = [
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='520'><defs><linearGradient id='g1' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23a7f3d0'/><stop offset='1' stop-color='%23ecfeff'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g1)'/><text x='50%' y='50%' font-size='48' font-family='sans-serif' fill='%230f172a' text-anchor='middle' dominant-baseline='middle'>Flashcard</text></svg>",
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='520'><defs><linearGradient id='g2' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23bfdbfe'/><stop offset='1' stop-color='%23eef2ff'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g2)'/><text x='50%' y='50%' font-size='48' font-family='sans-serif' fill='%2303123e' text-anchor='middle' dominant-baseline='middle'>Flashcard</text></svg>",
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='520'><defs><linearGradient id='g3' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23fee2e2'/><stop offset='1' stop-color='%23fff7ed'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g3)'/><text x='50%' y='50%' font-size='48' font-family='sans-serif' fill='%230b0f19' text-anchor='middle' dominant-baseline='middle'>Flashcard</text></svg>",
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function buildLessons(
  vocabPool?: Word[],
  flashcardPool?: { id: number; image_url?: string | null; answer: string }[]
): Lesson[] {
  const allWords: Word[] = vocabPool ?? vocabularyCategories.flatMap((c) => c.words);
  const lessons: Lesson[] = [];

  for (let i = 0; i < 6; i++) {
    // 10 vocab + 5 câu điền từ vocab
    const selected = pickN(allWords, 15);
    const vocabWords = selected.slice(0, 10);
    const sentenceWords = selected.slice(10, 15);

    // 5 flashcard lấy từ flashcardPool (đáp án là chữ Hán)
    const flashPool = flashcardPool ?? [];
    let flashSelection: { id: number; image_url?: string | null; answer: string }[] = [];

    if (flashPool.length > 0) {
      // Có dữ liệu flashcard thật từ backend
      if (flashPool.length >= 5) {
        flashSelection = pickN(flashPool, 5);
      } else {
        // Nếu ít hơn 5, cho phép lặp lại để luôn đủ 5 câu
        const base = [...flashPool];
        while (base.length < 5) {
          base.push(flashPool[Math.floor(Math.random() * flashPool.length)]);
        }
        flashSelection = base.slice(0, 5);
      }
    } else {
      // Không có flashcard từ backend -> tạo 5 câu flashcard từ vocab để luôn đủ 20 câu
      const pseudo = pickN(allWords, 5).map((w, idx) => ({
        id: idx,
        answer: w.hanzi,
        image_url: undefined as string | undefined,
      }));
      flashSelection = pseudo;
    }

    const vocabQs: QuizQuestion[] = vocabWords.map((w) => {
      const wrong = pickN(
        allWords.filter((x) => x.hanzi !== w.hanzi),
        3
      ).map((x) => x.hanzi);
      return {
        kind: "vocab",
        prompt: w.meaning,
        pinyin: w.pinyin,
        correct: w.hanzi,
        options: shuffle([w.hanzi, ...wrong]),
      };
    });

    const flashQs: QuizQuestion[] = flashSelection.map((f) => {
      const wrong = pickN(
        allWords.filter((x) => x.hanzi !== f.answer),
        3
      ).map((x) => x.hanzi);

      const fullImage =
        f.image_url && !f.image_url.startsWith("http")
          ? `${API_BASE}${f.image_url}`
          : f.image_url || flashcardImages[Math.floor(Math.random() * flashcardImages.length)];

      return {
        kind: "flashcard",
        prompt: f.answer,
        correct: f.answer,
        options: shuffle([f.answer, ...wrong]),
        image: fullImage,
      };
    });

    const sentenceQs: QuizQuestion[] = sentenceWords.map((w) => {
      const base = w.example || `${w.hanzi} ...`;
      const sentenceWithBlank = base.replace(w.hanzi, "____");
      return {
        kind: "sentence",
        sentenceWithBlank,
        expected: w.hanzi,
        hint: `${w.meaning} (${w.pinyin})`,
      };
    });

    const questions = [...vocabQs, ...sentenceQs, ...flashQs];
    lessons.push({ id: i + 1, questions });
  }

  return lessons;
}

function ChineseKeyboard({
  onInsert,
  onBackspace,
}: {
  onInsert: (char: string) => void;
  onBackspace: () => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-3 border border-slate-200">
      {chineseKeyboard.map((c, idx) => (
        <button
          key={`${c}-${idx}`}
          onClick={() => onInsert(c)}
          className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-base shadow-sm hover:border-emerald-400 hover:text-emerald-600"
        >
          {c}
        </button>
      ))}
      <button
        onClick={onBackspace}
        className="h-9 px-3 rounded-lg bg-rose-50 border border-rose-200 text-sm font-semibold text-rose-700"
      >
        ⌫ Xóa
      </button>
    </div>
  );
}

type ResultState = { correct: boolean; message?: string; lastChoice?: string };

export default function ContestContent() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lockedToday, setLockedToday] = useState<Set<number>>(new Set());
  const [pendingLesson, setPendingLesson] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [result, setResult] = useState<ResultState | null>(null);
  const [draft, setDraft] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishReportedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Gọi API Next.js proxy tới backend để lấy tối đa 25 flashcard đang hoạt động
        const res = await fetch("/api/flashcards", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Không thể tải flashcard");
        }
        const json = (await res.json()) as {
          items?: { id: number; image_url?: string | null; answer: string }[];
        };
        const flashItems = Array.isArray(json?.items) ? json.items : [];

        const vocabWords: Word[] = vocabularyCategories.flatMap((c) => c.words);
        setLessons(buildLessons(vocabWords, flashItems.slice(0, 25)));
      } catch (e) {
        console.error("Lỗi khi tải flashcard:", e);
        // Fallback: chỉ dùng vocab nếu lỗi
        const vocabWords: Word[] = vocabularyCategories.flatMap((c) => c.words);
        setLessons(buildLessons(vocabWords));
      }
    };

    loadData();
  }, []);

  // Mỗi ngày chỉ được hoàn thành 1 lần cho mỗi bài (1..6) - auto refresh mỗi 5 giây
  const loadLocked = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await apiFetch<{ items: { contest_id: number }[] }>("/contest-progress/today", {
        authToken: accessToken,
      });
      const ids = new Set<number>((data?.items || []).map((x) => x.contest_id));
      setLockedToday(ids);
    } catch (e) {
      console.error("Lỗi khi tải trạng thái đã làm hôm nay:", e);
    }
  }, [accessToken]);

  useEffect(() => {
    // Load ngay lập tức
    loadLocked();
    
    // Auto refresh mỗi 5 giây
    const interval = setInterval(loadLocked, 5000);
    
    return () => clearInterval(interval);
  }, [loadLocked]);

  const totalQuestions = useMemo(
    () => activeLesson?.questions.length || 0,
    [activeLesson]
  );

  const currentQuestion = useMemo(() => {
    if (!activeLesson) return null;
    return activeLesson.questions[currentIndex] || null;
  }, [activeLesson, currentIndex]);

  // Ghi nhận 1 câu trả lời đúng vào backend (chỉ gọi khi đúng)
  const recordCorrectAnswer = useCallback(async () => {
    if (!activeLesson || !accessToken || !totalQuestions) return;
    try {
      await apiFetch("/contest-progress", {
        method: "POST",
        body: JSON.stringify({
          contestId: activeLesson.id,
          totalQuestions,
          isCorrect: true,
        }),
        authToken: accessToken,
      });
    } catch (err) {
      // Không chặn luồng làm bài nếu API lỗi, chỉ log lại
      console.error("Lỗi khi lưu tiến độ cuộc thi:", err);
    }
  }, [activeLesson, accessToken, totalQuestions]);

  // Auto next after result
  useEffect(() => {
    if (result) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        goNext();
      }, 1000); // tự động chuyển sau 1 giây
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setStatus("playing");
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setResult(null);
    setDraft("");
    finishReportedRef.current = false;
  };

  const handleAnswer = (value: string) => {
    if (!currentQuestion || result) return;
    let isCorrect = false;
    if (currentQuestion.kind === "sentence") {
      const normalized = value.trim();
      isCorrect = normalized === currentQuestion.expected;
    } else {
      isCorrect = value === currentQuestion.correct;
    }
    setResult({ correct: isCorrect, lastChoice: currentQuestion.kind === "sentence" ? undefined : value });
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));

    // Chỉ khi trả lời đúng mới gọi API lưu vào CSDL
    if (isCorrect) {
      recordCorrectAnswer();
    }
  };

  const goNext = () => {
    if (!activeLesson) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= activeLesson.questions.length) {
      setStatus("finished");
      setResult(null);
      return;
    }
    setCurrentIndex(nextIndex);
    setResult(null);
    setDraft("");
  };

  // Chốt bài để khoá theo ngày (đã làm hôm nay => không cho tham gia lại)
  const finishContestToday = useCallback(async () => {
    if (!activeLesson || !accessToken || !totalQuestions) return;
    try {
      // Cập nhật ngay lập tức trên UI (optimistic update)
      setLockedToday((prev) => new Set(prev).add(activeLesson.id));
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("progress-updated", {
          detail: { contest_completed: true }
        }));
      }

      // Lưu vào database
      await apiFetch("/contest-progress/finish", {
        method: "POST",
        body: JSON.stringify({
          contestId: activeLesson.id,
          totalQuestions,
          correctCount: score.correct,
        }),
        authToken: accessToken,
      });

      // Refresh danh sách bài đã làm
      loadLocked();

      // Gửi request đến server ở background (không chặn UI)
      apiFetch("/daily-tasks/mark-contest-completed", {
        method: "POST",
        authToken: accessToken,
      }).catch((e) => {
        console.error("Lỗi khi đánh dấu hoàn thành cuộc thi:", e);
      });
    } catch (e) {
      console.error("Lỗi khi chốt bài để khoá theo ngày:", e);
    }
  }, [activeLesson, accessToken, totalQuestions, score.correct, loadLocked]);

  useEffect(() => {
    if (status === "finished" && activeLesson && !finishReportedRef.current) {
      finishReportedRef.current = true;
      finishContestToday();
    }
  }, [status, activeLesson, finishContestToday]);

  const restartAll = () => {
    setLessons(buildLessons());
    setPendingLesson(null);
    setActiveLesson(null);
    setStatus("idle");
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setResult(null);
    setDraft("");
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    if (currentQuestion.kind === "vocab" || currentQuestion.kind === "flashcard") {
      const isLocked = !!result;
      const isFlashcard = currentQuestion.kind === "flashcard";
      const promptText =
        currentQuestion.kind === "vocab"
          ? `Nghĩa: ${currentQuestion.prompt} (pinyin: ${currentQuestion.pinyin})`
          : "Hãy nhìn hình và chọn đúng chữ Hán tương ứng";

      const cardContent =
        isFlashcard ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={currentQuestion.image}
              alt="Flashcard"
              className="w-full max-w-3xl h-[220px] md:h-[260px] rounded-2xl border border-emerald-100 shadow-md bg-white object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== flashcardImages[0]) {
                  target.src = flashcardImages[0];
                }
              }}
            />
          </div>
        ) : null;

      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4 h-full">
          {/* Khung đề bài */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-center">
            <p className="text-base md:text-lg font-semibold text-slate-900 leading-snug">
              {promptText}
            </p>
          </div>

          {/* Ảnh flashcard (nếu có) */}
          {isFlashcard && (
            <div className="flex items-center justify-center">
              {cardContent}
            </div>
          )}

          {/* Vùng đáp án luôn nằm cuối, mỗi hàng luôn 2 ô (kể cả trên mobile) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {currentQuestion.options.map((opt) => {
              const isCorrect = result && opt === currentQuestion.correct;
              const isSelectedWrong =
                result && opt !== currentQuestion.correct && result.correct === false && result.lastChoice === opt;
              const stateClass = result
                ? isCorrect
                  ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                  : isSelectedWrong
                  ? "border-rose-300 bg-rose-50 text-rose-700"
                  : "border-slate-200"
                : "border-slate-200 hover:border-emerald-400";
              return (
                <button
                  key={opt}
                  disabled={isLocked}
                  onClick={() => handleAnswer(opt)}
                  className={`rounded-lg border px-3 py-2 text-left text-base transition shadow-sm ${stateClass} ${
                    !result ? "hover:shadow" : ""
                  } ${isSelectedWrong && !isCorrect ? "text-slate-700" : ""}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // sentence
    const isLocked = !!result;
    const isWrong = result && result.correct === false;
    const isRight = result && result.correct === true;
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        {/* Khung đề bài */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-center">
          <p className="text-base md:text-lg font-semibold text-slate-900 leading-snug">
            {currentQuestion.sentenceWithBlank}
          </p>
        </div>
        <p className="text-xs text-slate-500 mt-1">Gợi ý: {currentQuestion.hint}</p>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={isLocked}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
            isRight ? "border-emerald-400" : isWrong ? "border-rose-300" : "border-slate-200 focus:border-emerald-500"
          }`}
          placeholder="Điền chữ Hán"
        />
        <ChineseKeyboard
          onInsert={(c) => !isLocked && setDraft((d) => d + c)}
          onBackspace={() => !isLocked && setDraft((d) => d.slice(0, -1))}
        />
        <button
          disabled={isLocked}
          onClick={() => handleAnswer(draft)}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-600 disabled:opacity-50"
        >
          Chấm
        </button>
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;
    // Hiển thị từ bạn chọn và đáp án đúng trong popup
    let chosenText = "";
    let correctText = "";
    if (currentQuestion) {
      if (currentQuestion.kind === "vocab" || currentQuestion.kind === "flashcard") {
        chosenText = result.lastChoice || "";
        correctText = currentQuestion.correct;
      } else if (currentQuestion.kind === "sentence") {
        chosenText = draft || "";
        correctText = currentQuestion.expected;
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div
          className={`rounded-2xl border p-6 shadow-2xl text-center max-w-sm w-full animate-fade-in ${
            result.correct ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl drop-shadow">{result.correct ? "✅" : "⚠️"}</div>
            <p className="text-2xl font-bold tracking-tight">
              {result.correct ? "Đúng rồi!" : "Sai rồi"}
            </p>
            {currentQuestion && (
              <div className="mt-2 space-y-2 text-base">
                {chosenText && (
                  <p className="text-rose-700 font-semibold">
                    Bạn chọn: <span className="text-lg">{chosenText}</span>
                  </p>
                )}
                <p className="text-emerald-700 font-semibold">
                  Đáp án đúng: <span className="text-lg">{correctText}</span>
                </p>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">Tự động chuyển sau 1 giây</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl space-y-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Cuộc thi mini hàng tuần</h2>
          <p className="text-base text-slate-600">
            6 bài x 20 câu (10 từ vựng, 5 câu điền, 5 flashcard). Chọn/điền từng câu, chấm và tự chuyển sau 1 giây.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status !== "idle" && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-5 py-3 text-emerald-800 text-base md:text-lg font-semibold shadow-sm">
              Điểm: <span className="font-bold">{score.correct}</span>
              <span className="mx-1">/</span>
              <span>{score.total || totalQuestions || 0}</span>
            </div>
          )}
        </div>
      </div>

      {status === "idle" && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`rounded-2xl border p-4 shadow transition ${
                  lockedToday.has(lesson.id)
                    ? "border-slate-200 bg-slate-50 opacity-70"
                    : "border-slate-200 bg-gradient-to-br from-white to-emerald-50/60 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    {lesson.id}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">Bài {lesson.id}</p>
                    <p className="text-xs text-slate-500">20 câu: 10 từ vựng • 5 điền • 5 flashcard</p>
                    {lockedToday.has(lesson.id) && (
                      <p className="text-xs font-semibold text-slate-500 mt-1">Đã làm hôm nay</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => !lockedToday.has(lesson.id) && setPendingLesson(lesson.id)}
                  disabled={lockedToday.has(lesson.id)}
                  className={`mt-3 w-full rounded-lg px-3 py-2 font-semibold shadow ${
                    lockedToday.has(lesson.id)
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {lockedToday.has(lesson.id) ? "Đã làm" : "Tham gia"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {status === "playing" && activeLesson && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-white shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg font-bold shadow">
                  {activeLesson.id}
                </div>
                <div>
                <p className="text-lg font-semibold text-emerald-800">Bài {activeLesson.id}</p>
                <p className="text-sm text-slate-500">
                    Câu {currentIndex + 1}/{totalQuestions}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right text-xs text-slate-500">
                <span className="text-sm font-medium text-slate-500">Điểm hiện tại</span>
                <span className="text-lg font-semibold text-emerald-700">
                  {score.correct}/{score.total || totalQuestions}
                </span>
              </div>
                <button
                  onClick={() => {
                    // Bỏ cuộc: quay về danh sách, không lưu kết quả
                    setStatus("idle");
                    setActiveLesson(null);
                    setScore({ correct: 0, total: 0 });
                    setResult(null);
                    setDraft("");
                    if (timerRef.current) clearTimeout(timerRef.current);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold hover:bg-rose-100 shadow-sm"
                >
                  <span className="text-sm">⏹</span>
                  <span>Bỏ cuộc</span>
                </button>
              </div>
            </div>

            {/* Nội dung câu hỏi - chiếm phần còn lại, cho phép cuộn nếu nhỏ màn hình */}
            <div className="p-4 sm:p-6 max-h-[calc(90vh-5rem)] overflow-y-auto">
              {renderQuestion()}
            </div>

            {/* Popup kết quả (overlay riêng với z-50) */}
            {renderResult()}
          </div>
        </div>
      )}

      {status === "finished" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow space-y-3">
          <p className="text-2xl font-bold text-slate-900">Hoàn thành bài {activeLesson?.id}</p>
          <p className="text-lg text-emerald-700 font-semibold">
            Kết quả: {score.correct}/{score.total || totalQuestions}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                if (activeLesson) startLesson(activeLesson);
              }}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-600"
            >
              Làm lại bài
            </button>
            <button
              onClick={() => {
                setStatus("idle");
                setActiveLesson(null);
                setScore({ correct: 0, total: 0 });
                setResult(null);
                setDraft("");
              }}
              className="rounded-lg bg-slate-200 px-4 py-2 text-slate-800 font-semibold shadow hover:bg-slate-300"
            >
              Quay về danh sách
            </button>
          </div>
        </div>
      )}

      {/* Modal xác nhận tham gia */}
      {pendingLesson !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-w-md w-full rounded-2xl bg-white p-5 shadow-xl space-y-3">
            <p className="text-lg font-bold text-slate-900">Tham gia bài {pendingLesson}?</p>
            <p className="text-sm text-slate-600">
              Bạn sẽ làm lần lượt 20 câu, mỗi câu hiển thị đơn lẻ. Sau khi trả lời sẽ tự chuyển câu tiếp theo sau 1 giây.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const lesson = lessons.find((l) => l.id === pendingLesson);
                  if (lesson) startLesson(lesson);
                  setPendingLesson(null);
                }}
                className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-600"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setPendingLesson(null)}
                className="flex-1 rounded-lg bg-slate-200 px-4 py-2 text-slate-800 font-semibold shadow hover:bg-slate-300"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

