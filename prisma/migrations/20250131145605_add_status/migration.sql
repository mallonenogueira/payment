-- AlterEnum
ALTER TYPE "SubscribeStatus" ADD VALUE 'CREATED';
COMMIT;
-- AlterTable
ALTER TABLE "subscribes" ALTER COLUMN "status" SET DEFAULT 'CREATED';
