/*
  Warnings:

  - You are about to drop the column `source` on the `Post` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ExternalResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "resourceKind" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "IndustryFetchCache" (
    "industry" TEXT NOT NULL PRIMARY KEY,
    "lastFetchedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "openToChat" BOOLEAN NOT NULL DEFAULT false,
    "resourceUrl" TEXT,
    "resourceKind" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "body", "createdAt", "id", "industry", "openToChat", "resourceKind", "resourceUrl", "title", "type", "updatedAt") SELECT "authorId", "body", "createdAt", "id", "industry", "openToChat", "resourceKind", "resourceUrl", "title", "type", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_industry_idx" ON "Post"("industry");
CREATE INDEX "Post_type_idx" ON "Post"("type");
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ExternalResource_url_key" ON "ExternalResource"("url");

-- CreateIndex
CREATE INDEX "ExternalResource_industry_idx" ON "ExternalResource"("industry");
