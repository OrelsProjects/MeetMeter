/*
  Warnings:

  - You are about to drop the column `userId` on the `responseEventNotifications` table. All the data in the column will be lost.
  - Added the required column `sentBy` to the `responseEventNotifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "responseEventNotifications" DROP CONSTRAINT "responseEventNotifications_userId_fkey";

-- DropIndex
DROP INDEX "responseEventNotifications_responseEventId_userId_key";

-- AlterTable
ALTER TABLE "responseEventNotifications" DROP COLUMN "userId",
ADD COLUMN     "sentBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "responseEventNotifications" ADD CONSTRAINT "responseEventNotifications_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
