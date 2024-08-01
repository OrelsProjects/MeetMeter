-- AddForeignKey
ALTER TABLE "appUser" ADD CONSTRAINT "appUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
