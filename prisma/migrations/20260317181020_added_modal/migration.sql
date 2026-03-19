/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "MemberGender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "GuideStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'PDF');

-- CreateEnum
CREATE TYPE "GuideReviewStatus" AS ENUM ('APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "parentId" TEXT,
    "comment" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_medias" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_reviews" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "reviewedBy" TEXT NOT NULL,
    "status" "GuideReviewStatus" NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_guides" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "itinerary" TEXT NOT NULL,
    "status" "GuideStatus" NOT NULL DEFAULT 'DRAFT',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION,
    "coverImage" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "comments_guideId_idx" ON "comments"("guideId");

-- CreateIndex
CREATE INDEX "comments_memberId_idx" ON "comments"("memberId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");

-- CreateIndex
CREATE INDEX "favorites_memberId_idx" ON "favorites"("memberId");

-- CreateIndex
CREATE INDEX "favorites_guideId_idx" ON "favorites"("guideId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_memberId_guideId_key" ON "favorites"("memberId", "guideId");

-- CreateIndex
CREATE INDEX "guide_medias_guideId_idx" ON "guide_medias"("guideId");

-- CreateIndex
CREATE INDEX "guide_reviews_guideId_idx" ON "guide_reviews"("guideId");

-- CreateIndex
CREATE INDEX "guide_reviews_reviewedBy_idx" ON "guide_reviews"("reviewedBy");

-- CreateIndex
CREATE INDEX "travel_guides_memberId_idx" ON "travel_guides"("memberId");

-- CreateIndex
CREATE INDEX "travel_guides_categoryId_idx" ON "travel_guides"("categoryId");

-- CreateIndex
CREATE INDEX "purchases_memberId_idx" ON "purchases"("memberId");

-- CreateIndex
CREATE INDEX "purchases_guideId_idx" ON "purchases"("guideId");

-- CreateIndex
CREATE INDEX "votes_memberId_idx" ON "votes"("memberId");

-- CreateIndex
CREATE INDEX "votes_guideId_idx" ON "votes"("guideId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_memberId_guideId_key" ON "votes"("memberId", "guideId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "travel_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "travel_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_medias" ADD CONSTRAINT "guide_medias_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "travel_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_reviews" ADD CONSTRAINT "guide_reviews_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "travel_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_guides" ADD CONSTRAINT "travel_guides_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "travel_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "travel_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;
