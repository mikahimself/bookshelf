/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,bookId,format]` on the table `Copy` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "subtitle" TEXT,
    "isbn" TEXT,
    "releaseYear" INTEGER,
    "translator" TEXT,
    "coverImageUrl" TEXT,
    "language" TEXT,
    "description" TEXT,
    "publisherId" TEXT,
    "seriesId" TEXT,
    "seriesIndex" INTEGER,
    "vectorStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Book_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("coverImageUrl", "createdAt", "description", "id", "isbn", "language", "originalTitle", "publisherId", "releaseYear", "seriesId", "seriesIndex", "subtitle", "title", "translator", "updatedAt") SELECT "coverImageUrl", "createdAt", "description", "id", "isbn", "language", "originalTitle", "publisherId", "releaseYear", "seriesId", "seriesIndex", "subtitle", "title", "translator", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Copy_ownerId_bookId_format_key" ON "Copy"("ownerId", "bookId", "format");
