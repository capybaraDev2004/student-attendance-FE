try:
    import requests
    import random
    import re
    from deep_translator import GoogleTranslator
except ImportError as e:
    print(f"❌ Thiếu package: {e}")
    print("📦 Vui lòng cài đặt: pip install requests deep-translator")
    exit(1)

# --- 1. Cấu hình ---
OUTPUT_FILE = "insert_vocabulary_real.sql"
CATEGORIES = [
    "Chào hỏi", "Gia đình", "Thức ăn & đồ uống", "Động vật", "Màu sắc",
    "Thời tiết", "Cơ thể người", "Số đếm", "Thời gian", "Địa điểm",
    "Công việc", "Trường học", "Giao thông", "Mua sắm", "Thể thao",
    "Cảm xúc", "Công nghệ"
]

# --- 2. Dữ liệu từ vựng phong phú ---
print("🔄 Đang tải dữ liệu từ vựng...")

# Dữ liệu từ vựng phong phú hơn
vocabulary_data = [
    # Chào hỏi
    ("你好", "ni3 hao3", "hello"),
    ("再见", "zai4 jian4", "goodbye"),
    ("谢谢", "xie4 xie5", "thank you"),
    ("不客气", "bu4 ke4 qi5", "you're welcome"),
    ("对不起", "dui4 bu4 qi3", "sorry"),
    ("没关系", "mei2 guan1 xi5", "it's okay"),
    ("早上好", "zao3 shang4 hao3", "good morning"),
    ("晚上好", "wan3 shang4 hao3", "good evening"),
    ("晚安", "wan3 an1", "good night"),
    ("请", "qing3", "please"),
    
    # Gia đình
    ("爸爸", "ba4 ba5", "father"),
    ("妈妈", "ma1 ma5", "mother"),
    ("哥哥", "ge1 ge5", "elder brother"),
    ("弟弟", "di4 di5", "younger brother"),
    ("姐姐", "jie3 jie5", "elder sister"),
    ("妹妹", "mei4 mei5", "younger sister"),
    ("爷爷", "ye2 ye5", "grandfather"),
    ("奶奶", "nai3 nai5", "grandmother"),
    ("儿子", "er2 zi5", "son"),
    ("女儿", "nv3 er2", "daughter"),
    ("丈夫", "zhang4 fu5", "husband"),
    ("妻子", "qi1 zi5", "wife"),
    ("家", "jia1", "home"),
    ("家庭", "jia1 ting2", "family"),
    
    # Thức ăn & đồ uống
    ("饭", "fan4", "rice"),
    ("面", "mian4", "noodles"),
    ("水", "shui3", "water"),
    ("茶", "cha2", "tea"),
    ("咖啡", "ka1 fei1", "coffee"),
    ("牛奶", "niu2 nai3", "milk"),
    ("面包", "mian4 bao1", "bread"),
    ("肉", "rou4", "meat"),
    ("鱼", "yu2", "fish"),
    ("鸡", "ji1", "chicken"),
    ("蛋", "dan4", "egg"),
    ("蔬菜", "shu1 cai4", "vegetables"),
    ("水果", "shui3 guo3", "fruit"),
    ("苹果", "ping2 guo3", "apple"),
    ("香蕉", "xiang1 jiao1", "banana"),
    ("橙子", "cheng2 zi5", "orange"),
    ("葡萄", "pu2 tao2", "grape"),
    ("西瓜", "xi1 gua1", "watermelon"),
    ("草莓", "cao3 mei2", "strawberry"),
    
    # Động vật
    ("猫", "mao1", "cat"),
    ("狗", "gou3", "dog"),
    ("鸟", "niao3", "bird"),
    ("鱼", "yu2", "fish"),
    ("马", "ma3", "horse"),
    ("牛", "niu2", "cow"),
    ("猪", "zhu1", "pig"),
    ("羊", "yang2", "sheep"),
    ("兔子", "tu4 zi5", "rabbit"),
    ("老虎", "lao3 hu3", "tiger"),
    ("狮子", "shi1 zi5", "lion"),
    ("大象", "da4 xiang4", "elephant"),
    ("熊", "xiong2", "bear"),
    ("猴子", "hou2 zi5", "monkey"),
    ("蛇", "she2", "snake"),
    ("蝴蝶", "hu2 die2", "butterfly"),
    ("蜜蜂", "mi4 feng1", "bee"),
    ("蚂蚁", "ma3 yi3", "ant"),
    ("蜘蛛", "zhi1 zhu1", "spider"),
    
    # Màu sắc
    ("红", "hong2", "red"),
    ("蓝", "lan2", "blue"),
    ("绿", "lv4", "green"),
    ("黄", "huang2", "yellow"),
    ("黑", "hei1", "black"),
    ("白", "bai2", "white"),
    ("紫", "zi3", "purple"),
    ("粉", "fen3", "pink"),
    ("橙", "cheng2", "orange"),
    ("棕", "zong1", "brown"),
    ("灰", "hui1", "gray"),
    ("银", "yin2", "silver"),
    ("金", "jin1", "gold"),
    
    # Thời tiết
    ("太阳", "tai4 yang2", "sun"),
    ("月亮", "yue4 liang4", "moon"),
    ("星星", "xing1 xing5", "star"),
    ("云", "yun2", "cloud"),
    ("雨", "yu3", "rain"),
    ("雪", "xue3", "snow"),
    ("风", "feng1", "wind"),
    ("雷", "lei2", "thunder"),
    ("闪电", "shan3 dian4", "lightning"),
    ("雾", "wu4", "fog"),
    ("热", "re4", "hot"),
    ("冷", "leng3", "cold"),
    ("暖", "nuan3", "warm"),
    ("凉", "liang2", "cool"),
    
    # Cơ thể người
    ("头", "tou2", "head"),
    ("手", "shou3", "hand"),
    ("脚", "jiao3", "foot"),
    ("眼睛", "yan3 jing1", "eye"),
    ("鼻子", "bi2 zi5", "nose"),
    ("嘴", "zui3", "mouth"),
    ("耳朵", "er3 duo5", "ear"),
    ("头发", "tou2 fa4", "hair"),
    ("脸", "lian3", "face"),
    ("脖子", "bo2 zi5", "neck"),
    ("肩膀", "jian1 bang3", "shoulder"),
    ("胸", "xiong1", "chest"),
    ("背", "bei4", "back"),
    ("腿", "tui3", "leg"),
    ("胳膊", "ge1 bo5", "arm"),
    
    # Số đếm
    ("一", "yi1", "one"),
    ("二", "er4", "two"),
    ("三", "san1", "three"),
    ("四", "si4", "four"),
    ("五", "wu3", "five"),
    ("六", "liu4", "six"),
    ("七", "qi1", "seven"),
    ("八", "ba1", "eight"),
    ("九", "jiu3", "nine"),
    ("十", "shi2", "ten"),
    ("百", "bai3", "hundred"),
    ("千", "qian1", "thousand"),
    ("万", "wan4", "ten thousand"),
    ("零", "ling2", "zero"),
    
    # Thời gian
    ("今天", "jin1 tian1", "today"),
    ("明天", "ming2 tian1", "tomorrow"),
    ("昨天", "zuo2 tian1", "yesterday"),
    ("现在", "xian4 zai4", "now"),
    ("以前", "yi3 qian2", "before"),
    ("以后", "yi3 hou4", "after"),
    ("早上", "zao3 shang4", "morning"),
    ("中午", "zhong1 wu3", "noon"),
    ("下午", "xia4 wu3", "afternoon"),
    ("晚上", "wan3 shang4", "evening"),
    ("年", "nian2", "year"),
    ("月", "yue4", "month"),
    ("日", "ri4", "day"),
    ("时", "shi2", "hour"),
    ("分", "fen1", "minute"),
    ("秒", "miao3", "second"),
    
    # Địa điểm
    ("家", "jia1", "home"),
    ("学校", "xue2 xiao4", "school"),
    ("医院", "yi1 yuan4", "hospital"),
    ("商店", "shang1 dian4", "store"),
    ("银行", "yin2 hang2", "bank"),
    ("公园", "gong1 yuan2", "park"),
    ("图书馆", "tu2 shu1 guan3", "library"),
    ("电影院", "dian4 ying3 yuan4", "cinema"),
    ("餐厅", "can1 ting1", "restaurant"),
    ("酒店", "jiu3 dian4", "hotel"),
    ("机场", "ji1 chang3", "airport"),
    ("车站", "che1 zhan4", "station"),
    ("城市", "cheng2 shi4", "city"),
    ("国家", "guo2 jia1", "country"),
    ("世界", "shi4 jie4", "world"),
    
    # Công việc
    ("老师", "lao3 shi1", "teacher"),
    ("医生", "yi1 sheng1", "doctor"),
    ("护士", "hu4 shi4", "nurse"),
    ("警察", "jing3 cha2", "police"),
    ("司机", "si1 ji1", "driver"),
    ("厨师", "chu2 shi1", "chef"),
    ("工人", "gong1 ren2", "worker"),
    ("农民", "nong2 min2", "farmer"),
    ("学生", "xue2 sheng1", "student"),
    ("老板", "lao3 ban3", "boss"),
    ("秘书", "mi4 shu1", "secretary"),
    ("工程师", "gong1 cheng2 shi1", "engineer"),
    ("律师", "lv4 shi1", "lawyer"),
    ("记者", "ji4 zhe3", "journalist"),
    ("艺术家", "yi4 shu4 jia1", "artist"),
    
    # Trường học
    ("书", "shu1", "book"),
    ("笔", "bi3", "pen"),
    ("纸", "zhi3", "paper"),
    ("桌子", "zhuo1 zi5", "table"),
    ("椅子", "yi3 zi5", "chair"),
    ("黑板", "hei1 ban3", "blackboard"),
    ("教室", "jiao4 shi4", "classroom"),
    ("办公室", "ban4 gong1 shi4", "office"),
    ("实验室", "shi2 yan4 shi4", "laboratory"),
    ("操场", "cao1 chang3", "playground"),
    ("食堂", "shi2 tang2", "cafeteria"),
    ("宿舍", "su4 she4", "dormitory"),
    ("考试", "kao3 shi4", "exam"),
    ("作业", "zuo4 ye4", "homework"),
    ("课程", "ke4 cheng2", "course"),
    
    # Giao thông
    ("车", "che1", "car"),
    ("公共汽车", "gong1 gong4 qi4 che1", "bus"),
    ("地铁", "di4 tie3", "subway"),
    ("火车", "huo3 che1", "train"),
    ("飞机", "fei1 ji1", "airplane"),
    ("船", "chuan2", "ship"),
    ("自行车", "zi4 xing2 che1", "bicycle"),
    ("摩托车", "mo2 tuo1 che1", "motorcycle"),
    ("出租车", "chu1 zu1 che1", "taxi"),
    ("卡车", "ka3 che1", "truck"),
    ("路", "lu4", "road"),
    ("桥", "qiao2", "bridge"),
    ("红绿灯", "hong2 lv4 deng1", "traffic light"),
    ("停车", "ting2 che1", "parking"),
    ("开车", "kai1 che1", "driving"),
    
    # Mua sắm
    ("钱", "qian2", "money"),
    ("买", "mai3", "buy"),
    ("卖", "mai4", "sell"),
    ("价格", "jia4 ge2", "price"),
    ("便宜", "pian2 yi5", "cheap"),
    ("贵", "gui4", "expensive"),
    ("商店", "shang1 dian4", "shop"),
    ("市场", "shi4 chang3", "market"),
    ("超市", "chao1 shi4", "supermarket"),
    ("购物", "gou4 wu4", "shopping"),
    ("付款", "fu4 kuan3", "payment"),
    ("找钱", "zhao3 qian2", "change"),
    ("信用卡", "xin4 yong4 ka3", "credit card"),
    ("现金", "xian4 jin1", "cash"),
    ("发票", "fa1 piao4", "receipt"),
    
    # Thể thao
    ("足球", "zu2 qiu2", "football"),
    ("篮球", "lan2 qiu2", "basketball"),
    ("网球", "wang3 qiu2", "tennis"),
    ("乒乓球", "ping1 pang1 qiu2", "ping pong"),
    ("游泳", "you2 yong3", "swimming"),
    ("跑步", "pao3 bu4", "running"),
    ("骑自行车", "qi2 zi4 xing2 che1", "cycling"),
    ("爬山", "pa2 shan1", "hiking"),
    ("滑雪", "hua3 xue3", "skiing"),
    ("滑冰", "hua2 bing1", "skating"),
    ("健身", "jian4 shen1", "fitness"),
    ("瑜伽", "yu2 jia1", "yoga"),
    ("拳击", "quan2 ji1", "boxing"),
    ("武术", "wu3 shu4", "martial arts"),
    ("比赛", "bi3 sai4", "competition"),
    
    # Cảm xúc
    ("高兴", "gao1 xing4", "happy"),
    ("难过", "nan2 guo4", "sad"),
    ("生气", "sheng1 qi4", "angry"),
    ("害怕", "hai4 pa4", "afraid"),
    ("惊讶", "jing1 ya4", "surprised"),
    ("担心", "dan1 xin1", "worried"),
    ("紧张", "jin3 zhang1", "nervous"),
    ("放松", "fang4 song1", "relaxed"),
    ("兴奋", "xing1 fen4", "excited"),
    ("累", "lei4", "tired"),
    ("困", "kun4", "sleepy"),
    ("饿", "e4", "hungry"),
    ("渴", "ke3", "thirsty"),
    ("疼", "teng2", "pain"),
    ("舒服", "shu1 fu5", "comfortable"),
    
    # Công nghệ
    ("电脑", "dian4 nao3", "computer"),
    ("手机", "shou3 ji1", "mobile phone"),
    ("电视", "dian4 shi4", "television"),
    ("网络", "wang3 luo4", "internet"),
    ("网站", "wang3 zhan4", "website"),
    ("邮件", "you2 jian4", "email"),
    ("软件", "ruan3 jian4", "software"),
    ("硬件", "ying4 jian4", "hardware"),
    ("数据", "shu4 ju4", "data"),
    ("信息", "xin4 xi1", "information"),
    ("程序", "cheng2 xu4", "program"),
    ("游戏", "you2 xi4", "game"),
    ("视频", "shi4 pin2", "video"),
    ("音频", "yin1 pin2", "audio"),
    ("图片", "tu2 pian4", "image"),
]

