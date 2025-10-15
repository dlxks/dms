-- CreateEnum
CREATE TYPE "AdviseeStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- DropIndex
DROP INDEX "public"."advisees_studentId_key";

-- AlterTable
ALTER TABLE "advisees" ADD COLUMN     "status" "AdviseeStatus" NOT NULL DEFAULT 'PENDING';
