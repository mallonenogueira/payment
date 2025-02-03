/*
  Warnings:

  - The values [EXPIRED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `mercadopago_payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mercadopago_preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'APPROVED', 'CANCELED');
ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "mercadopago_payment" DROP CONSTRAINT "mercadopago_payment_subscribe_id_fkey";

-- DropForeignKey
ALTER TABLE "mercadopago_preferences" DROP CONSTRAINT "mercadopago_preferences_subscribe_id_fkey";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "installments" INTEGER;

-- DropTable
DROP TABLE "mercadopago_payment";

-- DropTable
DROP TABLE "mercadopago_preferences";
