-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'success', 'failed', 'expired');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "gambar" TEXT NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "namaPembeli" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "produkId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "statusPembayaran" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "orderIdMidtrans" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderIdMidtrans_key" ON "Order"("orderIdMidtrans");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
