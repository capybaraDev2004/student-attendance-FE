import { prisma } from "../src/lib/prisma";

type WordGroup = "noun" | "verb" | "adjective" | "special" | "situation" | "general";

type CategoryDefinition = {
  code: string;
  nameVi: string;
  nameEn: string;
  group: WordGroup;
  keywords: string[];
  oldNames?: string[];
  chineseKeywords?: string[];
  weight?: number;
};

type OldCategoryHint = {
  code?: string;
  group?: WordGroup;
};

type VocabWithCategory = {
  vocab_id: number;
  chinese_word: string;
  pinyin: string;
  meaning_vn: string;
  category: {
    name_vi: string | null;
  } | null;
};

const FALLBACK_CODE = "khai-niem-truu-tuong";
const USE_LEGACY_HINTS = false;

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    code: "people-relations",
    nameVi: "Con người & quan hệ xã hội",
    nameEn: "People & Social Relations",
    group: "noun",
    keywords: [
      "ban be",
      "quan he",
      "bang huu",
      "dong nghiep",
      "doi tac",
      "hang xom",
      "khach hang",
      "khach moi",
      "cong dan",
      "nhan su",
      "doan the",
      "nhom nguoi",
      "doi thu",
      "ban trai",
      "ban gai",
      "doi doi",
      "ban cung lop",
      "nguoi dung",
      "nguoi tham gia",
    ],
  },
  {
    code: "gia-dinh",
    nameVi: "Gia đình",
    nameEn: "Family",
    group: "noun",
    keywords: [
      "gia dinh",
      "bo me",
      "cha me",
      "ong noi",
      "ba noi",
      "ong ngoai",
      "ba ngoai",
      "anh trai",
      "chi gai",
      "em trai",
      "em gai",
      "vo chong",
      "doi vo chong",
      "con trai",
      "con gai",
      "chau noi",
      "chau ngoai",
      "than nhan",
      "ho hang",
    ],
    oldNames: ["gia dinh"],
  },
  {
    code: "nghe-nghiep",
    nameVi: "Nghề nghiệp",
    nameEn: "Occupations",
    group: "noun",
    keywords: [
      "nghe nghiep",
      "nghe",
      "nghe si",
      "cong nhan",
      "ky su",
      "bac si",
      "y ta",
      "giao vien",
      "sinh vien",
      "hoc sinh",
      "tai xe",
      "quan ly",
      "sep",
      "thu ky",
      "nong dan",
      "luat su",
      "bao chi",
      "nha bao",
      "dien vien",
      "nghe thu cong",
      "tho moc",
      "tho kim hoan",
      "tho dieu khac",
      "khoi nghiep",
    ],
    oldNames: ["cong viec"],
  },
  {
    code: "bo-phan-co-the",
    nameVi: "Bộ phận cơ thể",
    nameEn: "Body Parts",
    group: "noun",
    keywords: [
      "co the",
      "dau",
      "mat",
      "mui",
      "mieng",
      "tai",
      "co",
      "vai",
      "lung",
      "chan",
      "tay",
      "ngon",
      "tim",
      "gan",
      "da",
      "xuong",
      "co bap",
      "noi tang",
    ],
    oldNames: ["co the"],
  },
  {
    code: "dong-vat",
    nameVi: "Động vật",
    nameEn: "Animals",
    group: "noun",
    keywords: [
      "dong vat",
      "con cho",
      "con meo",
      "con ga",
      "con vit",
      "con bo",
      "con heo",
      "con lon",
      "con ngua",
      "con chim",
      "con ca",
      "con khi",
      "con ho",
      "con su tu",
      "thu cung",
    ],
    oldNames: ["dong vat"],
  },
  {
    code: "thuc-vat",
    nameVi: "Thực vật",
    nameEn: "Plants",
    group: "noun",
    keywords: [
      "thuc vat",
      "cay",
      "hoa",
      "la",
      "re",
      "than",
      "cay co",
      "cay an trai",
      "rau",
      "qua",
      "hat",
      "mam",
    ],
    oldNames: ["cay coi"],
  },
  {
    code: "do-vat-hang-ngay",
    nameVi: "Đồ vật & vật dụng hằng ngày",
    nameEn: "Daily Objects",
    group: "noun",
    keywords: [
      "do vat",
      "vat dung",
      "do dung",
      "vat pham",
      "chai",
      "ly",
      "bat",
      "noi",
      "chao",
      "dao",
      "keo",
      "may say",
      "den pin",
      "o khoa",
      "chot cua",
      "dong ho",
      "cap sac",
      "tai nghe",
      "vali",
      "tui xach",
      "balo",
      "niem phong",
      "but chi",
      "ngoc bich",
      "thuy tinh",
      "thach anh",
      "kim cuong",
      "vang",
      "bac",
      "dong",
      "sat",
      "nhom",
      "gang",
    ],
  },
  {
    code: "nha-noi-that",
    nameVi: "Nhà cửa & nội thất",
    nameEn: "Home & Interior",
    group: "noun",
    keywords: [
      "ngoi nha",
      "can ho",
      "noi that",
      "phong khach",
      "phong ngu",
      "phong bep",
      "phong tam",
      "nha ve sinh",
      "san nha",
      "mai nha",
      "tu ao",
      "tu giay",
      "giuong",
      "sofa",
      "ban an",
      "den trang tri",
      "nha kho",
      "hang rao",
      "biet thu",
      "khoang",
      "buong",
      "kho",
      "phong kho",
      "khu vuc luu tru",
    ],
  },
  {
    code: "thuc-pham-do-uong",
    nameVi: "Thực phẩm & đồ uống",
    nameEn: "Food & Drinks",
    group: "noun",
    keywords: [
      "thuc pham",
      "do an",
      "mon an",
      "thuc uong",
      "cafe",
      "tra",
      "banh",
      "thit",
      "ca",
      "hai san",
      "rau cu",
      "hoa qua",
      "trai cay",
      "do hop",
      "gia vi",
      "nuoc tuong",
      "bia",
      "ruou",
    ],
    oldNames: ["do an", "thuc uong"],
  },
  {
    code: "quan-ao-phu-kien",
    nameVi: "Quần áo & phụ kiện",
    nameEn: "Clothing & Accessories",
    group: "noun",
    keywords: [
      "quan ao",
      "ao so mi",
      "ao len",
      "ao khoac",
      "quan jean",
      "quan tay",
      "dam",
      "chan vay",
      "phu kien",
      "tui xach",
      "vi",
      "that lung",
      "day lung",
      "non",
      "mu",
      "gang tay",
      "tat",
      "giay",
      "dep",
      "khau trang",
      "kinh mat",
    ],
    oldNames: ["quan ao"],
  },
  {
    code: "do-hoc-tap",
    nameVi: "Đồ dùng học tập",
    nameEn: "Study Essentials",
    group: "noun",
    keywords: [
      "sach",
      "vo",
      "vở",
      "but",
      "but chi",
      "but may",
      "but muc",
      "giu sac",
      "hop but",
      "thuoc ke",
      "thuoc day",
      "thuoc do goc",
      "compa",
      "bang",
      "lop hoc",
      "phong hoc",
      "cap sach",
      "cham cau",
      "tieu chuan",
    ],
    oldNames: ["truong hoc"],
  },
  {
    code: "cong-cu-thiet-bi",
    nameVi: "Công cụ & thiết bị",
    nameEn: "Tools & Devices",
    group: "noun",
    keywords: [
      "cong cu",
      "thiet bi",
      "may",
      "may moc",
      "may khoan",
      "may cat",
      "may mai",
      "may han",
      "khoa mo",
      "bua",
      "tua vit",
      "kim loai",
      "bo luu tru",
      "cam bien",
      "bo mach",
      "dong co",
      "robot",
      "thiet bi y te",
    ],
    oldNames: ["khoa hoc"],
  },
  {
    code: "dia-diem",
    nameVi: "Địa điểm (nơi chốn)",
    nameEn: "Locations",
    group: "noun",
    keywords: [
      "dia diem",
      "thanh pho",
      "thi tran",
      "lang",
      "khu pho",
      "cong vien",
      "truong hoc",
      "benh vien",
      "nha tho",
      "chua",
      "dia diem du lich",
      "nui",
      "bien",
      "song",
      "cho",
      "sieu thi",
      "cua hang",
      "san bay",
      "ga tau",
      "ben xe",
      "khu cong nghiep",
      "van phong",
      "bien gioi",
      "ranh gioi",
      "khu vuc",
      "mien",
      "vung",
      "pho",
      "duong",
      "nga tu",
      "bo",
      "ven bien",
      "bai bien",
      "dong",
      "thung lung",
      "cao nguyen",
      "binh nguyen",
      "rung",
      "khu rung",
      "ho",
      "suoi",
    ],
    oldNames: ["dia diem"],
  },
  {
    code: "thien-nhien-moi-truong",
    nameVi: "Thiên nhiên & môi trường",
    nameEn: "Nature & Environment",
    group: "noun",
    keywords: [
      "thien nhien",
      "moi truong",
      "he sinh thai",
      "rung",
      "bien",
      "dong",
      "sa mac",
      "ho",
      "song",
      "dong chay",
      "dong bang",
      "khi hau",
      "bao ton",
      "nang luong xanh",
      "chat thai",
      "o nhiem",
      "khong khi",
      "dat dai",
      "dat lien",
    ],
  },
  {
    code: "hien-tuong-tu-nhien",
    nameVi: "Hiện tượng tự nhiên",
    nameEn: "Natural Phenomena",
    group: "noun",
    keywords: [
      "hien tuong",
      "mua",
      "gio",
      "bao",
      "loc",
      "song than",
      "dong dat",
      "nui lua",
      "tuyet",
      "suong mu",
      "sam set",
      "nang nong",
      "ret dam",
      "lu lut",
      "thoi tiet",
      "ap thap",
      "ap cao",
    ],
    oldNames: ["thoi tiet"],
  },
  {
    code: FALLBACK_CODE,
    nameVi: "Khái niệm trừu tượng",
    nameEn: "Abstract Concepts",
    group: "noun",
    keywords: [
      "khai niem",
      "y tuong",
      "truu tuong",
      "thoi gian",
      "lich su",
      "qua khu",
      "tuong lai",
      "tu duy",
      "nho lai",
      "quan diem",
      "gia tri",
      "dao duc",
      "nguyen tac",
      "quy tac",
      "quy dinh",
      "trach nhiem",
      "nghia vu",
      "quyen loi",
      "muc tieu",
      "chien luoc",
    ],
    oldNames: ["tu truu tuong", "thoi gian"],
  },
  {
    code: "su-kien-xa-hoi",
    nameVi: "Sự kiện & hiện tượng xã hội",
    nameEn: "Social Events",
    group: "noun",
    keywords: [
      "su kien",
      "le hoi",
      "le ky niem",
      "cuoc hop",
      "hoi nghi",
      "hoi thao",
      "van dong",
      "phong trao",
      "chien tranh",
      "chinh tri",
      "bieu tinh",
      "xung dot",
      "doi moi",
      "khung hoang",
      "bao dong",
      "tin tuc",
    ],
    oldNames: ["chinh tri"],
  },
  {
    code: "cong-nghe-truyen-thong",
    nameVi: "Công nghệ & truyền thông",
    nameEn: "Technology & Media",
    group: "noun",
    keywords: [
      "cong nghe",
      "ky thuat so",
      "may tinh",
      "may chu",
      "lap trinh",
      "phan mem",
      "ung dung",
      "ai",
      "tri tue nhan tao",
      "thiet bi so",
      "internet",
      "mang xa hoi",
      "bao chi",
      "truyen hinh",
      "da phuong tien",
      "vien thong",
      "tin nhan",
      "email",
      "podcast",
      "livestream",
    ],
    oldNames: ["cong nghe", "khoa hoc"],
  },
  {
    code: "tien-tai-chinh",
    nameVi: "Tiền bạc & tài chính",
    nameEn: "Money & Finance",
    group: "noun",
    keywords: [
      "tien",
      "tai chinh",
      "ngan hang",
      "tai san",
      "von",
      "gia ca",
      "gia tien",
      "chi phi",
      "thu nhap",
      "chi tieu",
      "tiet kiem",
      "dau tu",
      "co phieu",
      "trai phieu",
      "lai suat",
      "ty gia",
      "ngan sach",
      "tai khoan",
      "hoa don",
      "thanh toan",
      "thu phi",
      "hoa hong",
    ],
    oldNames: ["mua sam", "kinh te"],
  },
  {
    code: "hanh-dong-co-ban",
    nameVi: "Hành động cơ bản",
    nameEn: "Basic Actions",
    group: "verb",
    keywords: [
      "lay",
      "giu",
      "nam bat",
      "tha",
      "nem",
      "day",
      "keo",
      "mo",
      "dong",
      "cat",
      "xe",
      "chem",
      "bam",
      "bop",
      "be",
      "dap",
      "day len",
      "day xuong",
      "xoay",
      "trau chuot",
      "khuay",
      "pha",
      "gom",
    ],
    oldNames: ["hanh dong"],
  },
  {
    code: "hoat-dong-co-the",
    nameVi: "Hoạt động cơ thể",
    nameEn: "Physical Activities",
    group: "verb",
    keywords: [
      "an",
      "uong",
      "nghi ngo",
      "ngu",
      "thuc day",
      "thuc giac",
      "tap the duc",
      "ren luyen",
      "hit tho",
      "tho",
      "nho mat",
      "chop mat",
      "mui",
      "nghe",
      "kham",
      "chay",
      "nhay",
      "boi",
      "leo",
      "truot",
      "ren",
      "tri lieu",
    ],
  },
  {
    code: "di-chuyen-giao-thong",
    nameVi: "Di chuyển & giao thông",
    nameEn: "Movement & Transport",
    group: "verb",
    keywords: [
      "di chuyen",
      "di bo",
      "di xe",
      "len tau",
      "len may bay",
      "di xe bus",
      "di xe buyt",
      "hanh ly",
      "khoi hanh",
      "cat canh",
      "ha canh",
      "du lich",
      "hanh trinh",
      "chuyen bay",
      "dat ve",
      "van chuyen",
      "giao thong",
    ],
    oldNames: ["phuong tien"],
  },
  {
    code: "giao-tiep",
    nameVi: "Hoạt động giao tiếp",
    nameEn: "Communication Actions",
    group: "verb",
    keywords: [
      "noi",
      "ke",
      "hoi",
      "tra loi",
      "tra loi lai",
      "tra loi ngay",
      "goi",
      "goi dien",
      "nhan",
      "nhan tin",
      "nhan thong bao",
      "viet thu",
      "viet email",
      "truyen tai",
      "doi thoai",
      "phan hoi",
      "tham do",
      "bao cao",
      "phat bieu",
      "gioi thieu",
      "tranh luan",
      "thuc giuc",
      "boc lo",
      "bo loc",
      "tiet lo",
      "cong bo",
      "thong bao",
      "thong tin",
      "cam on",
      "xin loi",
      "chao hoi",
      "ket ban",
      "tiep xuc",
      "gap go",
      "phong van",
      "san tin",
      "tham quan",
      "tham du",
      "tham gia",
      "tham do",
    ],
  },
  {
    code: "tu-duy",
    nameVi: "Hoạt động tư duy",
    nameEn: "Thinking",
    group: "verb",
    keywords: [
      "nghi",
      "suy nghi",
      "can nhac",
      "phan tich",
      "danh gia",
      "hinh dung",
      "tuong tuong",
      "ghi nho",
      "nho lai",
      "quen",
      "hieu",
      "tim hieu",
      "kham pha",
      "nghi ngo",
      "tin tuong",
      "quyet dinh",
      "du doan",
      "tu duy",
    ],
  },
  {
    code: "trang-thai-tam-ly",
    nameVi: "Trạng thái – tâm lý",
    nameEn: "Mental States",
    group: "verb",
    keywords: [
      "yeu",
      "ghet",
      "thich",
      "khong thich",
      "chiu dung",
      "chiu dung duoc",
      "cam thay",
      "cam nhan",
      "tu hao",
      "hoi hop",
      "hoang so",
      "so hai",
      "tu tin",
      "tuyet vong",
      "hi vong",
      "mong cho",
      "tiet nuoi",
      "an han",
      "an ui",
      "oan han",
      "phan nan",
      "bi quan",
    ],
    oldNames: ["cam xuc"],
  },
  {
    code: "cong-viec-ky-thuat",
    nameVi: "Công việc – thao tác kỹ thuật",
    nameEn: "Work & Technical Actions",
    group: "verb",
    keywords: [
      "lap dat",
      "lap trinh",
      "van hanh",
      "kiem tra",
      "sua chua",
      "bao tri",
      "giam sat",
      "quan ly",
      "to chuc",
      "phoi hop",
      "ban giao",
      "ky ket",
      "thuc hien",
      "trien khai",
      "thi cong",
      "thi nghiem",
      "thu nghiem",
      "phan hoi ky thuat",
      "thao tac",
      "lam viec",
      "xu ly",
      "dieu khien",
      "van hanh",
    ],
    oldNames: ["cong viec"],
  },
  {
    code: "hoc-tap-luyen-tap",
    nameVi: "Học tập & luyện tập",
    nameEn: "Learning & Practice",
    group: "verb",
    keywords: [
      "hoc",
      "hoc tap",
      "ren luyen",
      "on tap",
      "on bai",
      "luyen chu",
      "luyen phat am",
      "lam bai",
      "thi",
      "kiem tra",
      "thuc hanh",
      "nghien cuu",
      "doc sach",
      "ghi chu",
      "tham gia lop",
      "thuc tap",
      "lam bai tap",
      "tot nghiep",
      "hoan thanh",
      "ket thuc",
      "thi tot nghiep",
    ],
    oldNames: ["so thich"],
  },
  {
    code: "sinh-hoat-hang-ngay",
    nameVi: "Sinh hoạt hằng ngày",
    nameEn: "Daily Routine",
    group: "verb",
    keywords: [
      "don dep",
      "ve sinh",
      "quet nha",
      "lau nha",
      "giat do",
      "phoi do",
      "lau chen",
      "nau an",
      "di cho",
      "doc bao",
      "xem phim",
      "xem tv",
      "choi the thao",
      "tap gym",
      "uom cay",
      "choi nhac",
      "san soc",
      "tan huong",
      "thu gian",
    ],
    oldNames: ["the thao", "so thich"],
  },
  {
    code: "tinh-chat-mo-ta",
    nameVi: "Tính chất mô tả",
    nameEn: "Descriptive Traits",
    group: "adjective",
    keywords: [
      "dep",
      "xau",
      "cao",
      "thap",
      "ron rang",
      "yen lang",
      "rong",
      "hep",
      "sach",
      "ban",
      "man",
      "ngot",
      "dang",
      "chua",
      "mem",
      "cung",
      "ben",
      "mong",
      "day",
      "nhe",
      "nang",
      "tinh te",
      "tho",
      "em dem",
      "vu ng ve",
      "vung ve",
      "go ghe",
      "loi lom",
      "khac",
      "chia lia",
      "kho chiu",
      "chuong",
      "ky quac",
      "tranh",
      "boc lot",
      "loi dung",
      "khong chi",
      "ngang nhau",
      "bi tham",
      "thuc te",
      "kho khan",
      "de dang",
      "nhanh chong",
      "cham chap",
      "thong minh",
      "ngu dot",
      "hieu biet",
      "van minh",
      "tho so",
      "tien tien",
      "hien dai",
      "co xua",
      "tram",
      "on ao",
      "yen tinh",
      "im lang",
      "sang suot",
      "mo mo",
      "ro rang",
    ],
  },
  {
    code: "cam-xuc-tinh-than",
    nameVi: "Cảm xúc & trạng thái tinh thần",
    nameEn: "Emotional States",
    group: "adjective",
    keywords: [
      "vui",
      "buon",
      "biet on",
      "lo lang",
      "hoi hop",
      "nong nay",
      "binh tinh",
      "hao hung",
      "nhao nhac",
      "co don",
      "doi phuong",
      "tho o",
      "tich cuc",
      "tieu cuc",
      "chan nan",
      "hung phan",
      "bi tham",
      "bi quan",
      "vu ng ve",
      "vung ve",
      "oan han",
      "phan nan",
      "an han",
      "an ui",
      "buon ba",
      "dau kho",
      "hai long",
      "bat binh",
      "thu hien",
      "kinh trong",
      "than phuc",
    ],
  },
  {
    code: "hinh-dang-kich-thuoc",
    nameVi: "Hình dạng & kích thước",
    nameEn: "Shape & Size",
    group: "adjective",
    keywords: [
      "tron",
      "vuong",
      "tam giac",
      "dai",
      "ngan",
      "rong",
      "hep",
      "cao",
      "thap",
      "nho",
      "lon",
      "mini",
      "khong lo",
      "vi mo",
      "khoi",
      "phang",
      "cong",
      "lech",
      "loi lom",
      "go ghe",
      "rang cuoc",
    ],
  },
  {
    code: "mau-sac",
    nameVi: "Màu sắc",
    nameEn: "Colors",
    group: "adjective",
    keywords: [
      "mau",
      "do",
      "xanh",
      "vang",
      "tim",
      "hong",
      "cam",
      "den",
      "trang",
      "nau",
      "xam",
      "bac",
      "vang anh",
      "anh kim",
      "da cam",
      "luc",
      "lam",
      "chanh",
    ],
    oldNames: ["mau sac"],
  },
  {
    code: "muc-do-so-sanh",
    nameVi: "Mức độ & so sánh",
    nameEn: "Degree & Comparison",
    group: "adjective",
    keywords: [
      "hon",
      "kem",
      "tuong duong",
      "nhat",
      "nhi",
      "rat",
      "cuc ky",
      "vo cung",
      "vua phai",
      "it",
      "nhieu",
      "hon nua",
      "doi chut",
      "gan nhu",
      "xu huong",
      "tang",
      "giam",
      "hon han",
    ],
  },
  {
    code: "so-luong-dem",
    nameVi: "Số lượng & số đếm",
    nameEn: "Numbers & Quantity",
    group: "special",
    keywords: [
      "so",
      "so dem",
      "thu tu",
      "thu nhat",
      "thu hai",
      "phan tram",
      "phan so",
      "phan loai",
      "doi",
      "cap",
      "chu so",
      "thap phan",
      "don vi",
      "so le",
      "le chan",
      "khoi luong",
      "do dai",
      "dien tich",
      "the tich",
      "khong du",
      "khoang cach",
      "do rong",
      "chieu cao",
      "chieu rong",
      "chieu dai",
      "chieu sau",
    ],
    oldNames: ["so dem", "so luong"],
  },
  {
    code: "luong-tu",
    nameVi: "Lượng từ",
    nameEn: "Measure Words",
    group: "special",
    keywords: [
      "luong tu",
      "cai",
      "con",
      "vien",
      "mieng",
      "tam",
      "canh",
      "kien",
      "to",
      "mieng",
      "nguoi",
      "dong",
      "khoi",
      "chiec",
      "bo",
      "cap",
      "doi",
      "vien",
      "coc",
      "chen",
      "bat",
      "giot",
    ],
  },
  {
    code: "trang-tu",
    nameVi: "Trạng từ / phó từ",
    nameEn: "Adverbs",
    group: "special",
    keywords: [
      "rat",
      "kha",
      "hoi",
      "cam thay",
      "thuong",
      "thuong xuyen",
      "doi khi",
      "doi luc",
      "luon",
      "bao gio",
      "da",
      "dang",
      "sap",
      "se",
      "vua",
      "dang khi",
      "tung",
      "chua tung",
      "can",
      "phai",
      "khong can",
      "nhat thiet",
    ],
    oldNames: ["tu ngu phap"],
  },
  {
    code: "gioi-tu",
    nameVi: "Giới từ",
    nameEn: "Prepositions",
    group: "special",
    keywords: [
      "trong",
      "ngoai",
      "tren",
      "duoi",
      "giua",
      "ben",
      "gan",
      "xa",
      "truoc",
      "sau",
      "ben trai",
      "ben phai",
      "doi dien",
      "xung quanh",
      "ke ben",
      "xuyen qua",
      "dinh",
      "vao",
      "ra",
      "can cu theo",
      "can cu",
      "dua theo",
      "theo",
      "tu",
      "den",
      "ve",
      "o",
      "tai",
      "bang",
      "voi",
      "cho",
      "vi",
      "do",
      "boi",
      "nhu",
      "giong nhu",
    ],
    oldNames: ["phuong huong"],
  },
  {
    code: "lien-tu",
    nameVi: "Liên từ",
    nameEn: "Conjunctions",
    group: "special",
    keywords: [
      "va",
      "nhung",
      "tuy nhien",
      "song",
      "nhung ma",
      "neu",
      "neu nhu",
      "neu khong",
      "khi",
      "khi nao",
      "boi vi",
      "vi",
      "do do",
      "vi the",
      "vi vay",
      "mac du",
      "dan den",
      "ca hai",
      "mot khi",
    ],
    oldNames: ["tu ngu phap"],
  },
  {
    code: "tro-tu",
    nameVi: "Trợ từ",
    nameEn: "Particles",
    group: "special",
    keywords: [
      "a",
      "ba",
      "ma",
      "ne",
      "da",
      "de",
      "le",
      "la",
      "co",
      "chinh la",
      "thi",
      "ay",
      "co ma",
      "thoi",
      "nay",
      "ay ma",
      "thoi ma",
      "khong",
      "phai",
      "can",
      "khong duoc",
      "khong the khong",
      "khong du",
      "duoc",
      "khong the",
      "bat buoc",
      "nhat dinh",
      "chang le",
      "chang phai",
    ],
  },
  {
    code: "hu-tu-tro-ngu-khi",
    nameVi: "Hư từ / trợ ngữ khí",
    nameEn: "Modal Particles",
    group: "special",
    keywords: [
      "nhe",
      "thoi",
      "co the",
      "nen",
      "nhat dinh",
      "co le",
      "co khi",
      "hinh nhu",
      "sao",
      "chu",
      "co ma",
      "ma nhi",
      "a nha",
      "nha",
      "chu nhi",
      "thoi nhi",
    ],
  },
  {
    code: "than-tu",
    nameVi: "Thán từ / cảm thán",
    nameEn: "Interjections",
    group: "special",
    keywords: [
      "oi",
      "troi oi",
      "a",
      "ui",
      "oi troi",
      "chao oi",
      "ay da",
      "hey",
      "này",
      "a ha",
      "wow",
      "haizz",
      "ai cha",
      "chep",
      "ha",
      "ack",
      "iu cha",
    ],
    oldNames: ["tu cam than"],
  },
  {
    code: "tu-tuong-thanh",
    nameVi: "Từ tượng thanh – tượng hình",
    nameEn: "Onomatopoeia",
    group: "special",
    keywords: [
      "leng keng",
      "ro ro",
      "ro rang",
      "am am",
      "am i",
      "ro rang",
      "xao xac",
      "ri rit",
      "ro rang",
      "loang xoang",
      "leng keng",
      "leng keng",
      "loang choang",
      "cach cach",
      "ro rang",
      "vut",
      "vim",
      "vut mot",
    ],
  },
  {
    code: "mua-sam-giao-dich",
    nameVi: "Mua sắm & giao dịch",
    nameEn: "Shopping & Transactions",
    group: "situation",
    keywords: [
      "mua sam",
      "mua ban",
      "thuong luong",
      "tra gia",
      "xu ly don",
      "thanh toan",
      "giao dich",
      "tra gop",
      "uu dai",
      "khuyen mai",
      "giam gia",
      "hoa don",
      "bien lai",
      "doi tra",
      "bao hanh",
      "doi hang",
      "chinh sach",
      "thu cua hang",
    ],
  },
  {
    code: "truong-lop",
    nameVi: "Trường học & lớp học",
    nameEn: "School & Classroom",
    group: "situation",
    keywords: [
      "truong",
      "lop",
      "phong hoc",
      "thay co",
      "hoc sinh",
      "sinh vien",
      "giao an",
      "bai giang",
      "hoc lieu",
      "thu vien",
      "ky thi",
      "ki thi",
      "tong ket",
      "ho so hoc tap",
      "giang duong",
      "ky tuc xa",
      "ban hoc",
      "ghe hoc",
      "ban thu vien",
    ],
  },
  {
    code: "cong-viec-van-phong",
    nameVi: "Công việc & văn phòng",
    nameEn: "Office & Worklife",
    group: "situation",
    keywords: [
      "van phong",
      "hop",
      "lich hop",
      "lich lam viec",
      "lich bieu",
      "du an",
      "bao cao",
      "ke hoach",
      "chien luoc",
      "ban giao",
      "ky ket",
      "bao cao tien do",
      "thanh tich",
      "danh gia",
      "muc tieu",
      "nhan su",
      "bo phan",
      "phong ban",
      "huan luyen",
    ],
  },
  {
    code: "suc-khoe-benh",
    nameVi: "Sức khỏe & bệnh",
    nameEn: "Health & Illness",
    group: "situation",
    keywords: [
      "suc khoe",
      "benh",
      "trieu chung",
      "khai bao",
      "kham",
      "chu benh",
      "thuoc",
      "phuong phap",
      "phau thuat",
      "xet nghiem",
      "du phong",
      "che do an",
      "dinh duong",
      "phuc hoi",
      "tiem",
      "vac xin",
      "kiem tra dinh ky",
      "y te",
      "ung thu",
      "cam cum",
    ],
    oldNames: ["suc khoe"],
  },
  {
    code: "quan-he-ung-xu",
    nameVi: "Mối quan hệ xã hội & ứng xử",
    nameEn: "Relationships & Etiquette",
    group: "situation",
    keywords: [
      "ung xu",
      "ung xu xa hoi",
      "giao tiep",
      "phong cach",
      "phep tac",
      "ton trong",
      "lich su",
      "ket ban",
      "ket noi",
      "giup do",
      "hop tac",
      "chia se",
      "dong cam",
      "lang nghe",
      "giai quyet xung dot",
      "thau hieu",
      "doi thoai",
    ],
    oldNames: ["cam xuc"],
  },
  {
    code: "van-hoa-le-nghi",
    nameVi: "Văn hóa – thói quen – lễ nghi",
    nameEn: "Culture & Customs",
    group: "situation",
    keywords: [
      "van hoa",
      "le hoi",
      "truyen thong",
      "le nghia",
      "tap quan",
      "thoi quen",
      "nghi le",
      "hon le",
      "tang le",
      "tet",
      "tet nguyen dan",
      "tet trung thu",
      "cuoi hoi",
      "an hoi",
      "cuoi xin",
      "dau nam",
      "cuoi nam",
      "nghi le quoc gia",
    ],
    oldNames: ["van hoa"],
  },
];

