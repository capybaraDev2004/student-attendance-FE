import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('Bắt đầu seed dữ liệu mẫu...')

  // Kiểm tra xem đã có dữ liệu chưa
  const existingLessons = await prisma.lessons.count()
  if (existingLessons > 0) {
    console.log('Dữ liệu đã tồn tại, bỏ qua seed.')
    return
  }

  // 1. Seed stages - Giai đoạn học tập
  console.log('Đang tạo stages...')
  const stagesData = [
    {
      name: 'Giai đoạn 1 – Làm quen tiếng Trung & Pinyin',
      description: 'Biết phát âm chuẩn (4 thanh điệu). Nhận biết cấu trúc âm tiết, từ loại, cách viết cơ bản.',
      duration_weeks: 3
    },
    {
      name: 'Giai đoạn 2 – HSK 1: Cơ bản giao tiếp',
      description: '~150 từ thông dụng. Hiểu câu cơ bản (chào hỏi, hỏi tên, tuổi, nghề, địa điểm).',
      duration_weeks: 8
    },
    {
      name: 'Giai đoạn 3 – HSK 2: Mở rộng & Giao tiếp đời sống',
      description: '~300 từ. Hiểu & nói câu dài hơn, nhiều động từ, trạng từ, miêu tả thời gian, nơi chốn.',
      duration_weeks: 8
    },
    {
      name: 'Giai đoạn 4 – HSK 3: Củng cố, phản xạ, hiểu văn bản ngắn',
      description: '~600 từ, nắm rõ 30+ cấu trúc ngữ pháp. Hiểu đoạn hội thoại / đoạn văn ngắn.',
      duration_weeks: 12
    },
    {
      name: 'Giai đoạn 5 – Ôn tập & luyện thi / hội thoại thực tế',
      description: 'Tự tin giao tiếp cơ bản. Làm quen dạng bài thi HSK.',
      duration_weeks: 4
    },
    {
      name: 'Giai đoạn 6 – Học nâng cao / chuyên đề mở rộng',
      description: 'Chuyên đề "Học qua phim / bài hát", "Học từ vựng theo ngành nghề", tích hợp AI giảng viên ảo.',
      duration_weeks: 8
    }
  ]

  const stages = []
  for (const stageData of stagesData) {
    const existingStage = await prisma.stages.findFirst({
      where: { name: stageData.name }
    })
    
    if (!existingStage) {
      const newStage = await prisma.stages.create({
        data: stageData
      })
      stages.push(newStage)
      console.log('Đã tạo stage:', newStage.name)
    } else {
      stages.push(existingStage)
      console.log('Stage đã tồn tại:', existingStage.name)
    }
  }

  // 2. Seed lessons - Bài học
  console.log('Đang tạo lessons...')
  const lessonsData = [
    // Giai đoạn 1 - Làm quen tiếng Trung & Pinyin
    { stage_id: stages[0].id, title: 'Giới thiệu tiếng Trung & thanh điệu', order_index: 1, duration_minutes: 15 },
    { stage_id: stages[0].id, title: 'Học Pinyin (có âm thanh + ví dụ)', order_index: 2, duration_minutes: 22 },
    { stage_id: stages[0].id, title: 'Viết nét cơ bản', order_index: 3, duration_minutes: 18 },
    { stage_id: stages[0].id, title: '10 câu chào hỏi đầu tiên', order_index: 4, duration_minutes: 12 },
    
    // Giai đoạn 2 - HSK 1: Cơ bản giao tiếp (15-20 bài)
    { stage_id: stages[1].id, title: 'Giới thiệu bản thân', order_index: 1, duration_minutes: 20 },
    { stage_id: stages[1].id, title: 'Số đếm & thời gian', order_index: 2, duration_minutes: 25 },
    { stage_id: stages[1].id, title: 'Gia đình', order_index: 3, duration_minutes: 22 },
    { stage_id: stages[1].id, title: 'Đồ vật, nơi chốn', order_index: 4, duration_minutes: 20 },
    { stage_id: stages[1].id, title: 'Thức ăn, đồ uống', order_index: 5, duration_minutes: 18 },
    { stage_id: stages[1].id, title: 'Động từ cơ bản', order_index: 6, duration_minutes: 25 },
    { stage_id: stages[1].id, title: 'Màu sắc', order_index: 7, duration_minutes: 15 },
    { stage_id: stages[1].id, title: 'Ngày tháng', order_index: 8, duration_minutes: 20 },
    { stage_id: stages[1].id, title: 'Nghề nghiệp', order_index: 9, duration_minutes: 18 },
    { stage_id: stages[1].id, title: 'Quốc gia, thành phố', order_index: 10, duration_minutes: 22 },
    { stage_id: stages[1].id, title: 'Trường học', order_index: 11, duration_minutes: 20 },
    { stage_id: stages[1].id, title: 'Phòng ở', order_index: 12, duration_minutes: 18 },
    { stage_id: stages[1].id, title: 'Quần áo', order_index: 13, duration_minutes: 16 },
    { stage_id: stages[1].id, title: 'Phương tiện', order_index: 14, duration_minutes: 19 },
    { stage_id: stages[1].id, title: 'Tổng hợp HSK 1', order_index: 15, duration_minutes: 30 },
    
    // Giai đoạn 3 - HSK 2: Mở rộng & Giao tiếp đời sống (20-25 bài)
    { stage_id: stages[2].id, title: 'Hoạt động hàng ngày', order_index: 1, duration_minutes: 25 },
    { stage_id: stages[2].id, title: 'Mua sắm', order_index: 2, duration_minutes: 28 },
    { stage_id: stages[2].id, title: 'Thời tiết', order_index: 3, duration_minutes: 22 },
    { stage_id: stages[2].id, title: 'Sở thích', order_index: 4, duration_minutes: 24 },
    { stage_id: stages[2].id, title: 'Hỏi - trả lời phức tạp', order_index: 5, duration_minutes: 26 },
    { stage_id: stages[2].id, title: 'So sánh', order_index: 6, duration_minutes: 23 },
    { stage_id: stages[2].id, title: 'Cảm xúc', order_index: 7, duration_minutes: 20 },
    { stage_id: stages[2].id, title: 'Sức khỏe', order_index: 8, duration_minutes: 25 },
    { stage_id: stages[2].id, title: 'Du lịch', order_index: 9, duration_minutes: 28 },
    { stage_id: stages[2].id, title: 'Công việc', order_index: 10, duration_minutes: 26 },
    { stage_id: stages[2].id, title: 'Thể thao', order_index: 11, duration_minutes: 22 },
    { stage_id: stages[2].id, title: 'Âm nhạc', order_index: 12, duration_minutes: 20 },
    { stage_id: stages[2].id, title: 'Phim ảnh', order_index: 13, duration_minutes: 24 },
    { stage_id: stages[2].id, title: 'Mạng xã hội', order_index: 14, duration_minutes: 21 },
    { stage_id: stages[2].id, title: 'Tổng hợp HSK 2', order_index: 15, duration_minutes: 35 },
    
    // Giai đoạn 4 - HSK 3: Củng cố, phản xạ, hiểu văn bản ngắn
    { stage_id: stages[3].id, title: 'Miêu tả người/vật', order_index: 1, duration_minutes: 30 },
    { stage_id: stages[3].id, title: 'Hỏi đường, địa điểm', order_index: 2, duration_minutes: 28 },
    { stage_id: stages[3].id, title: 'Sức khỏe, bệnh nhẹ', order_index: 3, duration_minutes: 32 },
    { stage_id: stages[3].id, title: 'Thời gian & kế hoạch', order_index: 4, duration_minutes: 35 },
    { stage_id: stages[3].id, title: 'Cảm xúc & ý kiến', order_index: 5, duration_minutes: 30 },
    { stage_id: stages[3].id, title: 'Kết nối câu', order_index: 6, duration_minutes: 33 },
    { stage_id: stages[3].id, title: 'Bài đọc ngắn', order_index: 7, duration_minutes: 40 },
    { stage_id: stages[3].id, title: 'Hội thoại có audio', order_index: 8, duration_minutes: 35 },
    { stage_id: stages[3].id, title: 'Mini test tổng hợp', order_index: 9, duration_minutes: 45 },
    
    // Giai đoạn 5 - Ôn tập & luyện thi / hội thoại thực tế
    { stage_id: stages[4].id, title: 'Tổng hợp ôn từ vựng', order_index: 1, duration_minutes: 40 },
    { stage_id: stages[4].id, title: 'Cấu trúc ngữ pháp', order_index: 2, duration_minutes: 45 },
    { stage_id: stages[4].id, title: 'Luyện nghe - chọn đáp án', order_index: 3, duration_minutes: 50 },
    { stage_id: stages[4].id, title: 'Chat hội thoại giả lập', order_index: 4, duration_minutes: 35 },
    { stage_id: stages[4].id, title: 'Viết lại đoạn ngắn', order_index: 5, duration_minutes: 40 },
    
    // Giai đoạn 6 - Học nâng cao / chuyên đề mở rộng
    { stage_id: stages[5].id, title: 'Học qua phim', order_index: 1, duration_minutes: 45 },
    { stage_id: stages[5].id, title: 'Học qua bài hát', order_index: 2, duration_minutes: 40 },
    { stage_id: stages[5].id, title: 'Từ vựng du lịch', order_index: 3, duration_minutes: 35 },
    { stage_id: stages[5].id, title: 'Từ vựng thương mại', order_index: 4, duration_minutes: 38 },
    { stage_id: stages[5].id, title: 'Từ vựng IT', order_index: 5, duration_minutes: 42 },
    { stage_id: stages[5].id, title: 'AI giảng viên ảo', order_index: 6, duration_minutes: 50 }
  ]

  const lessons = await Promise.all(
    lessonsData.map(lessonData => 
      prisma.lessons.create({ data: lessonData })
    )
  )
  console.log(`Đã tạo ${lessons.length} lessons`)

  // 3. Seed vocabulary_categories - Thể loại từ vựng
  console.log('Đang tạo vocabulary_categories...')
  const vocabularyCategories = await Promise.all([
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Số đếm', name_en: 'Numbers' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Thời gian', name_en: 'Time' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Chủ ngữ & vị ngữ', name_en: 'Subjects & Predicates' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Đồ ăn & thức uống', name_en: 'Food & Drinks' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Động vật', name_en: 'Animals' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Người thân trong gia đình', name_en: 'Family' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Cây cối', name_en: 'Plants' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Danh từ', name_en: 'Nouns' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Động từ', name_en: 'Verbs' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Tính từ', name_en: 'Adjectives' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Trạng từ', name_en: 'Adverbs' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Thời tiết', name_en: 'Weather' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Hoạt động thương mại', name_en: 'Commerce' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Vận động thể thao', name_en: 'Sports' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Sở thích', name_en: 'Hobbies' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Sức khỏe', name_en: 'Health' }
    }),
    prisma.vocabulary_categories.create({
      data: { name_vi: 'Cảm xúc', name_en: 'Emotions' }
    })
  ])
  console.log(`Đã tạo ${vocabularyCategories.length} vocabulary categories`)

  // 4. Seed sentence_categories - Chủ đề câu ví dụ
  console.log('Đang tạo sentence_categories...')
  const sentenceCategories = await Promise.all([
    prisma.sentence_categories.create({
      data: { name_vi: 'Lời chào', name_en: 'Greetings' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Hỏi thăm', name_en: 'Checking in' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Hỏi đường', name_en: 'Asking for directions' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Sở thích', name_en: 'Hobbies' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Kế hoạch', name_en: 'Plans' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Bày tỏ cảm xúc', name_en: 'Expressing feelings' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Sức khỏe', name_en: 'Health' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Miêu tả người/vật', name_en: 'Description' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Thời tiết', name_en: 'Weather' }
    }),
    prisma.sentence_categories.create({
      data: { name_vi: 'Mua sắm', name_en: 'Shopping' }
    })
  ])
  console.log(`Đã tạo ${sentenceCategories.length} sentence categories`)

  // 5. Seed vocabularies - Từ vựng mẫu
  console.log('Đang tạo vocabularies...')
  const vocabularies = await Promise.all([
    prisma.vocabulary.create({
      data: {
        lesson_id: 1,
        category_id: 1, // Số đếm
        chinese_simplified: '一',
        chinese_word: '一',
        pinyin: 'yī',
        vietnamese: 'một',
        meaning_vn: 'số một',
        
      }
    }),
    prisma.vocabulary.create({
      data: {
        lesson_id: 1,
        category_id: 1, // Số đếm
        chinese_simplified: '二',
        chinese_word: '二',
        pinyin: 'èr',
        vietnamese: 'hai',
        meaning_vn: 'số hai',
        
      }
    }),
    prisma.vocabulary.create({
      data: {
        lesson_id: 2,
        category_id: 2, // Thời gian
        chinese_simplified: '今天',
        chinese_word: '今天',
        pinyin: 'jīntiān',
        vietnamese: 'hôm nay',
        meaning_vn: 'ngày hôm nay',
        
      }
    }),
    prisma.vocabulary.create({
      data: {
        lesson_id: 3,
        category_id: 3, // Chủ ngữ & vị ngữ
        chinese_simplified: '我',
        chinese_word: '我',
        pinyin: 'wǒ',
        vietnamese: 'tôi',
        meaning_vn: 'đại từ nhân xưng ngôi thứ nhất',
        
      }
    }),
    prisma.vocabulary.create({
      data: {
        lesson_id: 4,
        category_id: 1, // Lời chào
        chinese_simplified: '你好',
        chinese_word: '你好',
        pinyin: 'nǐ hǎo',
        vietnamese: 'xin chào',
        meaning_vn: 'lời chào hỏi thông thường',
        
      }
    })
  ])
  console.log(`Đã tạo ${vocabularies.length} vocabularies`)

  // 6. Seed sentences - Câu ví dụ mẫu
  console.log('Đang tạo sentences...')
  const sentences = await Promise.all([
    prisma.sentences.create({
      data: {
        lesson_id: 1,
        category_id: 1, // Lời chào
        chinese_simplified: '你好，我是小明。',
        pinyin: 'Nǐ hǎo, wǒ shì Xiǎo Míng.',
        vietnamese: 'Xin chào, tôi là Tiểu Minh.'
      }
    }),
    prisma.sentences.create({
      data: {
        lesson_id: 1,
        category_id: 1, // Lời chào
        chinese_simplified: '你好吗？',
        pinyin: 'Nǐ hǎo ma?',
        vietnamese: 'Bạn có khỏe không?'
      }
    }),
    prisma.sentences.create({
      data: {
        lesson_id: 2,
        category_id: 2, // Hỏi thăm
        chinese_simplified: '今天天气怎么样？',
        pinyin: 'Jīntiān tiānqì zěnme yàng?',
        vietnamese: 'Thời tiết hôm nay thế nào?'
      }
    }),
    prisma.sentences.create({
      data: {
        lesson_id: 3,
        category_id: 3, // Hỏi đường
        chinese_simplified: '请问，厕所在哪里？',
        pinyin: 'Qǐng wèn, cèsuǒ zài nǎlǐ?',
        vietnamese: 'Xin hỏi, nhà vệ sinh ở đâu?'
      }
    }),
    prisma.sentences.create({
      data: {
        lesson_id: 4,
        category_id: 4, // Sở thích
        chinese_simplified: '我喜欢学习中文。',
        pinyin: 'Wǒ xǐhuān xuéxí zhōngwén.',
        vietnamese: 'Tôi thích học tiếng Trung.'
      }
    })
  ])
  console.log(`Đã tạo ${sentences.length} sentences`)

  console.log('✅ Seed dữ liệu mẫu hoàn thành!')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
