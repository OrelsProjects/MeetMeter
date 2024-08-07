-- AlterTable
ALTER TABLE "userResponse" ADD COLUMN     "email" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