print(f"📊 Tổng số từ vựng có sẵn: {len(vocabulary_data)}")

# --- 3. Xử lý và loại trùng lặp ---
entries = []
seen_chinese = set()
seen_pinyin = set()
seen_meaning = set()

for chinese, pinyin, meaning_en in vocabulary_data:
    # Kiểm tra trùng lặp
    if chinese in seen_chinese or pinyin in seen_pinyin:
        continue
    
    entries.append((chinese, pinyin, meaning_en))
    seen_chinese.add(chinese)
    seen_pinyin.add(pinyin)

print(f"📊 Số từ vựng sau khi loại trùng: {len(entries)}")

# --- 4. Dịch nghĩa và tạo SQL ---
translator = GoogleTranslator(source="en", target="vi")

sql_lines = []
seen_vietnamese = set()

for i, (chinese, pinyin, meaning_en) in enumerate(entries):
    # Dịch sang tiếng Việt
    try:
        meaning_vi = translator.translate(meaning_en)
    except Exception:
        meaning_vi = meaning_en
    
    # Kiểm tra trùng nghĩa tiếng Việt
    if meaning_vi in seen_vietnamese:
        continue
    seen_vietnamese.add(meaning_vi)
    
    # Gán category (phân bố đều)
    category_id = (i % len(CATEGORIES)) + 1
    
    # Tạo SQL
    meaning_vi_escaped = meaning_vi.replace("'", "''")
    sql = (
        "INSERT INTO vocabulary (chinese_word, pinyin, meaning_vn, audio_url, lesson_id, category_id, part_of_speech) "
        f"VALUES ('{chinese}', '{pinyin}', '{meaning_vi_escaped}', '', NULL, {category_id}, '');"
    )
    sql_lines.append(sql)

print(f"📊 Số từ vựng cuối cùng: {len(sql_lines)}")

# --- 5. Lưu file ---
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print(f"✅ File SQL đã được tạo: {OUTPUT_FILE}")
print(f"📊 Tổng số câu SQL đã tạo: {len(sql_lines)}")
