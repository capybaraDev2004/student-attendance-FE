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
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

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

    // Auto next after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= shuffledWords.length) {
      // Completed
      const percentage = Math.round((score.correct / (score.total + 1)) * 100);
      showNotification({
        type: "success",
        title: "Hoàn thành kiểm tra! 🎊",
        message: `Bạn đã đúng ${score.correct + (isCorrect ? 1 : 0)}/${shuffledWords.length} từ (${percentage}%)`,
        duration: 5000,
      });
      if (onComplete) onComplete();
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    const nextWord = shuffledWords[nextIndex];
    setCurrentQuestion(nextWord);
    generateOptions(nextWord, shuffledWords);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
  };

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
