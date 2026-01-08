export const sidebarItems = [
  { key: "phonics", label: "Học phiên âm", description: "Giải thích Pinyin, thanh điệu, khẩu hình.", icon: "🎧" },
  { key: "vocabulary", label: "Học từ vựng", description: "Flashcard + nghĩa tiếng Việt.", icon: "🧠" },
  { key: "sentence", label: "Học ghép câu", description: "Sắp xếp Hanzi thành câu hoàn chỉnh.", icon: "🧩" },
  { key: "speaking", label: "Bài tập nói", description: "So sánh phát âm với mẫu chuẩn.", icon: "🗣️" },
  { key: "writing", label: "Bài tập viết", description: "Nét cơ bản + trật tự viết chữ.", icon: "✍️" },
  { key: "contest", label: "Cuộc thi", description: "Đua điểm với bạn học cùng lớp.", icon: "🏅" },
  { key: "leaderboard", label: "Bảng xếp hạng", description: "Theo dõi thứ hạng theo tuần.", icon: "📊" },
];

export const tones = [
  { 
    tone: "ā", 
    name: "Thanh 1",
    symbol: "ˉ",
    pattern: "flat",
    audio: "https://tiengtrungonline.com/wp-content/themes/chinese/audio/coban/thanhdieu/ba1.mp3"
  },
  { 
    tone: "á", 
    name: "Thanh 2",
    symbol: "ˊ",
    pattern: "rising",
    audio: "https://tiengtrungonline.com/wp-content/themes/chinese/audio/coban/thanhdieu/ba2.mp3"
  },
  { 
    tone: "ǎ", 
    name: "Thanh 3",
    symbol: "ˇ",
    pattern: "dipping",
    audio: "https://tiengtrungonline.com/wp-content/themes/chinese/audio/coban/thanhdieu/ba3.mp3"
  },
  { 
    tone: "à", 
    name: "Thanh 4",
    symbol: "ˋ",
    pattern: "falling",
    audio: "https://tiengtrungonline.com/wp-content/themes/chinese/audio/coban/thanhdieu/ba4.mp3"
  },
];

// Bảng 1: Vận mẫu theo cột a, o, e, i, u, ü
export const finalsByVowel = {
  a: ["a", "ai", "ao", "an", "ang"],
  o: ["o", "ou", "ong"],
  e: ["e", "ei", "en", "eng", "er"],
  i: ["i", "ia", "iao", "ian", "iang", "ie", "iu", "in", "ing", "iong"],
  u: ["u", "ua", "uai", "uan", "uang", "ueng", "ui", "un", "uo"],
  ü: ["ü", "üe", "üan", "ün"],
};

// Bảng 2: Phân loại vận mẫu
export const simpleVowels = [
  { pinyin: "a", pronunciation: 'Đọc như "a"' },
  { pinyin: "o", pronunciation: 'Đọc như "ô"' },
  { pinyin: "e", pronunciation: 'Đọc như "ơ" hoặc "ưa"' },
  { pinyin: "i", pronunciation: 'Đọc như "i"' },
  { pinyin: "u", pronunciation: 'Đọc như "u"' },
  { pinyin: "ü", pronunciation: 'Đọc như "uy" tròn môi' },
];

