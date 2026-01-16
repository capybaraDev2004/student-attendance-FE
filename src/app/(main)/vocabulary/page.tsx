"use client";

import { useState, useMemo } from "react";

type VocabularyWord = {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  category?: string;
};

export default function VocabularyPage() {
  // 20 từ cơ bản tiếng Trung với cách đọc và nghĩa
  const vocabulary: VocabularyWord[] = [
    { chinese: "你好", pinyin: "nǐ hǎo", vietnamese: "Xin chào", category: "Chào hỏi" },
    { chinese: "谢谢", pinyin: "xiè xiè", vietnamese: "Cảm ơn", category: "Lịch sự" },
    { chinese: "再见", pinyin: "zài jiàn", vietnamese: "Tạm biệt", category: "Chào hỏi" },
    { chinese: "请", pinyin: "qǐng", vietnamese: "Xin mời", category: "Lịch sự" },
    { chinese: "对不起", pinyin: "duì bu qǐ", vietnamese: "Xin lỗi", category: "Lịch sự" },
    { chinese: "没关系", pinyin: "méi guān xi", vietnamese: "Không sao", category: "Lịch sự" },
    { chinese: "是", pinyin: "shì", vietnamese: "Là", category: "Động từ" },
    { chinese: "不是", pinyin: "bù shì", vietnamese: "Không phải", category: "Động từ" },
    { chinese: "好", pinyin: "hǎo", vietnamese: "Tốt", category: "Tính từ" },
    { chinese: "不好", pinyin: "bù hǎo", vietnamese: "Không tốt", category: "Tính từ" },
    { chinese: "我", pinyin: "wǒ", vietnamese: "Tôi", category: "Đại từ" },
    { chinese: "你", pinyin: "nǐ", vietnamese: "Bạn", category: "Đại từ" },
    { chinese: "他", pinyin: "tā", vietnamese: "Anh ấy", category: "Đại từ" },
    { chinese: "她", pinyin: "tā", vietnamese: "Cô ấy", category: "Đại từ" },
    { chinese: "我们", pinyin: "wǒ men", vietnamese: "Chúng tôi", category: "Đại từ" },
    { chinese: "你们", pinyin: "nǐ men", vietnamese: "Các bạn", category: "Đại từ" },
    { chinese: "他们", pinyin: "tā men", vietnamese: "Họ", category: "Đại từ" },
    { chinese: "这", pinyin: "zhè", vietnamese: "Đây", category: "Đại từ" },
    { chinese: "那", pinyin: "nà", vietnamese: "Đó", category: "Đại từ" },
    { chinese: "什么", pinyin: "shén me", vietnamese: "Cái gì", category: "Câu hỏi" }
  ];

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Lấy danh sách categories duy nhất
  const categories = useMemo(() => {
    const cats = vocabulary.map(v => v.category).filter((c): c is string => !!c);
    return Array.from(new Set(cats));
  }, []);

  // Filter vocabulary
  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter(word => {
      const matchesSearch = 
        word.chinese.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.vietnamese.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || word.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const playAudio = (chinese: string) => {
    setPlayingAudio(chinese);
    
    // Tạo SpeechSynthesis utterance để phát âm tiếng Trung
    const utterance = new SpeechSynthesisUtterance(chinese);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setPlayingAudio(null);
    };
    
    utterance.onerror = () => {
      setPlayingAudio(null);
    };
    
    speechSynthesis.speak(utterance);
  };

  return (
    <section className="section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 font-semibold text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Từ vựng & SRS
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900">
            Học từ vựng <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">thông minh</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto">
            Ôn tập với phương pháp SRS (Spaced Repetition System) để ghi nhớ lâu dài và hiệu quả
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm từ vựng (chữ Hán, pinyin hoặc nghĩa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-lg focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg scale-105"
                  : "bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg scale-105"
                    : "bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="text-center text-slate-600">
            Tìm thấy <span className="font-bold text-emerald-600">{filteredVocabulary.length}</span> từ vựng
          </div>
        </div>

        {/* Vocabulary Grid */}
        {filteredVocabulary.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl text-slate-600 font-medium">Không tìm thấy từ vựng nào</p>
            <p className="text-slate-500 mt-2">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVocabulary.map((word, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-blue-50/0 to-amber-50/0 group-hover:from-emerald-50/50 group-hover:via-blue-50/30 group-hover:to-amber-50/20 transition-all duration-500"></div>
                
                <div className="relative p-6 space-y-4">
                  {/* Category badge */}
                  {word.category && (
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      {word.category}
                    </div>
                  )}

                  {/* Chinese Character - Large and prominent */}
                  <div className="text-center space-y-2">
                    <div className="text-5xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {word.chinese}
                    </div>
                    
                    {/* Pinyin */}
                    <div className="text-xl font-semibold text-emerald-600">
                      {word.pinyin}
                    </div>
                    
                    {/* Vietnamese meaning */}
                    <div className="text-lg text-slate-700 font-medium">
                      {word.vietnamese}
                    </div>
                  </div>

                  {/* Audio button */}
                  <button
                    onClick={() => playAudio(word.chinese)}
                    disabled={playingAudio === word.chinese}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      playingAudio === word.chinese
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 group-hover:shadow-md"
                    }`}
                  >
                    {playingAudio === word.chinese ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang phát...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span>Nghe phát âm</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 rounded-3xl p-8 border-2 border-emerald-200 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Hệ thống SRS thông minh</h3>
                <p className="text-slate-700 leading-relaxed">
                  Hệ thống ôn tập khoảng cách lặp lại (Spaced Repetition System) giúp bạn ghi nhớ từ vựng hiệu quả hơn. 
                  Từ vựng sẽ được lặp lại đúng thời điểm để củng cố trí nhớ dài hạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


