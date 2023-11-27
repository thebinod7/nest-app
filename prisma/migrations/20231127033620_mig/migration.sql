/*
  Warnings:

  - The values [EMAIL,PHONE,WALLET] on the enum `AuthType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuthType_new" AS ENUM ('Email', 'Phone', 'Wallet');
ALTER TABLE "users" ALTER COLUMN "authType" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "authType" TYPE "AuthType_new" USING ("authType"::text::"AuthType_new");
ALTER TYPE "AuthType" RENAME TO "AuthType_old";
ALTER TYPE "AuthType_new" RENAME TO "AuthType";
DROP TYPE "AuthType_old";
ALTER TABLE "users" ALTER COLUMN "authType" SET DEFAULT 'Email';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "authType" SET DEFAULT 'Email';

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
