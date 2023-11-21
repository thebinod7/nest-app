/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `bookmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authAddress]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authAddress` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('EMAIL', 'PHONE', 'WALLET');

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userId_fkey";

-- DropForeignKey
ALTER TABLE "stories" DROP CONSTRAINT "stories_created_by_fkey";

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
DROP COLUMN "hash",
ADD COLUMN     "authAddress" TEXT NOT NULL,
ADD COLUMN     "authType" "AuthType" NOT NULL DEFAULT 'EMAIL';

-- DropTable
DROP TABLE "bookmarks";

-- DropTable
DROP TABLE "stories";

-- CreateIndex
CREATE UNIQUE INDEX "users_authAddress_key" ON "users"("authAddress");