const RAW_OLD_CATEGORY_HINTS: Record<string, OldCategoryHint> = {
  "đồ ăn & thức uống": { code: "thuc-pham-do-uong" },
  "thời gian": { group: "noun" },
  "danh từ": { group: "noun" },
  "động vật": { code: "dong-vat" },
  "cây cối": { code: "thuc-vat" },
  "thời tiết": { code: "hien-tuong-tu-nhien" },
  "động từ": { group: "verb" },
  "tính từ": { group: "adjective" },
  "sức khỏe": { code: "suc-khoe-benh" },
  "sở thích": { code: "sinh-hoat-hang-ngay" },
  "cảm xúc": { code: "cam-xuc-tinh-than" },
  "phương tiện": { code: "di-chuyen-giao-thong" },
  "mua sắm": { code: "mua-sam-giao-dich" },
  "gia đình": { code: "gia-dinh" },
  "màu sắc": { code: "mau-sac" },
  "công việc": { group: "verb" },
  "thể thao": { code: "sinh-hoat-hang-ngay" },
  "hành động": { code: "hanh-dong-co-ban" },
  "quần áo": { code: "quan-ao-phu-kien" },
  "cơ thể": { code: "bo-phan-co-the" },
  "từ cảm thán": { code: "than-tu" },
  "phương hướng": { code: "gioi-tu" },
  "từ ngữ pháp": { group: "special" },
  "văn hóa": { code: "van-hoa-le-nghi" },
  "khoa học": { code: "cong-nghe-truyen-thong" },
  "kinh tế": { code: "tien-tai-chinh" },
  "chính trị": { code: "su-kien-xa-hoi" },
  "công nghệ": { code: "cong-nghe-truyen-thong" },
  "địa điểm": { code: "dia-diem" },
  "từ trừu tượng": { code: FALLBACK_CODE },
  "số đếm & số lượng": { code: "so-luong-dem" },
};

