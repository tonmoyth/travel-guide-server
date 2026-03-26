-- AlterTable
ALTER TABLE "member" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiry" TIMESTAMP(3);
