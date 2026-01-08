-- AlterTable: Đổi cột date từ DateTime sang Date (chỉ ngày, không có giờ)
ALTER TABLE "daily_tasks" 
ALTER COLUMN "date" TYPE DATE USING date::date;

-- Đảm bảo default value là CURRENT_DATE
ALTER TABLE "daily_tasks" 
ALTER COLUMN "date" SET DEFAULT CURRENT_DATE;

