/*
  Warnings:

  - You are about to drop the `_CompanyToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToUser" DROP CONSTRAINT "_CompanyToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToUser" DROP CONSTRAINT "_CompanyToUser_B_fkey";

-- DropTable
DROP TABLE "_CompanyToUser";

-- CreateTable
CREATE TABLE "_users_on_companies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_users_on_companies_AB_unique" ON "_users_on_companies"("A", "B");

-- CreateIndex
CREATE INDEX "_users_on_companies_B_index" ON "_users_on_companies"("B");

-- AddForeignKey
ALTER TABLE "_users_on_companies" ADD CONSTRAINT "_users_on_companies_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_on_companies" ADD CONSTRAINT "_users_on_companies_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
