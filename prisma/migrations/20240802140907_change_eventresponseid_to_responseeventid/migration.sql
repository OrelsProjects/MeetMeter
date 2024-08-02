/*
  Warnings:

  - You are about to drop the column `eventResponseId` on the `userResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,responseEventId]` on the table `userResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `responseEventId` to the `userResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "userResponse" DROP CONSTRAINT "userResponse_eventResponseId_fkey";

-- DropIndex
DROP INDEX "userResponse_userId_eventResponseId_key";

-- AlterTable
ALTER TABLE "userResponse" DROP COLUMN "eventResponseId",
ADD COLUMN     "responseEventId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "userResponse_userId_responseEventId_key" ON "userResponse"("userId", "responseEventId");

-- AddForeignKey
ALTER TABLE "userResponse" ADD CONSTRAINT "userResponse_responseEventId_fkey" FOREIGN KEY ("responseEventId") REFERENCES "responseEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
