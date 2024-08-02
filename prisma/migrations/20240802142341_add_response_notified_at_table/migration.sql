-- CreateTable
CREATE TABLE "responseEventNotifications" (
    "id" TEXT NOT NULL,
    "responseEventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationType" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "responseEventNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "responseEventNotifications_responseEventId_userId_key" ON "responseEventNotifications"("responseEventId", "userId");

-- AddForeignKey
ALTER TABLE "responseEventNotifications" ADD CONSTRAINT "responseEventNotifications_responseEventId_fkey" FOREIGN KEY ("responseEventId") REFERENCES "responseEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responseEventNotifications" ADD CONSTRAINT "responseEventNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
