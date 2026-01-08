-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('normal', 'vip');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('thuong', 'google');

-- AlterTable
ALTER TABLE "users"
ADD COLUMN     "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verification_code" TEXT,
ADD COLUMN     "verification_code_expires_at" TIMESTAMP(3),
ADD COLUMN     "account_status" "AccountStatus" NOT NULL DEFAULT 'normal',
ADD COLUMN     "account_type" "AccountType" NOT NULL DEFAULT 'thuong';