export const compoundVowels = [
  { pinyin: "ai", pronunciation: 'Đọc như "ai"' },
  { pinyin: "ao", pronunciation: 'Đọc như "ao"' },
  { pinyin: "an", pronunciation: 'Đọc như "an"' },
  { pinyin: "ang", pronunciation: 'Đọc như "ang"' },
  { pinyin: "ou", pronunciation: 'Đọc như "âu"' },
  { pinyin: "ong", pronunciation: 'Đọc như "ung"' },
  { pinyin: "ei", pronunciation: 'Đọc như "ây"' },
  { pinyin: "en", pronunciation: 'Đọc như "ân"' },
  { pinyin: "eng", pronunciation: 'Đọc như "âng"' },
  { pinyin: "er", pronunciation: 'Đọc như "ơ" và uốn lưỡi lên' },
  { pinyin: "ia", pronunciation: 'Đọc như "i+a"' },
  { pinyin: "iao", pronunciation: 'Đọc như "i+eo"' },
  { pinyin: "ian", pronunciation: 'Đọc như "i+en"' },
  { pinyin: "iang", pronunciation: 'Đọc như "i+ang"' },
  { pinyin: "ie", pronunciation: 'Đọc như "i+ê"' },
  { pinyin: "iu", pronunciation: 'Đọc như "i+âu"' },
  { pinyin: "in", pronunciation: 'Đọc như "in"' },
  { pinyin: "ing", pronunciation: 'Đọc như "ing"' },
  { pinyin: "iong", pronunciation: 'Đọc như "i+ung"' },
  { pinyin: "ua", pronunciation: 'Đọc như "oa"' },
  { pinyin: "uai", pronunciation: 'Đọc như "oai"' },
  { pinyin: "uan", pronunciation: 'Đọc như "oan"' },
  { pinyin: "uang", pronunciation: 'Đọc như "oang"' },
  { pinyin: "uo", pronunciation: 'Đọc như "ua"' },
  { pinyin: "ui", pronunciation: 'Đọc như "uây"' },
  { pinyin: "un", pronunciation: 'Đọc như "u+ân"' },
  { pinyin: "ueng", pronunciation: 'Đọc như "u+âng"' },
  { pinyin: "üe", pronunciation: 'Đọc như "uy+ê"' },
  { pinyin: "üan", pronunciation: 'Đọc như "uy+en"' },
  { pinyin: "ün", pronunciation: 'Đọc như "uyn"' },
];

// Bảng 3: Luyện nghe - Grid các Pinyin syllables
export const listeningPractice = [
  ["bā", "pà", "dà", "tā", "hé", "fó", "gē", "kè"],
  ["bī", "pí", "dé", "tè", "hòu", "fóu", "gū", "kū"],
  ["bù", "pù", "dì", "tī", "hēi", "fēi", "gǎi", "kǎi"],
  ["bái", "pái", "dú", "tú", "hù", "fù", "gěi", "děi"],
  ["bèi", "péi", "dài", "tài", "hā", "fā", "gōu", "kōu"],
];

// Bảng 4: Thanh mẫu (Phụ âm)
export const initialsTable = [
  ["b", "p", "m", "f"],
  ["d", "t", "n", "l"],
  ["g", "k", "h", ""],
  ["j", "q", "x", ""],
  ["z", "c", "s", ""],
  ["zh", "ch", "sh", "r"],
  ["y", "w", "", ""],
];

// === PHỤ ÂM ĐƠN ===

// Nhóm âm hai môi và răng môi
export const bilabialLabiodental = [
  { pinyin: "b", pronunciation: 'Phát âm như "pua" trong tiếng Việt, hai môi tiếp xúc,rồi mở nhanh' },
  { pinyin: "p", pronunciation: 'Phát âm như "pua", nhưng bật hơi mạnh.' },
  { pinyin: "m", pronunciation: 'Phát âm như phụ âm "m" trong tiếng Việt' },
  { pinyin: "f", pronunciation: 'Phát âm như phụ âm "ph" trong tiếng Việt' },
];

// Nhóm âm đầu lưỡi
export const alveolar = [
  { pinyin: "d", pronunciation: 'Phát âm như phụ âm "t" trong tiếng Việt' },
  { pinyin: "t", pronunciation: 'Phát âm như phụ âm "th" trong tiếng Việt, có bật hơi' },
  { pinyin: "n", pronunciation: 'Phát âm như "n" trong tiếng Việt' },
  { pinyin: "l", pronunciation: 'Phát âm như "l" trong tiếng Việt' },
];

// Nhóm âm đầu lưỡi trước
export const dentalSibilant = [
  { pinyin: "z", pronunciation: 'Phát âm như "ch" trong tiếng Việt, âm tắc sát không bật hơi,đầu lưỡi thẳng tiếp xúc giữa hai hàm răng trên và dưới.' },
  { pinyin: "c", pronunciation: 'Phát âm như "ch" nhưng khác là phải bật hơi.' },
  { pinyin: "s", pronunciation: 'Phát âm như "x" trong tiếng Việt, lưỡi sau chân răng' },
  { pinyin: "r", pronunciation: 'Phát âm như phụ âm "r" nhưng không rung lưỡi' },
];

// Nhóm âm mặt lưỡi
export const palatal = [
  { pinyin: "j", pronunciation: 'Phát âm như "ch" trong tiếng Việt, đầu lưỡi chạm vào chân răng hàm dưới' },
  { pinyin: "q", pronunciation: 'Phát âm như "ch" nhưng bật hơi' },
  { pinyin: "x", pronunciation: 'Phát âm như "x" trong tiếng Việt, đầu lưỡi chạm vào chân răng hàm dưới' },
];

