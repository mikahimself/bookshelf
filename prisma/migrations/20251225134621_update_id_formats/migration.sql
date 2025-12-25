/*
  Warnings:

  - The primary key for the `Author` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BookAuthor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BookGenre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Publisher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Series` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserBook` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Author" ("id", "name") SELECT "id", "name" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");
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
    "authorId" TEXT NOT NULL,
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
    "genreId" TEXT NOT NULL,

    PRIMARY KEY ("bookId", "genreId"),
    CONSTRAINT "BookGenre_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookGenre" ("bookId", "genreId") SELECT "bookId", "genreId" FROM "BookGenre";
DROP TABLE "BookGenre";
ALTER TABLE "new_BookGenre" RENAME TO "BookGenre";
CREATE TABLE "new_Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Genre" ("id", "name") SELECT "id", "name" FROM "Genre";
DROP TABLE "Genre";
ALTER TABLE "new_Genre" RENAME TO "Genre";
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");
CREATE TABLE "new_Publisher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Publisher" ("id", "name") SELECT "id", "name" FROM "Publisher";
DROP TABLE "Publisher";
ALTER TABLE "new_Publisher" RENAME TO "Publisher";
CREATE UNIQUE INDEX "Publisher_name_key" ON "Publisher"("name");
CREATE TABLE "new_Series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_Series" ("description", "id", "name") SELECT "description", "id", "name" FROM "Series";
DROP TABLE "Series";
ALTER TABLE "new_Series" RENAME TO "Series";
CREATE UNIQUE INDEX "Series_name_key" ON "Series"("name");
CREATE TABLE "new_UserBook" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
