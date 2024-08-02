/*
  Warnings:

  - A unique constraint covering the columns `[calendarId,eventId]` on the table `responseEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `responseEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "responseEvent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "responseEvent_calendarId_eventId_key" ON "responseEvent"("calendarId", "eventId");