// Nhóm âm cuống lưỡi
export const velar = [
  { pinyin: "g", pronunciation: 'Phát âm như "c" trong tiếng Việt' },
  { pinyin: "k", pronunciation: 'Phát âm như "kh" nhưng tắc và bật hơi mạnh ở cuống họng' },
  { pinyin: "h", pronunciation: 'Phát âm như "h" trong tiếng Việt, sát ở cuống họng, giống như âm giữa "h" và "kh".' },
];

// === PHỤ ÂM KÉP ===

// Nhóm âm đầu lưỡi sau
export const retroflex = [
  { pinyin: "zh", pronunciation: 'Phát âm như "ch" trong tiếng Việt trộn môi, uốn lưỡi' },
  { pinyin: "ch", pronunciation: 'Phát âm như "ch" nhưng bật hơi, trộn môi, uốn lưỡi' },
  { pinyin: "sh", pronunciation: 'Phát âm như "s" trong tiếng Việt, môi trộn, uốn lưỡi' },
];

export const practiceCards = [
  {
    title: "Gợi ý luyện thanh mẫu",
    items: ["bā", "pō", "mā", "fēi", "dà", "tī", "ní", "lǜ"],
    note: "Đặt âm đầu giống nhau, thay âm vận để cảm nhận khẩu hình.",
  },
  {
    title: "Gợi ý luyện vận mẫu",
    items: ["ā", "ōu", "iāo", "uài", "üē", "iǒng", "iáng", "uè"],
    note: "Đọc chậm–nhanh, ghi âm lại nghe sự khác nhau.",
  },
  {
    title: "Bài đọc mẫu",
    items: ["nǐ hǎo", "tā shì", "wǒ ài", "māma", "hē chá", "qù xuéxiào"],
    note: "Ghép câu ngắn rồi kết hợp luyện thanh điệu.",
  },
];

