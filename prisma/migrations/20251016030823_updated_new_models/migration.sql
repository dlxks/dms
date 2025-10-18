/*
  Warnings:

  - You are about to drop the column `facultyId` on the `defense_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `defense_schedules` table. All the data in the column will be lost.
  - The `status` column on the `defense_schedules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `defense_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DefenseCategory" AS ENUM ('TITLE', 'FINAL');

-- CreateEnum
CREATE TYPE "DefenseStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('SYLLABUS_ACCEPTANCE_FORM', 'TOS_MIDTERM', 'TOS_FINALS', 'RUBRICS_MIDTERM', 'RUBRICS_FINALS', 'EXAMINATIONS_MIDTERM', 'EXAMINATIONS_FINALS', 'GRADING_SHEET', 'RECORD', 'STUDENT_OUTPUT', 'CLASS_RECORD', 'PORTFOLIO');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('NONE', 'SUBMITTED', 'REVISED', 'APPROVED');

-- DropForeignKey
ALTER TABLE "public"."defense_schedules" DROP CONSTRAINT "defense_schedules_facultyId_fkey";

-- AlterTable
ALTER TABLE "defense_schedules" DROP COLUMN "facultyId",
DROP COLUMN "requirements",
ADD COLUMN     "category" "DefenseCategory" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "DefenseStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "faculty_documents" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "remarks" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "faculty_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DefenseFacultyMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DefenseFacultyMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AdviseeMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdviseeMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "faculty_documents_facultyId_category_key" ON "faculty_documents"("facultyId", "category");

-- CreateIndex
CREATE INDEX "_DefenseFacultyMembers_B_index" ON "_DefenseFacultyMembers"("B");

-- CreateIndex
CREATE INDEX "_AdviseeMembers_B_index" ON "_AdviseeMembers"("B");

-- AddForeignKey
ALTER TABLE "faculty_documents" ADD CONSTRAINT "faculty_documents_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefenseFacultyMembers" ADD CONSTRAINT "_DefenseFacultyMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "defense_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefenseFacultyMembers" ADD CONSTRAINT "_DefenseFacultyMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdviseeMembers" ADD CONSTRAINT "_AdviseeMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "advisees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdviseeMembers" ADD CONSTRAINT "_AdviseeMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
