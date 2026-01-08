import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test 1: Kiểm tra Prisma client
    if (!prisma) {
      return NextResponse.json(
        { error: "Prisma client không được khởi tạo" },
        { status: 500 }
      );
    }

    // Test 2: Kiểm tra vocabulary_categories model
    const categoryCount = await prisma.vocabulary_categories.count();
    console.log(`[TEST] Số lượng categories: ${categoryCount}`);

    // Test 3: Kiểm tra vocabulary model
    const vocabCount = await prisma.vocabulary.count();
    console.log(`[TEST] Tổng số vocabulary: ${vocabCount}`);

    // Test 4: Query một category với vocabulary
    const testCategory = await prisma.vocabulary_categories.findFirst({
      include: {
        vocabularies: {
          take: 5,
          select: {
            vocab_id: true,
            chinese_word: true,
            pinyin: true,
            category_id: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      prismaClient: !!prisma,
      categoryCount,
      vocabCount,
      testCategory: testCategory
        ? {
            id: testCategory.id,
            name: testCategory.name_vi || testCategory.name_en,
            vocabCount: testCategory.vocabularies.length,
            sampleVocabs: testCategory.vocabularies,
          }
        : null,
    });
  } catch (error: any) {
    console.error("[TEST] Lỗi:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || String(error),
        code: error?.code,
        stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}