const LEGACY_CATEGORY_NAMES = [
  "Đồ ăn & thức uống",
  "Thời gian",
  "Danh từ",
  "Động vật",
  "Cây cối",
  "Thời tiết",
  "Động từ",
  "Tính từ",
  "Sức khỏe",
  "Sở thích",
  "Cảm xúc",
  "Phương tiện",
  "Mua sắm",
  "Gia đình",
  "Màu sắc",
  "Công việc",
  "Thể thao",
  "Hành động",
  "Quần áo",
  "Cơ thể",
  "Từ cảm thán",
  "Phương hướng",
  "Từ ngữ pháp",
  "Văn hóa",
  "Khoa học",
  "Kinh tế",
  "Chính trị",
  "Công nghệ",
  "Địa điểm",
  "Từ trừu tượng",
  "Số đếm & Số lượng",
];

const LEGACY_CATEGORY_SET = new Set(LEGACY_CATEGORY_NAMES.map((name) => normalize(name)));

const NORMALIZED_OLD_HINTS: Record<string, OldCategoryHint> = Object.fromEntries(
  Object.entries(RAW_OLD_CATEGORY_HINTS).map(([key, value]) => [normalize(key), value])
);

const CATEGORY_DEFS_BY_CODE = Object.fromEntries(
  CATEGORY_DEFINITIONS.map((def) => [def.code, def])
);

