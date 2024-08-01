-- CreateTable
CREATE TABLE "userResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "respondAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userResponse" ADD CONSTRAINT "userResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
