-- DropIndex
DROP INDEX "payments_account_id_gatewayId_idx";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "gateway" DROP NOT NULL,
ALTER COLUMN "gatewayId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "payments_account_id_idx" ON "payments"("account_id");