type DetectionContext = {
  meaning: string;
  paddedMeaning: string;
  words: string[];
  chinese: string;
};

const ANIMAL_EXCEPTIONS = new Set(["duong", "nguoi", "nguoi", "duong pho", "duong sat"]);
const BODY_PART_WORDS = new Set([
  "dau",
  "mat",
  "mui",
  "mieng",
  "tai",
  "co",
  "vai",
  "lung",
  "nguc",
  "bung",
  "chan",
  "tay",
  "ban tay",
  "ban chan",
  "ngon tay",
  "ngon chan",
  "tim",
  "gan",
  "phoi",
  "da",
  "xuong",
  "long",
  "toc",
  "bim",
  "mat ca",
  "mat",
  "mat ngu",
]);

const DETECTOR_RULES: Array<{ code: string; test: (ctx: DetectionContext) => boolean }> = [
  {
    code: "truong-lop",
    test: ({ paddedMeaning, chinese }) => {
      if (/[校学班课堂室讲题试考]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" truong hoc ") ||
        paddedMeaning.includes(" lop hoc ") ||
        paddedMeaning.includes(" phong hoc ") ||
        paddedMeaning.includes(" giao vien ") ||
        paddedMeaning.includes(" hoc sinh ") ||
        paddedMeaning.includes(" bai tap ") ||
        paddedMeaning.includes(" ky thi ") ||
        paddedMeaning.includes(" ki thi ") ||
        paddedMeaning.includes(" thi cu ") ||
        paddedMeaning.includes(" thu vien ") ||
        paddedMeaning.includes(" giao trinh ") ||
        paddedMeaning.includes(" ky tuc xa ")
      );
    },
  },
  {
    code: "nha-noi-that",
    test: ({ paddedMeaning, chinese }) => {
      if (/[房屋室厅床柜窗门]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" phong khach ") ||
        paddedMeaning.includes(" phong ngu ") ||
        paddedMeaning.includes(" phong tam ") ||
        paddedMeaning.includes(" nha bep ") ||
        paddedMeaning.includes(" nha ve sinh ") ||
        paddedMeaning.includes(" toilet ") ||
        paddedMeaning.includes(" sofa ") ||
        paddedMeaning.includes(" giuong ") ||
        paddedMeaning.includes(" tu ao ") ||
        paddedMeaning.includes(" tu giay ") ||
        paddedMeaning.includes(" ban an ") ||
        paddedMeaning.includes(" den trang tri ") ||
        paddedMeaning.includes(" ban cong ") ||
        paddedMeaning.includes(" mai nha ")
      );
    },
  },
  {
    code: "people-relations",
    test: ({ paddedMeaning, chinese }) => {
      if (/[友朋伴侣伙众客邻同伴]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" ban be ") ||
        paddedMeaning.includes(" ban than ") ||
        paddedMeaning.includes(" ban hoc ") ||
        paddedMeaning.includes(" dong nghiep ") ||
        paddedMeaning.includes(" doi tac ") ||
        paddedMeaning.includes(" khach hang ") ||
        paddedMeaning.includes(" khach ") ||
        paddedMeaning.includes(" hang xom ") ||
        paddedMeaning.includes(" thanh vien ") ||
        paddedMeaning.includes(" cong dong ") ||
        paddedMeaning.includes(" nhan vien ") ||
        paddedMeaning.includes(" doi ngu ")
      );
    },
  },
  {
    code: "sinh-hoat-hang-ngay",
    test: ({ paddedMeaning }) => {
      return (
        paddedMeaning.includes(" don dep ") ||
        paddedMeaning.includes(" ve sinh ") ||
        paddedMeaning.includes(" lau nha ") ||
        paddedMeaning.includes(" quet nha ") ||
        paddedMeaning.includes(" giat do ") ||
        paddedMeaning.includes(" phoi do ") ||
        paddedMeaning.includes(" lau chen ") ||
        paddedMeaning.includes(" rua chen ") ||
        paddedMeaning.includes(" nau an ") ||
        paddedMeaning.includes(" nau com ") ||
        paddedMeaning.includes(" di cho ") ||
        paddedMeaning.includes(" xem phim ") ||
        paddedMeaning.includes(" xem tv ") ||
        paddedMeaning.includes(" sac ") ||
        paddedMeaning.includes(" ham ") ||
        paddedMeaning.includes(" cat ") ||
        paddedMeaning.includes(" pha ") ||
        paddedMeaning.includes(" choi nhac ") ||
        paddedMeaning.includes(" uom cay ") ||
        paddedMeaning.includes(" thu gian ")
      );
    },
  },
  {
    code: "su-kien-xa-hoi",
    test: ({ paddedMeaning, chinese }) => {
      if (/[会战节庆典疫潮]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" su kien ") ||
        paddedMeaning.includes(" le hoi ") ||
        paddedMeaning.includes(" hoi nghi ") ||
        paddedMeaning.includes(" cuoc hop ") ||
        paddedMeaning.includes(" bieu tinh ") ||
        paddedMeaning.includes(" chien tranh ") ||
        paddedMeaning.includes(" phong trao ") ||
        paddedMeaning.includes(" van dong ") ||
        paddedMeaning.includes(" khung hoang ") ||
        paddedMeaning.includes(" dich benh ") ||
        paddedMeaning.includes(" dai dich ")
      );
    },
  },
  {
    code: "mua-sam-giao-dich",
    test: ({ paddedMeaning, chinese }) => {
      if (/[购卖商店市集价折账购销]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" mua sam ") ||
        paddedMeaning.includes(" mua hang ") ||
        paddedMeaning.includes(" ban hang ") ||
        paddedMeaning.includes(" cua hang ") ||
        paddedMeaning.includes(" sieu thi ") ||
        paddedMeaning.includes(" cho ") ||
        paddedMeaning.includes(" gia ban ") ||
        paddedMeaning.includes(" gia mua ") ||
        paddedMeaning.includes(" giao dich ") ||
        paddedMeaning.includes(" thuong mai ") ||
        paddedMeaning.includes(" thanh toan ") ||
        paddedMeaning.includes(" hoa don ") ||
        paddedMeaning.includes(" giam gia ") ||
        paddedMeaning.includes(" khuyen mai ")
      );
    },
  },
  {
    code: "cong-viec-van-phong",
    test: ({ paddedMeaning, chinese }) => {
      if (/[办公室报表计划项目合同会议员工]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" van phong ") ||
        paddedMeaning.includes(" phong hop ") ||
        paddedMeaning.includes(" bao cao ") ||
        paddedMeaning.includes(" ke hoach ") ||
        paddedMeaning.includes(" du an ") ||
        paddedMeaning.includes(" hop dong ") ||
        paddedMeaning.includes(" ky ket ") ||
        paddedMeaning.includes(" lich hop ") ||
        paddedMeaning.includes(" lich lam viec ") ||
        paddedMeaning.includes(" nhan su ")
      );
    },
  },
  {
    code: "nghe-nghiep",
    test: ({ paddedMeaning, chinese }) => {
      if (/[师员士者家警医农工兵导员长]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" nghe nghiep ") ||
        paddedMeaning.includes(" nghe ") ||
        paddedMeaning.includes(" giao vien ") ||
        paddedMeaning.includes(" bac si ") ||
        paddedMeaning.includes(" y ta ") ||
        paddedMeaning.includes(" ky su ") ||
        paddedMeaning.includes(" cong nhan ") ||
        paddedMeaning.includes(" nong dan ") ||
        paddedMeaning.includes(" thu ky ") ||
        paddedMeaning.includes(" luat su ") ||
        paddedMeaning.includes(" phong vien ") ||
        paddedMeaning.includes(" dien vien ") ||
        paddedMeaning.includes(" quan doi ") ||
        paddedMeaning.includes(" canh sat ") ||
        paddedMeaning.includes(" doanh nhan ") ||
        paddedMeaning.includes(" giam doc ")
      );
    },
  },
  {
    code: "dong-vat",
    test: ({ words, chinese, paddedMeaning }) => {
      if (words[0] === "con" && words.length > 1 && !ANIMAL_EXCEPTIONS.has(words[1])) {
        return true;
      }
      if (/[狗猫牛羊马鸡鸭鹅鱼鸟猪虎龙蛇熊兔狼象狮龟鹿猴]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" dong vat ") ||
        paddedMeaning.includes(" thu cung ") ||
        paddedMeaning.includes(" thu hoang ") ||
        paddedMeaning.includes(" gia suc ") ||
        paddedMeaning.includes(" gia cam ")
      );
    },
  },
  {
    code: "thuc-vat",
    test: ({ words, chinese, paddedMeaning }) => {
      if (words[0] === "cay" && words.length > 1) {
        return true;
      }
      if (/[花草树木竹叶根果菜茶米麦]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" hoa ") ||
        paddedMeaning.includes(" la ") ||
        paddedMeaning.includes(" la cay ") ||
        paddedMeaning.includes(" la non ") ||
        paddedMeaning.includes(" re ") ||
        paddedMeaning.includes(" than cay ") ||
        paddedMeaning.includes(" rau ") ||
        paddedMeaning.includes(" trai ") ||
        paddedMeaning.includes(" qua ")
      );
    },
  },
  {
    code: "mau-sac",
    test: ({ words, chinese, paddedMeaning }) => {
      if (words[0] === "mau") {
        return true;
      }
      if (/[红蓝绿黄黑白紫粉橙棕灰银金]/.test(chinese)) {
        return true;
      }
      return paddedMeaning.includes(" mau ");
    },
  },
  {
    code: "bo-phan-co-the",
    test: ({ words, chinese, paddedMeaning }) => {
      if (BODY_PART_WORDS.has(words[0])) {
        return true;
      }
      if (/[手脚眼鼻口耳头心肝肺骨腿臂皮发牙舌背胸腹]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" co the ") ||
        paddedMeaning.includes(" bo phan ") ||
        paddedMeaning.includes(" xuong ") ||
        paddedMeaning.includes(" noi tang ")
      );
    },
  },
  {
    code: "gia-dinh",
    test: ({ paddedMeaning, chinese }) => {
      if (/[爸妈父母姐妹哥哥弟弟爷奶孙姑舅姨嫂媳婆公]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" gia dinh ") ||
        paddedMeaning.includes(" bo me ") ||
        paddedMeaning.includes(" cha me ") ||
        paddedMeaning.includes(" vo chong ") ||
        paddedMeaning.includes(" anh trai ") ||
        paddedMeaning.includes(" chi gai ") ||
        paddedMeaning.includes(" em trai ") ||
        paddedMeaning.includes(" em gai ") ||
        paddedMeaning.includes(" con trai ") ||
        paddedMeaning.includes(" con gai ")
      );
    },
  },
  {
    code: "thuc-pham-do-uong",
    test: ({ paddedMeaning, chinese }) => {
      if (/[饭米面菜肉鱼汤茶酒糖奶糕饼果菜蔬饮]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" com ") ||
        paddedMeaning.includes(" gao ") ||
        paddedMeaning.includes(" mi ") ||
        paddedMeaning.includes(" bun ") ||
        paddedMeaning.includes(" pho ") ||
        paddedMeaning.includes(" banh ") ||
        paddedMeaning.includes(" thit ") ||
        paddedMeaning.includes(" rau ") ||
        paddedMeaning.includes(" hoa qua ") ||
        paddedMeaning.includes(" trai cay ") ||
        paddedMeaning.includes(" nuoc ") ||
        paddedMeaning.includes(" tra ") ||
        paddedMeaning.includes(" ca phe ") ||
        paddedMeaning.includes(" sua ") ||
        paddedMeaning.includes(" bia ") ||
        paddedMeaning.includes(" ruou ")
      );
    },
  },
  {
    code: "quan-ao-phu-kien",
    test: ({ words, chinese, paddedMeaning }) => {
      const clothingTokens = new Set([
        "ao",
        "quan",
        "vay",
        "dam",
        "giay",
        "dep",
        "tat",
        "khan",
        "mu",
        "non",
        "that",
        "caravat",
        "that lung",
        "tui",
        "vi",
      ]);
      if (clothingTokens.has(words[0])) {
        return true;
      }
      if (/[衣服裤裙鞋袜帽领巾戴]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" quan ao ") ||
        paddedMeaning.includes(" ao so mi ") ||
        paddedMeaning.includes(" ao khoac ") ||
        paddedMeaning.includes(" ao len ") ||
        paddedMeaning.includes(" giay dep ") ||
        paddedMeaning.includes(" phu kien ")
      );
    },
  },
  {
    code: "do-hoc-tap",
    test: ({ paddedMeaning, chinese }) => {
      if (/[书本笔纸课校班习]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" sach ") ||
        paddedMeaning.includes(" vo ") ||
        paddedMeaning.includes(" tap ") ||
        paddedMeaning.includes(" but ") ||
        paddedMeaning.includes(" but chi ") ||
        paddedMeaning.includes(" thuoc ke ") ||
        paddedMeaning.includes(" compa ") ||
        paddedMeaning.includes(" bang ") ||
        paddedMeaning.includes(" lop hoc ") ||
        paddedMeaning.includes(" cap sach ")
      );
    },
  },
  {
    code: "dia-diem",
    test: ({ paddedMeaning, chinese }) => {
      if (/[馆院店楼室场站校城国村寺庙厦港]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" dia diem ") ||
        paddedMeaning.includes(" nha hang ") ||
        paddedMeaning.includes(" cua hang ") ||
        paddedMeaning.includes(" truong hoc ") ||
        paddedMeaning.includes(" benh vien ") ||
        paddedMeaning.includes(" cong vien ") ||
        paddedMeaning.includes(" thu vien ") ||
        paddedMeaning.includes(" sieu thi ") ||
        paddedMeaning.includes(" cho ") ||
        paddedMeaning.includes(" san bay ") ||
        paddedMeaning.includes(" ga ") ||
        paddedMeaning.includes(" ben xe ") ||
        paddedMeaning.includes(" khach san ") ||
        paddedMeaning.includes(" nha tho ") ||
        paddedMeaning.includes(" chua ")
      );
    },
  },
  {
    code: "tien-tai-chinh",
    test: ({ paddedMeaning, chinese }) => {
      if (/[钱价费税账贷款银利薪资购销]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" tien ") ||
        paddedMeaning.includes(" gia ") ||
        paddedMeaning.includes(" gia ca ") ||
        paddedMeaning.includes(" gia ban ") ||
        paddedMeaning.includes(" tai chinh ") ||
        paddedMeaning.includes(" ngan hang ") ||
        paddedMeaning.includes(" lai suat ") ||
        paddedMeaning.includes(" thu nhap ") ||
        paddedMeaning.includes(" chi phi ") ||
        paddedMeaning.includes(" hoa don ") ||
        paddedMeaning.includes(" thanh toan ") ||
        paddedMeaning.includes(" vay ") ||
        paddedMeaning.includes(" no ") ||
        paddedMeaning.includes(" tai san ")
      );
    },
  },
  {
    code: "cong-nghe-truyen-thong",
    test: ({ paddedMeaning, chinese }) => {
      if (/[电脑网络讯息软硬件讯电媒视播程码]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" cong nghe ") ||
        paddedMeaning.includes(" ky thuat ") ||
        paddedMeaning.includes(" may tinh ") ||
        paddedMeaning.includes(" may chu ") ||
        paddedMeaning.includes(" dien thoai ") ||
        paddedMeaning.includes(" internet ") ||
        paddedMeaning.includes(" mang xa hoi ") ||
        paddedMeaning.includes(" wifi ") ||
        paddedMeaning.includes(" website ") ||
        paddedMeaning.includes(" ung dung ") ||
        paddedMeaning.includes(" phan mem ")
      );
    },
  },
  {
    code: "thien-nhien-moi-truong",
    test: ({ paddedMeaning, chinese }) => {
      if (/[山川河湖海林田气候环境]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" thien nhien ") ||
        paddedMeaning.includes(" moi truong ") ||
        paddedMeaning.includes(" khi hau ") ||
        paddedMeaning.includes(" bao ton ") ||
        paddedMeaning.includes(" o nhiem ") ||
        paddedMeaning.includes(" rung ") ||
        paddedMeaning.includes(" song ") ||
        paddedMeaning.includes(" bien ") ||
        paddedMeaning.includes(" ho ") ||
        paddedMeaning.includes(" sa mac ") ||
        paddedMeaning.includes(" dong bang ")
      );
    },
  },
  {
    code: "hien-tuong-tu-nhien",
    test: ({ paddedMeaning, chinese }) => {
      if (/[雨雪风雷雾震波温潮]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" mua ") ||
        paddedMeaning.includes(" gio ") ||
        paddedMeaning.includes(" tuyet ") ||
        paddedMeaning.includes(" suong ") ||
        paddedMeaning.includes(" bao ") ||
        paddedMeaning.includes(" loc ") ||
        paddedMeaning.includes(" dong dat ") ||
        paddedMeaning.includes(" nui lua ") ||
        paddedMeaning.includes(" song than ") ||
        paddedMeaning.includes(" ap thap ") ||
        paddedMeaning.includes(" ap cao ")
      );
    },
  },
  {
    code: "so-luong-dem",
    test: ({ words, chinese, paddedMeaning }) => {
      if (/^[零一二三四五六七八九十百千万亿\d]+$/.test(chinese)) {
        return true;
      }
      return (
        words[0] === "so" ||
        words[0] === "thu" ||
        words[0] === "phan" ||
        paddedMeaning.includes(" phan tram ") ||
        paddedMeaning.includes(" phan so ") ||
        words[0] === "lan" ||
        words[0] === "khap" ||
        paddedMeaning.includes(" toan bo ")
      );
    },
  },
  {
    code: "luong-tu",
    test: ({ words, paddedMeaning }) => {
      const measureWords = new Set([
        "cai",
        "chiec",
        "quyen",
        "cuon",
        "to",
        "tam",
        "vien",
        "mieng",
        "chut",
        "giot",
        "cap",
        "doi",
        "nguoi",
        "con",
        "cay",
        "bo",
      ]);
      return (
        measureWords.has(words[0]) ||
        paddedMeaning.includes(" luong tu ") ||
        paddedMeaning.includes(" don vi ")
      );
    },
  },
  {
    code: "suc-khoe-benh",
    test: ({ paddedMeaning, chinese }) => {
      if (/[病疾癌症医药疗检疫康]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" benh ") ||
        paddedMeaning.includes(" ung thu ") ||
        paddedMeaning.includes(" trieu chung ") ||
        paddedMeaning.includes(" dau ") ||
        paddedMeaning.includes(" dau nhuc ") ||
        paddedMeaning.includes(" thuoc ") ||
        paddedMeaning.includes(" chua tri ") ||
        paddedMeaning.includes(" phau thuat ") ||
        paddedMeaning.includes(" kham ") ||
        paddedMeaning.includes(" vac xin ")
      );
    },
  },
  {
    code: "tro-tu",
    test: ({ paddedMeaning, chinese }) => {
      if (/[了着过吧呢吗嘛啊呀哇啦呗]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" da ") ||
        paddedMeaning.includes(" roi ") ||
        paddedMeaning.includes(" thoi ") ||
        paddedMeaning.includes(" day ") ||
        paddedMeaning.includes(" ay ") ||
        paddedMeaning.includes(" nhi ") ||
        paddedMeaning.includes(" chu ")
      );
    },
  },
  {
    code: "trang-tu",
    test: ({ paddedMeaning }) => {
      return (
        paddedMeaning.includes(" rat ") ||
        paddedMeaning.includes(" kha ") ||
        paddedMeaning.includes(" hoi ") ||
        paddedMeaning.includes(" thuong ") ||
        paddedMeaning.includes(" luon ") ||
        paddedMeaning.includes(" da ") ||
        paddedMeaning.includes(" dang ") ||
        paddedMeaning.includes(" sap ") ||
        paddedMeaning.includes(" vua ") ||
        paddedMeaning.includes(" tung ") ||
        paddedMeaning.includes(" chua tung ") ||
        paddedMeaning.includes(" khong can ")
      );
    },
  },
  {
    code: "lien-tu",
    test: ({ paddedMeaning }) => {
      return (
        paddedMeaning.includes(" va ") ||
        paddedMeaning.includes(" nhung ") ||
        paddedMeaning.includes(" tuy nhien ") ||
        paddedMeaning.includes(" boi vi ") ||
        paddedMeaning.includes(" nen ") ||
        paddedMeaning.includes(" vi vay ") ||
        paddedMeaning.includes(" do do ") ||
        paddedMeaning.includes(" neu ") ||
        paddedMeaning.includes(" hoac ") ||
        paddedMeaning.includes(" het ") ||
        paddedMeaning.includes(" ca ")
      );
    },
  },
  {
    code: "gioi-tu",
    test: ({ paddedMeaning, chinese }) => {
      if (/[在到从向往离跟于把被对]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" trong ") ||
        paddedMeaning.includes(" ngoai ") ||
        paddedMeaning.includes(" tren ") ||
        paddedMeaning.includes(" duoi ") ||
        paddedMeaning.includes(" giua ") ||
        paddedMeaning.includes(" ben ") ||
        paddedMeaning.includes(" gan ") ||
        paddedMeaning.includes(" xa ") ||
        paddedMeaning.includes(" truoc ") ||
        paddedMeaning.includes(" sau ") ||
        paddedMeaning.includes(" ben trai ") ||
        paddedMeaning.includes(" ben phai ") ||
        paddedMeaning.includes(" xung quanh ") ||
        paddedMeaning.includes(" ke ben ") ||
        paddedMeaning.includes(" can cu theo ") ||
        paddedMeaning.includes(" can cu ") ||
        paddedMeaning.includes(" dua theo ") ||
        paddedMeaning.includes(" theo ") ||
        paddedMeaning.includes(" tu ") ||
        paddedMeaning.includes(" den ") ||
        paddedMeaning.includes(" ve ") ||
        paddedMeaning.includes(" o ") ||
        paddedMeaning.includes(" tai ") ||
        paddedMeaning.includes(" bang ") ||
        paddedMeaning.includes(" voi ")
      );
    },
  },
  {
    code: "cam-xuc-tinh-than",
    test: ({ paddedMeaning }) => {
      return (
        paddedMeaning.includes(" bi tham ") ||
        paddedMeaning.includes(" bi quan ") ||
        paddedMeaning.includes(" vu ng ve ") ||
        paddedMeaning.includes(" vung ve ") ||
        paddedMeaning.includes(" oan han ") ||
        paddedMeaning.includes(" phan nan ")
      );
    },
  },
  {
    code: "giao-tiep",
    test: ({ paddedMeaning }) => {
      return (
        paddedMeaning.includes(" boc lo ") ||
        paddedMeaning.includes(" bo loc ") ||
        paddedMeaning.includes(" tiet lo ") ||
        paddedMeaning.includes(" cong bo ")
      );
    },
  },
  {
    code: "dia-diem",
    test: ({ paddedMeaning }) => {
      return (
        paddedMeaning.includes(" ranh gioi ") ||
        paddedMeaning.includes(" bien gioi ")
      );
    },
  },
  {
    code: "hu-tu-tro-ngu-khi",
    test: ({ paddedMeaning }) => {
      return (
        paddedMeaning.includes(" co le ") ||
        paddedMeaning.includes(" co the ") ||
        paddedMeaning.includes(" nen ") ||
        paddedMeaning.includes(" nhat dinh ") ||
        paddedMeaning.includes(" chac chan ") ||
        paddedMeaning.includes(" hinh nhu ") ||
        paddedMeaning.includes(" co ve ") ||
        paddedMeaning.includes(" e rang ")
      );
    },
  },
  {
    code: "than-tu",
    test: ({ paddedMeaning, chinese }) => {
      if (/[哎呀啊哦喂呦咦唉嗨嘿]/.test(chinese)) {
        return true;
      }
      return (
        paddedMeaning.includes(" oi ") ||
        paddedMeaning.includes(" troi oi ") ||
        paddedMeaning.includes(" a ") ||
        paddedMeaning.includes(" ui ") ||
        paddedMeaning.includes(" oi troi ") ||
        paddedMeaning.includes(" haizz ") ||
        paddedMeaning.includes(" ai cha ") ||
        paddedMeaning.includes(" wow ")
      );
    },
  },
  {
    code: "tu-tuong-thanh",
    test: ({ chinese }) => {
      return /[叮咚滴答哗啦隆隆轰隆嘎嘎咔嚓嗒嗒]/.test(chinese);
    },
  },
];

