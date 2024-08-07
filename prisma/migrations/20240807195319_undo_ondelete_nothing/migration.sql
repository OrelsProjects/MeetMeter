-- DropForeignKey
ALTER TABLE "userResponse" DROP CONSTRAINT "userResponse_userId_fkey";

-- AddForeignKey
ALTER TABLE "userResponse" ADD CONSTRAINT "userResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
