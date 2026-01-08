DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumtypid = '"AccountType"'::regtype
      AND enumlabel = 'thuong'
  ) THEN
    ALTER TYPE "AccountType" RENAME VALUE 'thuong' TO 'local';
  END IF;
END
$$;

ALTER TABLE "users" ALTER COLUMN "account_type" SET DEFAULT 'local';

