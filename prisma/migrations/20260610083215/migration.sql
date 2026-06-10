/*
  Warnings:

  - The values [AVAILABLE,SOLD] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `about` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `mission` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `vision` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `services` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipeItem" AS ENUM ('ASET', 'JASA');

-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('TERSEDIA', 'TERJUAL', 'DRAFT');
ALTER TABLE "public"."products" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "public"."ProductStatus_old";
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropIndex
DROP INDEX "products_category_idx";

-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "ctaText" TEXT;

-- AlterTable
ALTER TABLE "company_profiles" DROP COLUMN "about",
DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "facebook",
DROP COLUMN "instagram",
DROP COLUMN "mission",
DROP COLUMN "phone",
DROP COLUMN "vision",
DROP COLUMN "website",
DROP COLUMN "whatsapp",
ADD COLUMN     "keunggulan" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "misi" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tentang" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "visi" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "tipeItem" "TipeItem" NOT NULL DEFAULT 'ASET',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "ProductCategory";

-- DropEnum
DROP TYPE "ServiceStatus";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'umum',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_settings" (
    "id" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT,
    "sosmedLinks" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "web_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
