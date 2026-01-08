import { prisma } from "../src/lib/prisma";

async function main() {
  const keyword = process.argv[2];
  if (!keyword) {
    console.error("Vui lòng truyền từ khóa, ví dụ: npx tsx scripts/findVocabulary.ts \"lắp đặt\"");
    return;
  }

  const vocab = await prisma.vocabulary.findFirst({
    where: {
      meaning_vn: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    select: {
      vocab_id: true,
      chinese_word: true,
      pinyin: true,
      meaning_vn: true,
      category: {
        select: { id: true, name_vi: true },
      },
    },
  });

  if (!vocab) {
    console.log(`Không tìm thấy từ chứa "${keyword}"`);
    return;
  }

  console.log(vocab);
}

main()
  .catch((error) => {
    console.error("Lỗi khi tìm từ:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

