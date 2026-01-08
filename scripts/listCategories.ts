import { prisma } from "../src/lib/prisma";

async function main() {
  const categories = await prisma.vocabulary_categories.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: { vocabularies: true },
      },
    },
  });

  console.log("Tổng số chủ đề:", categories.length);
  for (const category of categories) {
    console.log(
      `${category.id.toString().padStart(2, "0")} | ${category.name_vi} | ${
        category._count.vocabularies
      } từ`
    );
  }
}

main()
  .catch((err) => {
    console.error("Lỗi khi liệt kê chủ đề:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

