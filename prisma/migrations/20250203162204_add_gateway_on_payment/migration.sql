/*
  Warnings:

  - Added the required column `gateway` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gatewayId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "payments_account_id_idx";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "gateway" TEXT NOT NULL,
ADD COLUMN     "gatewayId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "payments_account_id_gatewayId_idx" ON "payments"("account_id", "gatewayId");
