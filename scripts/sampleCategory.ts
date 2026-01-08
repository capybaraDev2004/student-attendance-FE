import { prisma } from "../src/lib/prisma";

async function main() {
  const targetName = process.argv[2] || "Khái niệm trừu tượng";
  const category = await prisma.vocabulary_categories.findFirst({
    where: {
      name_vi: {
        equals: targetName,
        mode: "insensitive",
      },
    },
  });

  if (!category) {
    console.error(`Không tìm thấy chủ đề "${targetName}"`);
    return;
  }

  const vocabularies = await prisma.vocabulary.findMany({
    where: { category_id: category.id },
    take: 20,
    orderBy: { vocab_id: "asc" },
    select: {
      vocab_id: true,
      chinese_word: true,
      pinyin: true,
      meaning_vn: true,
    },
  });

  console.log(`📚 Mẫu từ thuộc chủ đề "${targetName}" (ID: ${category.id})`);
  vocabularies.forEach((vocab) => {
    console.log(
      `- ${vocab.chinese_word} (${vocab.pinyin}) -> ${vocab.meaning_vn}`
    );
  });
}

main()
  .catch((error) => {
    console.error("Lỗi khi lấy mẫu chủ đề:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

