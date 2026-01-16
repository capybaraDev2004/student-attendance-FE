"use client";

import { useState, useEffect } from "react";
import { showNotification } from "@/components/notification/NotificationSystem";

type VocabularyWord = {
  vocabId?: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: string;
};

type VocabularyCheckProps = {
  words: VocabularyWord[];
  onComplete?: () => void;
  speakPinyin: (text: string) => void;
};

export default function VocabularyCheck({
  words,
  onComplete,
  speakPinyin,
}: VocabularyCheckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledWords, setShuffledWords] = useState<VocabularyWord[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<VocabularyWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    if (words.length === 0) return;
    
    // Shuffle words
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentQuestion(shuffled[0]);
    generateOptions(shuffled[0], shuffled);
  }, [words]);

  const generateOptions = (word: VocabularyWord, allWords: VocabularyWord[]) => {
    const wrongAnswers = allWords
      .filter((w) => w.hanzi !== word.hanzi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.meaning);
    
    const allOptions = [word.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.meaning;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Kiểm tra xem đây có phải câu cuối cùng không
    const isLastQuestion = currentIndex + 1 >= shuffledWords.length;
    
    // Cập nhật score - FIX: Đảm bảo tính đúng cả câu cuối cùng
    // Sử dụng functional update để đảm bảo tính chính xác
    setScore((prev) => {
      const newScore = {
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1,
      };
      
      // Nếu là câu cuối, lưu vào finalScore và chuyển sang trang tổng kết sau 2 giây
      if (isLastQuestion) {
        setTimeout(() => {
          setFinalScore(newScore);
          setIsFinished(true);
        }, 2000);
      }
      
      return newScore;
    });

    // Show notification
    if (correct) {
      showNotification({
        type: "success",
        title: "Chính xác! 🎉",
        message: `${currentQuestion.hanzi} (${currentQuestion.pinyin}) có nghĩa là "${currentQuestion.meaning}"`,
        duration: 3000,
      });
    } else {
      showNotification({
        type: "error",
        title: "Sai rồi! 😔",
        message: `Đáp án đúng: ${currentQuestion.hanzi} (${currentQuestion.pinyin}) = "${currentQuestion.meaning}"`,
        duration: 4000,
      });
    }
    
    // Auto next after 2 seconds (chỉ nếu không phải câu cuối)
    if (!isLastQuestion) {
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= shuffledWords.length) {
      // Không nên đến đây vì đã xử lý trong handleAnswer
      return;
    }

    setCurrentIndex(nextIndex);
    const nextWord = shuffledWords[nextIndex];
    setCurrentQuestion(nextWord);
    generateOptions(nextWord, shuffledWords);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
  };

  const handleRestart = () => {
    // Reset tất cả state
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setIsFinished(false);
    setFinalScore({ correct: 0, total: 0 });
    
    // Shuffle lại words
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentQuestion(shuffled[0]);
    generateOptions(shuffled[0], shuffled);
  };

  const handleExit = () => {
    if (onComplete) onComplete();
  };

  // Trang tổng kết
  if (isFinished) {
    const percentage = finalScore.total > 0 
      ? Math.round((finalScore.correct / finalScore.total) * 100)
      : 0;
    const isPerfect = finalScore.correct === finalScore.total && finalScore.total > 0;
    
    return (
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <div className="text-center space-y-6">
          {/* Icon và tiêu đề */}
          <div className="flex flex-col items-center gap-4">
            {isPerfect ? (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl animate-pulse-glow">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : percentage >= 70 ? (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl">
                <span className="text-5xl">👍</span>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
                <span className="text-5xl">💪</span>
              </div>
            )}
            
            <h2 className="text-3xl font-bold text-slate-900">
              {isPerfect ? "Hoàn hảo! 🎊" : percentage >= 70 ? "Tốt lắm! 👏" : "Cố gắng thêm! 💪"}
            </h2>
          </div>

          {/* Kết quả chi tiết */}
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
              <p className="text-lg text-slate-600 mb-2">Kết quả kiểm tra</p>
              <p className="text-5xl font-bold text-emerald-700 mb-2">
                {finalScore.correct}/{finalScore.total}
              </p>
              <p className="text-2xl font-semibold text-emerald-600">
                {percentage}%
              </p>
            </div>

            {/* Thông điệp */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              {isPerfect ? (
                <p className="text-base text-slate-700">
                  Bạn đã trả lời đúng tất cả các câu hỏi! Xuất sắc! 🌟
                </p>
              ) : percentage >= 70 ? (
                <p className="text-base text-slate-700">
                  Kết quả tốt! Hãy tiếp tục luyện tập để đạt 100% nhé! 📚
                </p>
              ) : (
                <p className="text-base text-slate-700">
                  Đừng nản lòng! Hãy ôn tập lại và thử lại nhé! 💪
                </p>
              )}
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 btn-enhanced"
            >
              🔄 Làm lại
            </button>
            <button
              onClick={handleExit}
              className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold shadow-md hover:bg-slate-50 hover:border-slate-400 transition-all hover:scale-105 active:scale-95"
            >
              ← Thoát ra
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion || shuffledWords.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
        <div className="text-center py-12">
          <p className="text-slate-500">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / shuffledWords.length) * 100;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-slate-900">Kiểm tra từ vựng</h3>
          <div className="text-right">
            <p className="text-sm text-slate-500">Câu {currentIndex + 1}/{shuffledWords.length}</p>
            <p className="text-lg font-semibold text-emerald-600">
              Điểm: {score.correct}/{score.total}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full progress-bar-smooth transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 text-center">
          <button
            onClick={() => speakPinyin(currentQuestion.pinyin)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span className="text-emerald-700 font-semibold">Nghe phát âm</span>
          </button>
          
          <p className="text-5xl font-bold text-slate-900 mb-2">{currentQuestion.hanzi}</p>
          <p className="text-2xl text-slate-600 mb-4">{currentQuestion.pinyin}</p>
          <p className="text-lg text-slate-500">Chọn nghĩa đúng:</p>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentQuestion.meaning;
          let buttonClass = "vocab-card rounded-xl border-2 px-6 py-4 text-left font-semibold text-lg transition-all duration-300 ";

          if (showResult) {
            if (isCorrectAnswer) {
              buttonClass += "border-emerald-400 bg-emerald-50 text-emerald-800 vocab-check-correct shadow-lg";
            } else if (isSelected && !isCorrectAnswer) {
              buttonClass += "border-rose-300 bg-rose-50 text-rose-700 vocab-check-incorrect";
            } else {
              buttonClass += "border-slate-200 bg-slate-50 text-slate-500 opacity-60";
            }
          } else {
            buttonClass += "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md active:scale-95";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && isCorrectAnswer && (
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {showResult && isSelected && !isCorrectAnswer && (
                  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Example sentence */}
      {currentQuestion.example && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500 mb-1">Ví dụ:</p>
          <p className="text-base text-slate-700">{currentQuestion.example}</p>
        </div>
      )}
    </div>
  );
}
