-- CreateTable
CREATE TABLE "ceremonies" (
    "id" TEXT NOT NULL,
    "public_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "tribute_date" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "account_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "ceremonies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "honored_person" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "ceremony_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "death_Date" TIMESTAMP(3),

    CONSTRAINT "honored_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "zip_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "complement" TEXT,
    "account_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ceremonies_public_id_key" ON "ceremonies"("public_id");

-- CreateIndex
CREATE INDEX "ceremonies_account_id_idx" ON "ceremonies"("account_id");

-- CreateIndex
CREATE INDEX "honored_person_account_id_idx" ON "honored_person"("account_id");

-- CreateIndex
CREATE INDEX "addresses_account_id_idx" ON "addresses"("account_id");

-- AddForeignKey
ALTER TABLE "ceremonies" ADD CONSTRAINT "ceremonies_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ceremonies" ADD CONSTRAINT "ceremonies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "honored_person" ADD CONSTRAINT "honored_person_ceremony_id_fkey" FOREIGN KEY ("ceremony_id") REFERENCES "ceremonies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "honored_person" ADD CONSTRAINT "honored_person_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
