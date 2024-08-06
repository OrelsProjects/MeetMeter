-- DropForeignKey
ALTER TABLE "responseEvent" DROP CONSTRAINT "responseEvent_organizer_fkey";

-- DropForeignKey
ALTER TABLE "responseEventNotifications" DROP CONSTRAINT "responseEventNotifications_sentBy_fkey";

-- DropForeignKey
ALTER TABLE "userResponse" DROP CONSTRAINT "userResponse_userId_fkey";

-- AddForeignKey
ALTER TABLE "userResponse" ADD CONSTRAINT "userResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responseEvent" ADD CONSTRAINT "responseEvent_organizer_fkey" FOREIGN KEY ("organizer") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responseEventNotifications" ADD CONSTRAINT "responseEventNotifications_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
