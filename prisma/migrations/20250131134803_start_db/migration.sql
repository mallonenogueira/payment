-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "SubscribeStatus" AS ENUM ('PENDING', 'APPROVED', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'CANCELED', 'EXPIRED');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "installments" INTEGER NOT NULL,
    "type" "ProductStatus" NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribes" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "SubscribeStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "account_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "subscribes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mercadopago_preferences" (
    "id" TEXT NOT NULL,
    "subscribe_id" TEXT NOT NULL,

    CONSTRAINT "mercadopago_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mercadopago_payment" (
    "id" TEXT NOT NULL,
    "subscribe_id" TEXT NOT NULL,

    CONSTRAINT "mercadopago_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "account_id" TEXT NOT NULL,
    "subscribe_id" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE INDEX "subscribes_account_id_idx" ON "subscribes"("account_id");

-- CreateIndex
CREATE INDEX "payments_account_id_idx" ON "payments"("account_id");

-- AddForeignKey
ALTER TABLE "subscribes" ADD CONSTRAINT "subscribes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscribes" ADD CONSTRAINT "subscribes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mercadopago_preferences" ADD CONSTRAINT "mercadopago_preferences_subscribe_id_fkey" FOREIGN KEY ("subscribe_id") REFERENCES "subscribes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mercadopago_payment" ADD CONSTRAINT "mercadopago_payment_subscribe_id_fkey" FOREIGN KEY ("subscribe_id") REFERENCES "subscribes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscribe_id_fkey" FOREIGN KEY ("subscribe_id") REFERENCES "subscribes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
