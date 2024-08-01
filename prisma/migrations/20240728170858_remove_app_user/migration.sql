/*
  Warnings:

  - You are about to drop the `appUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "appUser" DROP CONSTRAINT "appUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "appUserMetadata" DROP CONSTRAINT "appUserMetadata_userId_fkey";

-- DropForeignKey
ALTER TABLE "appUserSettings" DROP CONSTRAINT "appUserSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "userOrders" DROP CONSTRAINT "userOrders_userId_fkey";

-- DropTable
DROP TABLE "appUser";

-- AddForeignKey
ALTER TABLE "appUserMetadata" ADD CONSTRAINT "appUserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appUserSettings" ADD CONSTRAINT "appUserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOrders" ADD CONSTRAINT "userOrders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
