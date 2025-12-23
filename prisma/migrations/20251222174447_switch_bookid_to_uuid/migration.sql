/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BookAuthor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BookGenre` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
    "publisherId" INTEGER,
    "seriesId" INTEGER,
    "seriesIndex" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Book_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("coverImageUrl", "createdAt", "description", "id", "isbn", "language", "originalTitle", "publisherId", "releaseYear", "seriesId", "seriesIndex", "subtitle", "title", "translator", "updatedAt") SELECT "coverImageUrl", "createdAt", "description", "id", "isbn", "language", "originalTitle", "publisherId", "releaseYear", "seriesId", "seriesIndex", "subtitle", "title", "translator", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
CREATE TABLE "new_BookAuthor" (
    "bookId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("bookId", "authorId"),
    CONSTRAINT "BookAuthor_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookAuthor_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookAuthor" ("authorId", "bookId", "sortOrder") SELECT "authorId", "bookId", "sortOrder" FROM "BookAuthor";
DROP TABLE "BookAuthor";
ALTER TABLE "new_BookAuthor" RENAME TO "BookAuthor";
CREATE TABLE "new_BookGenre" (
    "bookId" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("bookId", "genreId"),
    CONSTRAINT "BookGenre_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookGenre" ("bookId", "genreId") SELECT "bookId", "genreId" FROM "BookGenre";
DROP TABLE "BookGenre";
ALTER TABLE "new_BookGenre" RENAME TO "BookGenre";
CREATE TABLE "new_Copy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "label" TEXT,
    "acquiredAt" DATETIME,
    "location" TEXT,
    "notes" TEXT,
    "pageCount" INTEGER,
    CONSTRAINT "Copy_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Copy_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Copy" ("acquiredAt", "bookId", "format", "id", "label", "location", "notes", "ownerId", "pageCount") SELECT "acquiredAt", "bookId", "format", "id", "label", "location", "notes", "ownerId", "pageCount" FROM "Copy";
DROP TABLE "Copy";
ALTER TABLE "new_Copy" RENAME TO "Copy";
CREATE TABLE "new_Recommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baseBookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "reason" TEXT,
    "source" TEXT NOT NULL,
    "rank" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recommendation_baseBookId_fkey" FOREIGN KEY ("baseBookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recommendation" ("author", "baseBookId", "createdAt", "id", "rank", "reason", "source", "title", "userId") SELECT "author", "baseBookId", "createdAt", "id", "rank", "reason", "source", "title", "userId" FROM "Recommendation";
DROP TABLE "Recommendation";
ALTER TABLE "new_Recommendation" RENAME TO "Recommendation";
CREATE TABLE "new_UserBook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WANTED',
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserBook" ("bookId", "createdAt", "id", "notes", "rating", "status", "updatedAt", "userId") SELECT "bookId", "createdAt", "id", "notes", "rating", "status", "updatedAt", "userId" FROM "UserBook";
DROP TABLE "UserBook";
ALTER TABLE "new_UserBook" RENAME TO "UserBook";
CREATE UNIQUE INDEX "UserBook_userId_bookId_key" ON "UserBook"("userId", "bookId");
CREATE TABLE "new_WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wishlistId" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "notes" TEXT,
    "priority" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WishlistItem_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WishlistItem" ("bookId", "createdAt", "id", "notes", "priority", "wishlistId") SELECT "bookId", "createdAt", "id", "notes", "priority", "wishlistId" FROM "WishlistItem";
DROP TABLE "WishlistItem";
ALTER TABLE "new_WishlistItem" RENAME TO "WishlistItem";
CREATE UNIQUE INDEX "WishlistItem_wishlistId_bookId_key" ON "WishlistItem"("wishlistId", "bookId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
