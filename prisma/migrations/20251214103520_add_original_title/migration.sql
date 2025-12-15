-- AlterTable
ALTER TABLE "Book" ADD COLUMN "originalTitle" TEXT;

-- AlterTable
ALTER TABLE "Copy" ADD COLUMN "pageCount" INTEGER;

-- CreateTable
CREATE TABLE "ReadingProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "copyId" INTEGER NOT NULL,
    "currentPage" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "lastUpdatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReadingProgress_copyId_fkey" FOREIGN KEY ("copyId") REFERENCES "Copy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReadingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingProgress_userId_copyId_key" ON "ReadingProgress"("userId", "copyId");
