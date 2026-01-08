-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'customer');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'customer';
