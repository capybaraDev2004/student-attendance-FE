import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.sentence_categories.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name_vi: true,
        name_en: true,
        _count: {
          select: {
            sentences: true,
          },
        },
      },
    });

    const totalSentences = categories.reduce(
      (sum, cat) => sum + cat._count.sentences,
      0,
    );

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name_vi || cat.name_en || `Chủ đề ${cat.id}`,
      sentenceCount: cat._count.sentences,
      reviewDays: 2,
    }));

    return NextResponse.json({
      categories: formattedCategories,
      totalSentences,
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy sentence categories:", error);
    return NextResponse.json(
      {
        message: "Lỗi khi lấy danh sách chủ đề câu",
        error: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}


