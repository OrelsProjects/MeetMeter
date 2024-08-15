/*
  Warnings:

  - Made the column `updatedAt` on table `userResponse` required. This step will fail if there are existing NULL values in that column.

*/

-- Set updatedAt to CURRENT_TIMESTAMP if it's NULL
UPDATE "userResponse"
SET "updatedAt" = CURRENT_TIMESTAMP
WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "userResponse" ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
