DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'Region'
  ) THEN
    CREATE TYPE "Region" AS ENUM ('bac', 'trung', 'nam');
  END IF;
END
$$;

-- AlterTable
ALTER TABLE "users"
ADD COLUMN     "address" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "region" "Region";

