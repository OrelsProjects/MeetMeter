/*
  Warnings:

  - Made the column `sentAt` on table `responseEventNotifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "responseEventNotifications" ALTER COLUMN "sentAt" SET NOT NULL,
ALTER COLUMN "sentAt" SET DEFAULT CURRENT_TIMESTAMP;
