-- AlterTable
ALTER TABLE "responseEvent" ADD COLUMN     "organizerEmail" TEXT,
ALTER COLUMN "organizer" DROP NOT NULL;
