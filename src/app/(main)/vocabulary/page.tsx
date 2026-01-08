"use client";

import { useState } from "react";

export default function VocabularyPage() {
  // 20 từ cơ bản tiếng Trung với cách đọc và nghĩa
  const vocabulary = [
    { chinese: "你好", pinyin: "nǐ hǎo", vietnamese: "Xin chào", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "谢谢", pinyin: "xiè xiè", vietnamese: "Cảm ơn", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "再见", pinyin: "zài jiàn", vietnamese: "Tạm biệt", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "请", pinyin: "qǐng", vietnamese: "Xin mời", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "对不起", pinyin: "duì bu qǐ", vietnamese: "Xin lỗi", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "没关系", pinyin: "méi guān xi", vietnamese: "Không sao", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "是", pinyin: "shì", vietnamese: "Là", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "不是", pinyin: "bù shì", vietnamese: "Không phải", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "好", pinyin: "hǎo", vietnamese: "Tốt", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "不好", pinyin: "bù hǎo", vietnamese: "Không tốt", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "我", pinyin: "wǒ", vietnamese: "Tôi", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "你", pinyin: "nǐ", vietnamese: "Bạn", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "他", pinyin: "tā", vietnamese: "Anh ấy", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "她", pinyin: "tā", vietnamese: "Cô ấy", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "我们", pinyin: "wǒ men", vietnamese: "Chúng tôi", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "你们", pinyin: "nǐ men", vietnamese: "Các bạn", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "他们", pinyin: "tā men", vietnamese: "Họ", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "这", pinyin: "zhè", vietnamese: "Đây", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "那", pinyin: "nà", vietnamese: "Đó", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { chinese: "什么", pinyin: "shén me", vietnamese: "Cái gì", audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" }
  ];

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const playAudio = (chinese: string) => {
    setPlayingAudio(chinese);
    
    // Tạo SpeechSynthesis utterance để phát âm tiếng Trung
    const utterance = new SpeechSynthesisUtterance(chinese);
    utterance.lang = 'zh-CN'; // Tiếng Trung giản thể
    utterance.rate = 0.8; // Tốc độ nói chậm hơn một chút
    utterance.pitch = 1; // Cao độ bình thường
    
    utterance.onend = () => {
      setPlayingAudio(null);
    };
    
    utterance.onerror = () => {
      setPlayingAudio(null);
    };
    
    speechSynthesis.speak(utterance);
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Từ vựng & SRS</h1>
        <p className="section-subtitle">Ôn tập thông minh để nhớ lâu</p>
        <p className="section-subtitle">Một số từ minh họa trước khi vào bài chính</p>

        <div className="grid-responsive">
          {vocabulary.map((word, i) => (
            <div key={i} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-slate-800">{word.chinese}</div>
                    <div className="text-lg text-emerald-600 font-medium">{word.pinyin}</div>
                    <div className="text-lg text-slate-600 mt-1 font-medium">{word.vietnamese}</div>
                  </div>
                  <button 
                    className={`btn btn-sm transition-all duration-200 ${
                      playingAudio === word.chinese 
                        ? 'btn-primary' 
                        : 'btn-secondary hover:btn-primary'
                    }`}
                    onClick={() => playAudio(word.chinese)}
                    disabled={playingAudio === word.chinese}
                  >
                    {playingAudio === word.chinese ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang phát...</span>
                      </div>
                    ) : (
                      "Nghe thử"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