// Cấu trúc dữ liệu vocabulary_categories: mỗi chủ đề có danh sách từ vựng
export const vocabularyCategories = [
  {
    id: "eating",
    name: "Ăn uống",
    wordCount: 20,
    reviewDays: 2,
    words: [
      { hanzi: "谢谢", pinyin: "xièxie", meaning: "Cảm ơn", example: "谢谢你的帮助。" },
      { hanzi: "面条", pinyin: "miàntiáo", meaning: "Mì sợi", example: "我喜欢吃面条。" },
      { hanzi: "米饭", pinyin: "mǐfàn", meaning: "Cơm", example: "请给我一碗米饭。" },
      { hanzi: "水", pinyin: "shuǐ", meaning: "Nước", example: "请给我一杯水。" },
      { hanzi: "茶", pinyin: "chá", meaning: "Trà", example: "我想喝一杯茶。" },
      { hanzi: "咖啡", pinyin: "kāfēi", meaning: "Cà phê", example: "我要一杯咖啡。" },
      { hanzi: "水果", pinyin: "shuǐguǒ", meaning: "Hoa quả", example: "我喜欢吃水果。" },
      { hanzi: "苹果", pinyin: "píngguǒ", meaning: "Táo", example: "这个苹果很甜。" },
      { hanzi: "香蕉", pinyin: "xiāngjiāo", meaning: "Chuối", example: "香蕉很好吃。" },
      { hanzi: "鱼", pinyin: "yú", meaning: "Cá", example: "今天吃鱼。" },
      { hanzi: "肉", pinyin: "ròu", meaning: "Thịt", example: "我不吃猪肉。" },
      { hanzi: "菜", pinyin: "cài", meaning: "Rau", example: "多吃蔬菜对身体好。" },
      { hanzi: "汤", pinyin: "tāng", meaning: "Canh", example: "请给我一碗汤。" },
      { hanzi: "面包", pinyin: "miànbāo", meaning: "Bánh mì", example: "我早餐吃面包。" },
      { hanzi: "鸡蛋", pinyin: "jīdàn", meaning: "Trứng", example: "早餐吃鸡蛋。" },
      { hanzi: "牛奶", pinyin: "niúnǎi", meaning: "Sữa", example: "每天早上喝牛奶。" },
      { hanzi: "酒", pinyin: "jiǔ", meaning: "Rượu", example: "我不喝酒。" },
      { hanzi: "糖", pinyin: "táng", meaning: "Đường", example: "请给我一点糖。" },
      { hanzi: "盐", pinyin: "yán", meaning: "Muối", example: "菜太咸了，少放盐。" },
      { hanzi: "筷子", pinyin: "kuàizi", meaning: "Đũa", example: "请给我一双筷子。" },
    ],
  },
  {
    id: "travel",
    name: "Du lịch",
    wordCount: 20,
    reviewDays: 2,
    words: [
      { hanzi: "机场", pinyin: "jīchǎng", meaning: "Sân bay", example: "我在机场等你。" },
      { hanzi: "火车", pinyin: "huǒchē", meaning: "Tàu hỏa", example: "我们坐火车去北京。" },
      { hanzi: "汽车", pinyin: "qìchē", meaning: "Ô tô", example: "我开汽车去。" },
      { hanzi: "飞机", pinyin: "fēijī", meaning: "Máy bay", example: "我坐飞机去上海。" },
      { hanzi: "酒店", pinyin: "jiǔdiàn", meaning: "Khách sạn", example: "这家酒店很好。" },
      { hanzi: "房间", pinyin: "fángjiān", meaning: "Phòng", example: "请给我一个房间。" },
      { hanzi: "票", pinyin: "piào", meaning: "Vé", example: "我要买一张票。" },
      { hanzi: "地图", pinyin: "dìtú", meaning: "Bản đồ", example: "请给我一张地图。" },
      { hanzi: "行李", pinyin: "xínglǐ", meaning: "Hành lý", example: "我的行李很重。" },
      { hanzi: "护照", pinyin: "hùzhào", meaning: "Hộ chiếu", example: "请出示你的护照。" },
      { hanzi: "旅行", pinyin: "lǚxíng", meaning: "Du lịch", example: "我喜欢旅行。" },
      { hanzi: "参观", pinyin: "cānguān", meaning: "Tham quan", example: "我们去参观博物馆。" },
      { hanzi: "拍照", pinyin: "pāizhào", meaning: "Chụp ảnh", example: "可以帮我拍照吗？" },
      { hanzi: "风景", pinyin: "fēngjǐng", meaning: "Phong cảnh", example: "这里的风景很美。" },
      { hanzi: "纪念品", pinyin: "jìniànpǐn", meaning: "Đồ lưu niệm", example: "我想买一些纪念品。" },
      { hanzi: "问路", pinyin: "wènlù", meaning: "Hỏi đường", example: "请问，怎么去火车站？" },
      { hanzi: "迷路", pinyin: "mílù", meaning: "Lạc đường", example: "我迷路了。" },
      { hanzi: "导游", pinyin: "dǎoyóu", meaning: "Hướng dẫn viên", example: "导游给我们介绍了很多景点。" },
      { hanzi: "景点", pinyin: "jǐngdiǎn", meaning: "Điểm tham quan", example: "这个景点很出名。" },
      { hanzi: "海滩", pinyin: "hǎitān", meaning: "Bãi biển", example: "我们去海滩玩。" },
    ],
  },
  {
    id: "work",
    name: "Công việc",
    wordCount: 20,
    reviewDays: 2,
    words: [
      { hanzi: "工作", pinyin: "gōngzuò", meaning: "Công việc", example: "我今天工作很忙。" },
      { hanzi: "办公室", pinyin: "bàngōngshì", meaning: "Văn phòng", example: "我在办公室工作。" },
      { hanzi: "公司", pinyin: "gōngsī", meaning: "Công ty", example: "我在一家大公司工作。" },
      { hanzi: "同事", pinyin: "tóngshì", meaning: "Đồng nghiệp", example: "我的同事很友好。" },
      { hanzi: "老板", pinyin: "lǎobǎn", meaning: "Sếp", example: "老板今天不在。" },
      { hanzi: "会议", pinyin: "huìyì", meaning: "Cuộc họp", example: "下午有一个会议。" },
      { hanzi: "邮件", pinyin: "yóujiàn", meaning: "Email", example: "请查收邮件。" },
      { hanzi: "电话", pinyin: "diànhuà", meaning: "Điện thoại", example: "请给我打电话。" },
      { hanzi: "电脑", pinyin: "diànnǎo", meaning: "Máy tính", example: "我的电脑坏了。" },
      { hanzi: "文件", pinyin: "wénjiàn", meaning: "Tài liệu", example: "请给我这些文件。" },
      { hanzi: "报告", pinyin: "bàogào", meaning: "Báo cáo", example: "明天交报告。" },
      { hanzi: "项目", pinyin: "xiàngmù", meaning: "Dự án", example: "这个项目很重要。" },
      { hanzi: "任务", pinyin: "rènwù", meaning: "Nhiệm vụ", example: "我有三个任务要完成。" },
      { hanzi: "加班", pinyin: "jiābān", meaning: "Tăng ca", example: "今天要加班。" },
      { hanzi: "假期", pinyin: "jiàqī", meaning: "Kỳ nghỉ", example: "我下周有假期。" },
      { hanzi: "工资", pinyin: "gōngzī", meaning: "Lương", example: "这个月工资发了吗？" },
      { hanzi: "简历", pinyin: "jiǎnlì", meaning: "Sơ yếu lý lịch", example: "请发送你的简历。" },
      { hanzi: "面试", pinyin: "miànshì", meaning: "Phỏng vấn", example: "明天有一个面试。" },
      { hanzi: "职位", pinyin: "zhíwèi", meaning: "Vị trí", example: "这个职位很适合我。" },
      { hanzi: "职业", pinyin: "zhíyè", meaning: "Nghề nghiệp", example: "你的职业是什么？" },
    ],
  },
];

