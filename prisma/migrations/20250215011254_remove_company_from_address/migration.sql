/*
  Warnings:

  - You are about to drop the column `company_id` on the `addresses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_company_id_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "company_id";
