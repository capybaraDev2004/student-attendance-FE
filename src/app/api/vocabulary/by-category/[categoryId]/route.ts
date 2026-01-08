import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  let categoryId: number | null = null;
  
  try {
    // Parse params
    const { categoryId: categoryIdParam } = await params;
    categoryId = parseInt(categoryIdParam, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Category ID không hợp lệ", received: categoryIdParam },
        { status: 400 }
      );
    }

    // Log để debug
    console.log(`[API] Bắt đầu query vocabulary với category_id: ${categoryId} (type: ${typeof categoryId})`);

    // Kiểm tra Prisma client
    if (!prisma) {
      throw new Error("Prisma client không được khởi tạo");
    }

    // Kiểm tra category có tồn tại không
    const categoryExists = await prisma.vocabulary_categories.findUnique({
      where: { id: categoryId },
      select: { id: true, name_vi: true, name_en: true },
    });

    if (!categoryExists) {
      console.log(`[API] Không tìm thấy category với id: ${categoryId}`);
      return NextResponse.json(
        { message: `Không tìm thấy chủ đề với ID: ${categoryId}`, categoryId },
        { status: 404 }
      );
    }

    console.log(`[API] Category tồn tại: ${categoryExists.name_vi || categoryExists.name_en}`);

    // Query trực tiếp vocabulary với category_id - cách này đơn giản và an toàn nhất
    let vocabularies;
    try {
      console.log(`[API] Đang query vocabulary với category_id: ${categoryId}...`);
      vocabularies = await prisma.vocabulary.findMany({
        where: {
          category_id: categoryId,
        },
        orderBy: {
          vocab_id: "asc",
        },
        select: {
          vocab_id: true,
          chinese_word: true,
          pinyin: true,
          meaning_vn: true,
          audio_url: true,
          // part_of_speech: true, // Column không tồn tại trong database
        },
      });
      console.log(`[API] Query thành công! Tìm thấy ${vocabularies.length} từ vựng`);
    } catch (queryError: any) {
      console.error(`[API] ❌ Lỗi trong query vocabulary:`, queryError);
      console.error(`[API] Query error details:`, {
        message: queryError?.message,
        code: queryError?.code,
        name: queryError?.name,
        meta: queryError?.meta,
        stack: queryError?.stack?.substring(0, 500),
      });
      throw queryError; // Re-throw để xử lý ở catch block ngoài
    }

    console.log(`[API] Tìm thấy ${vocabularies.length} từ vựng cho category_id: ${categoryId}`);
    
    // Debug: Kiểm tra một vài từ vựng đầu tiên
    if (vocabularies.length > 0) {
      console.log(`[API] Ví dụ từ vựng đầu tiên:`, JSON.stringify(vocabularies[0], null, 2));
    } else {
      console.log(`[API] Không tìm thấy từ vựng nào với category_id: ${categoryId}`);
    }

    // Format dữ liệu
    const formattedWords = vocabularies.map((vocab) => ({
      vocabId: vocab.vocab_id,
      hanzi: vocab.chinese_word,
      pinyin: vocab.pinyin || "",
      meaning: vocab.meaning_vn,
      example: "", // Có thể thêm vào database sau nếu cần
      audio_url: vocab.audio_url,
    }));

    console.log(`[API] Trả về ${formattedWords.length} từ vựng đã format`);
    return NextResponse.json(formattedWords);
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy vocabulary theo category:", error);
    console.error("❌ Error details:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      meta: error?.meta,
      stack: error?.stack?.substring(0, 500), // Chỉ lấy 500 ký tự đầu của stack
    });
    
    // Kiểm tra loại lỗi
    let errorMessage = error?.message || String(error);
    let errorCode = error?.code || "UNKNOWN_ERROR";
    
    // Nếu là Prisma error, log chi tiết hơn
    if (error?.code && (error.code.startsWith('P') || error.code === 'PrismaClientKnownRequestError')) {
      console.error("❌ Prisma Error detected:", {
        code: error.code,
        meta: error.meta,
      });
      errorCode = error.code;
    }
    
    const errorStack = error?.stack || "";
    
    // Trả về error chi tiết hơn để debug
    return NextResponse.json(
      {
        message: "Lỗi khi lấy danh sách từ vựng",
        error: errorMessage,
        code: errorCode,
        categoryId: categoryId ?? "unknown",
        meta: error?.meta || undefined,
        stack: process.env.NODE_ENV === "development" ? errorStack.substring(0, 1000) : undefined,
      },
      { status: 500 }
    );
  }
}