// Giữ lại vocabularyTopics và vocabularyExamples để tương thích ngược
export const vocabularyTopics = vocabularyCategories.map((cat) => cat.name);

export const vocabularyExamples = vocabularyCategories[0].words.slice(0, 3);

export const sentenceExamples = [
  { sentence: "我 今天 学 中文。", target: "我今天学中文。" },
  { sentence: "你 去 哪儿 旅行？", target: "你去哪儿旅行？" },
];

export const listeningTracks = [
  { title: "Chào hỏi tại trường", duration: "00:38", focus: "Thanh 2 + 3" },
  { title: "Mua đồ ăn sáng", duration: "00:42", focus: "Âm /sh/ và /ch/" },
];

export const speakingMetrics = ["Khẩu hình", "Thanh điệu", "Tốc độ"];

export const writingCharacters = [
  { hanzi: "人", order: "2 nét", tip: "Phân biệt với 入" },
  { hanzi: "好", order: "6 nét", tip: "Nét 女 trước 子" },
  { hanzi: "学", order: "8 nét", tip: "Bộ 子 viết cuối" },
];

export const contestCards = [
  { title: "Tuần này", status: "Đang mở", reward: "+50 XP" },
  { title: "Top 10", status: "Cập nhật 02 giờ/lần", reward: "Huy hiệu bạc" },
  { title: "Bạn bè", status: "3 người tham gia", reward: "Bốc thăm quà" },
];

export const leaderboardUsers = [
  { name: "Lan Anh", streak: "7 ngày", xp: 320 },
  { name: "Minh Quân", streak: "5 ngày", xp: 280 },
  { name: "Bạn", streak: "0 ngày", xp: 120 },
];

export const progressTips = [
  { title: "Điểm chuyên cần", value: "Đang tải...", subtitle: "Đang lấy dữ liệu cuộc thi" },
  { title: "Chuỗi học", value: "Đang tải...", subtitle: "Làm 1 bài hôm nay để mở streak" },
];

export const quests = [
  { title: "Học 10 từ vựng", progress: 0, total: 10 },
  { title: "Học 5 câu nói", progress: 0, total: 5 },
  { title: "Làm 1 bài thi", progress: 0, total: 1 },
];

export const tipThemes = [
  { wrapper: "bg-emerald-50/80 border-emerald-100", value: "text-emerald-900", subtitle: "text-emerald-700" },
  { wrapper: "bg-sky-50/80 border-sky-100", value: "text-sky-900", subtitle: "text-sky-700" },
  { wrapper: "bg-amber-50/80 border-amber-100", value: "text-amber-900", subtitle: "text-amber-700" },
];

export const questThemes = [
  { wrapper: "bg-gradient-to-br from-emerald-50 to-white border-emerald-100", bar: "from-emerald-400 to-emerald-600" },
  { wrapper: "bg-gradient-to-br from-sky-50 to-white border-sky-100", bar: "from-sky-400 to-sky-600" },
  { wrapper: "bg-gradient-to-br from-amber-50 to-white border-amber-100", bar: "from-amber-400 to-amber-600" },
];

