-- CreateEnum
CREATE TYPE "AnnouncementStatus" AS ENUM ('VISIBLE', 'HIDDEN');

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "status" "AnnouncementStatus" NOT NULL DEFAULT 'VISIBLE';
