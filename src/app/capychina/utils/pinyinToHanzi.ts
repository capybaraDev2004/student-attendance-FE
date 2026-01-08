// Bảng mapping Pinyin với thanh điệu sang chữ Hán cho phát âm chính xác
// Tham khảo từ tiengtrungthuonghai.vn

const pinyinToHanziMap: Record<string, string> = {
  // Thanh điệu với "ma"
  mā: "妈",
  má: "麻",
  mǎ: "马",
  mà: "骂",
  ma: "吗",

  // Vận mẫu đơn
  a: "啊",
  o: "哦",
  e: "额",
  i: "一",
  u: "五",
  ü: "鱼",

  // Thanh mẫu - các âm đơn giản
  bā: "八",
  pō: "坡",
  mā: "妈",
  fēi: "飞",
  dà: "大",
  tī: "踢",
  ní: "泥",
  lǜ: "绿",
  gē: "哥",
  kě: "可",
  hē: "喝",
  jī: "机",
  qī: "七",
  xī: "西",
  zhī: "知",
  chī: "吃",
  shī: "师",
  rì: "日",
  zǐ: "子",
  cì: "次",
  sì: "四",

  // Vận mẫu kép
  ài: "爱",
  ěi: "诶",
  áo: "熬",
  ōu: "欧",
  iā: "鸭",
  iē: "耶",
  uā: "挖",
  uō: "窝",
  üē: "约",
  iāo: "腰",
  iōu: "优",
  uài: "外",
  uēi: "威",

  // Vận mẫu âm mũi
  ān: "安",
  ēn: "恩",
  īn: "音",
  ün: "云",
  ián: "烟",
  uān: "弯",
  üán: "圆",
  uēn: "温",
  áng: "昂",
  éng: "能",
  īng: "英",
  óng: "翁",
  iōng: "拥",
  iáng: "羊",
  uáng: "王",
  uēng: "翁",

  // Bài tập luyện thanh mẫu
  bā: "八",
  pō: "坡",
  mā: "妈",
  fēi: "飞",
  dà: "大",
  tī: "踢",
  ní: "泥",
  lǜ: "绿",

  // Bài tập luyện vận mẫu
  ā: "啊",
  ōu: "欧",
  iāo: "腰",
  uài: "外",
  üē: "约",
  iǒng: "永",
  iáng: "羊",
  uè: "月",

  // Vận mẫu đơn (đã có ở trên)
  // a, o, e, i, u, ü

  // Vận mẫu kép (đã có ở trên)
  // Thêm các mapping còn thiếu
  ei: "诶",
  ao: "熬",
  ou: "欧",
  ia: "鸭",
  ie: "耶",
  ua: "挖",
  uo: "窝",
  iou: "优",
  uei: "威",

  // Vận mẫu âm mũi (đã có ở trên)
  // Thêm các mapping còn thiếu
  an: "安",
  en: "恩",
  in: "音",
  un: "云",
  ian: "烟",
  uan: "弯",
  üan: "圆",
  uen: "温",
  ang: "昂",
  eng: "能",
  ing: "英",
  ong: "翁",
  iang: "羊",
  uang: "王",
  ueng: "翁",

  // Âm uốn lưỡi
  er: "二",

  // Thanh mẫu - các nhóm
  b: "不",
  p: "皮",
  m: "马",
  f: "发",
  d: "大",
  t: "他",
  n: "你",
  l: "来",
  g: "个",
  k: "看",
  h: "好",
  j: "家",
  q: "去",
  x: "小",
  zh: "这",
  ch: "吃",
  sh: "是",
  r: "人",
  z: "在",
  c: "次",
  s: "四",

  // Bài đọc mẫu
  "nǐ hǎo": "你好",
  "tā shì": "他是",
  "wǒ ài": "我爱",
  māma: "妈妈",
  "hē chá": "喝茶",
  "qù xuéxiào": "去学校",

  // Các từ ghép thường dùng
  xièxie: "谢谢",
  miàntiáo: "面条",
  jīchǎng: "机场",
};

/**
 * Loại bỏ dấu thanh điệu từ Pinyin
 */
function removeToneMarks(pinyin: string): string {
  return pinyin
    .replace(/[āáǎà]/g, "a")
    .replace(/[ēéěè]/g, "e")
    .replace(/[īíǐì]/g, "i")
    .replace(/[ōóǒò]/g, "o")
    .replace(/[ūúǔù]/g, "u")
    .replace(/[ǖǘǚǜ]/g, "ü");
}

/**
 * Chuyển đổi Pinyin sang chữ Hán nếu có trong bảng mapping
 * Nếu không có, trả về Pinyin gốc
 */
export function convertPinyinToHanzi(pinyin: string): string {
  if (!pinyin) return pinyin;

  // Chuẩn hóa Pinyin: loại bỏ khoảng trắng thừa, chuyển sang lowercase
  const normalized = pinyin.trim().toLowerCase();

  // Kiểm tra mapping trực tiếp
  if (pinyinToHanziMap[normalized]) {
    return pinyinToHanziMap[normalized];
  }

  // Thử loại bỏ dấu thanh điệu nếu không tìm thấy
  const withoutTones = removeToneMarks(normalized);
  if (withoutTones !== normalized && pinyinToHanziMap[withoutTones]) {
    return pinyinToHanziMap[withoutTones];
  }

  // Xử lý các cụm từ có khoảng trắng
  if (normalized.includes(" ") || normalized.includes(",")) {
    // Xử lý danh sách có dấu phẩy
    const parts = normalized.split(/[,，\s]+/).filter((p) => p.trim());
    const hanziParts = parts.map((part) => {
      const trimmed = part.trim().toLowerCase();
      if (pinyinToHanziMap[trimmed]) {
        return pinyinToHanziMap[trimmed];
      }
      const withoutTone = removeToneMarks(trimmed);
      if (pinyinToHanziMap[withoutTone]) {
        return pinyinToHanziMap[withoutTone];
      }
      return trimmed;
    });
    return hanziParts.join(" ");
  }

  // Nếu không tìm thấy, trả về Pinyin gốc
  // Google TTS vẫn có thể phát âm một số Pinyin cơ bản
  return pinyin;
}

/**
 * Kiểm tra xem Pinyin có thể chuyển sang chữ Hán không
 */
export function hasHanziMapping(pinyin: string): boolean {
  const normalized = pinyin.trim().toLowerCase();
  return !!pinyinToHanziMap[normalized];
}

