/*
  Warnings:

  - You are about to drop the column `calendarId` on the `userResponse` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `userResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,eventResponseId]` on the table `userResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventResponseId` to the `userResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "userResponse_userId_eventId_calendarId_key";

-- AlterTable
ALTER TABLE "userResponse" DROP COLUMN "calendarId",
DROP COLUMN "eventId",
ADD COLUMN     "eventResponseId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "responseEvent" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "organizer" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "responseEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userResponse_userId_eventResponseId_key" ON "userResponse"("userId", "eventResponseId");

-- AddForeignKey
ALTER TABLE "userResponse" ADD CONSTRAINT "userResponse_eventResponseId_fkey" FOREIGN KEY ("eventResponseId") REFERENCES "responseEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responseEvent" ADD CONSTRAINT "responseEvent_organizer_fkey" FOREIGN KEY ("organizer") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
