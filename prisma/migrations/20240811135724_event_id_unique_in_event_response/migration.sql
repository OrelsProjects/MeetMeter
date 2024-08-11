/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `responseEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "responseEvent_eventId_key" ON "responseEvent"("eventId");
