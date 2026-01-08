import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Lấy tất cả categories từ database
    const categories = await prisma.vocabulary_categories.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name_vi: true,
        name_en: true,
        _count: {
          select: {
            vocabularies: true,
          },
        },
      },
    });

    // Tính tổng số từ vựng từ tất cả các chủ đề
    const totalWords = categories.reduce((sum, cat) => sum + cat._count.vocabularies, 0);

    // Format dữ liệu
    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name_vi || cat.name_en || `Chủ đề ${cat.id}`,
      wordCount: cat._count.vocabularies,
      reviewDays: 2, // Mặc định 2 ngày, có thể lấy từ database sau
    }));

    return NextResponse.json({
      categories: formattedCategories,
      totalWords,
    });
  } catch (error: any) {
    console.error("Lỗi khi lấy categories:", error);
    const errorMessage = error?.message || String(error);
    const errorStack = error?.stack || "";
    return NextResponse.json(
      {
        message: "Lỗi khi lấy danh sách chủ đề",
        error: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
