-- CreateTable
CREATE TABLE "chat_histories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_histories_userId_idx" ON "chat_histories"("userId");

-- AddForeignKey
ALTER TABLE "chat_histories" ADD CONSTRAINT "chat_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
