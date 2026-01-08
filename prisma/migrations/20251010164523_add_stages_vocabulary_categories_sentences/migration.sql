/*
  Warnings:

  - You are about to drop the column `description` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "description",
DROP COLUMN "level",
ADD COLUMN     "duration_minutes" INTEGER,
ADD COLUMN     "order_index" INTEGER,
ADD COLUMN     "stage_id" INTEGER;

-- AlterTable
ALTER TABLE "vocabulary" ADD COLUMN     "category_id" INTEGER,
ADD COLUMN     "chinese_simplified" TEXT,
ADD COLUMN     "part_of_speech" TEXT,
ADD COLUMN     "vietnamese" TEXT;

-- CreateTable
CREATE TABLE "stages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration_weeks" INTEGER,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_categories" (
    "id" SERIAL NOT NULL,
    "name_vi" TEXT,
    "name_en" TEXT,

    CONSTRAINT "vocabulary_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentence_categories" (
    "id" SERIAL NOT NULL,
    "name_vi" TEXT,
    "name_en" TEXT,

    CONSTRAINT "sentence_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentences" (
    "id" SERIAL NOT NULL,
    "chinese_simplified" TEXT,
    "pinyin" TEXT,
    "vietnamese" TEXT,
    "lesson_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "sentences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("lesson_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "sentence_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "vocabulary_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
