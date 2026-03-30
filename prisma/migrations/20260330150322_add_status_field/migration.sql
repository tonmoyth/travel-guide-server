/*
  Warnings:

  - You are about to drop the column `otp` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiry` on the `member` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "member" DROP COLUMN "otp",
DROP COLUMN "otpExpiry";