function normalize(input?: string | null): string {
  if (!input) {
    return "";
  }
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countKeywordMatches(texts: string[], keywords: string[]): number {
  if (!keywords.length) {
    return 0;
  }
  const paddedTexts = texts.map((text) => ` ${text} `);
  return keywords.reduce((count, keyword) => {
    const normalizedKeyword = ` ${keyword.trim()} `;
    const matched = paddedTexts.some((text) => text.includes(normalizedKeyword));
    return matched ? count + 1 : count;
  }, 0);
}

function detectCategoryCode(vocab: VocabWithCategory): string {
  const meaning = normalize(vocab.meaning_vn);
  const chinese = normalize(vocab.chinese_word);
  const pinyin = normalize(vocab.pinyin);
  const oldCategory = normalize(vocab.category?.name_vi || "");
  const textSources = [meaning, chinese, pinyin].filter(Boolean);

  if (!CATEGORY_DEFS_BY_CODE[FALLBACK_CODE]) {
    throw new Error(`Thiếu định nghĩa cho mã fallback "${FALLBACK_CODE}"`);
  }

  const useLegacyHint = USE_LEGACY_HINTS && oldCategory && LEGACY_CATEGORY_SET.has(oldCategory);
  const hint = useLegacyHint ? NORMALIZED_OLD_HINTS[oldCategory] : undefined;
  if (hint?.code && CATEGORY_DEFS_BY_CODE[hint.code]) {
    return hint.code;
  }

  const chineseRaw = (vocab.chinese_word || "").trim();
  const words = meaning.split(" ").filter(Boolean);
  const context: DetectionContext = {
    meaning,
    paddedMeaning: ` ${meaning} `,
    words,
    chinese: chineseRaw,
  };

  for (const detector of DETECTOR_RULES) {
    if (detector.test(context)) {
      return detector.code;
    }
  }

  let bestCode = FALLBACK_CODE;
  let bestScore = 0;

  for (const def of CATEGORY_DEFINITIONS) {
    let score = def.weight ?? 0;
    score += countKeywordMatches(textSources, def.keywords);

    if (def.chineseKeywords?.length) {
      score += def.chineseKeywords.reduce(
        (count, keyword) => (keyword && chineseRaw.includes(keyword) ? count + 1 : count),
        0
      );
    }

    if (score > bestScore) {
      bestScore = score;
      bestCode = def.code;
    }
  }

  return bestScore > 0 ? bestCode : FALLBACK_CODE;
}

async function main() {
  console.log("🔄 Đang tải toàn bộ từ vựng...");
  const vocabularies = (await prisma.vocabulary.findMany({
    select: {
      vocab_id: true,
      chinese_word: true,
      pinyin: true,
      meaning_vn: true,
      category: {
        select: {
          name_vi: true,
        },
      },
    },
  })) as VocabWithCategory[];

  console.log(`📚 Tổng số từ vựng: ${vocabularies.length}`);

  console.log("🧹 Đang xóa toàn bộ chủ đề hiện tại...");
  await prisma.vocabulary_categories.deleteMany();

  console.log("🆕 Đang tạo 48 chủ đề mới...");
  const categoriesByCode: Record<string, number> = {};
  for (const def of CATEGORY_DEFINITIONS) {
    const category = await prisma.vocabulary_categories.create({
      data: {
        name_vi: def.nameVi,
        name_en: def.nameEn,
      },
    });
    categoriesByCode[def.code] = category.id;
  }

  if (!categoriesByCode[FALLBACK_CODE]) {
    throw new Error("Không thể khởi tạo chủ đề fallback");
  }

  console.log("🗂️ Bắt đầu gán lại chủ đề cho từng từ vựng...");
  const batchSize = 200;
  const stats: Record<string, number> = {};

  for (let i = 0; i < vocabularies.length; i += batchSize) {
    const batch = vocabularies.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (vocab) => {
        const code = detectCategoryCode(vocab);
        const categoryId = categoriesByCode[code] || categoriesByCode[FALLBACK_CODE];
        stats[code] = (stats[code] || 0) + 1;
        await prisma.vocabulary.updateMany({
          where: { vocab_id: vocab.vocab_id },
          data: { category_id: categoryId },
        });
      })
    );
    console.log(`  → Đã xử lý ${Math.min(i + batchSize, vocabularies.length)} / ${vocabularies.length} từ`);
  }

  console.log("✅ Hoàn tất gán chủ đề mới.");
  console.log("📊 Thống kê phân bố:");
  const orderedStats = Object.entries(stats).sort(
    (a, b) => (CATEGORY_DEFS_BY_CODE[b[0]]?.group ?? "").localeCompare(CATEGORY_DEFS_BY_CODE[a[0]]?.group ?? "")
  );
  for (const [code, count] of orderedStats) {
    const label = CATEGORY_DEFS_BY_CODE[code]?.nameVi || code;
    console.log(` - ${label}: ${count} từ`);
  }
}

main()
  .catch((error) => {
    console.error("❌ Lỗi khi tái cấu trúc chủ đề từ vựng:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

