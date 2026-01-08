import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId: categoryIdParam } = await params;
    const categoryId = parseInt(categoryIdParam, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Category ID không hợp lệ", received: categoryIdParam },
        { status: 400 },
      );
    }

    const categoryExists = await prisma.sentence_categories.findUnique({
      where: { id: categoryId },
      select: { id: true, name_vi: true, name_en: true },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { message: `Không tìm thấy chủ đề với ID: ${categoryId}`, categoryId },
        { status: 404 },
      );
    }

    const sentences = await prisma.sentences.findMany({
      where: { category_id: categoryId },
      orderBy: { id: "asc" },
      select: {
        id: true,
        chinese_simplified: true,
        pinyin: true,
        vietnamese: true,
      },
    });

    const formatted = sentences.map((s) => ({
      id: s.id,
      hanzi: s.chinese_simplified,
      pinyin: s.pinyin ?? "",
      meaning: s.vietnamese ?? "",
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Lỗi khi lấy sentences theo category:", error);
    return NextResponse.json(
      {
        message: "Lỗi khi lấy danh sách câu",
        error: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}


