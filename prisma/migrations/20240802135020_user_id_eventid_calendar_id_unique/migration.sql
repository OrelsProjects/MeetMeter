/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId,calendarId]` on the table `userResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userResponse_userId_eventId_calendarId_key" ON "userResponse"("userId", "eventId", "calendarId");
