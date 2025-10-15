/*
  Warnings:

  - You are about to drop the `Advisee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DefenseRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DefenseSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Advisee" DROP CONSTRAINT "Advisee_adviserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Advisee" DROP CONSTRAINT "Advisee_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Announcement" DROP CONSTRAINT "Announcement_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."DefenseRequirement" DROP CONSTRAINT "DefenseRequirement_defenseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DefenseRequirement" DROP CONSTRAINT "DefenseRequirement_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DefenseSchedule" DROP CONSTRAINT "DefenseSchedule_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."DefenseSchedule" DROP CONSTRAINT "DefenseSchedule_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DefenseSchedule" DROP CONSTRAINT "DefenseSchedule_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DefenseSchedule" DROP CONSTRAINT "DefenseSchedule_updatedBy_fkey";

-- DropTable
DROP TABLE "public"."Advisee";

-- DropTable
DROP TABLE "public"."Announcement";

-- DropTable
DROP TABLE "public"."DefenseRequirement";

-- DropTable
DROP TABLE "public"."DefenseSchedule";

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "files" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_schedules" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "defense_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense_requirements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "defenseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "defense_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advisees" (
    "id" TEXT NOT NULL,
    "adviserId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "advisees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advisees_studentId_key" ON "advisees"("studentId");

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_schedules" ADD CONSTRAINT "defense_schedules_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_schedules" ADD CONSTRAINT "defense_schedules_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_schedules" ADD CONSTRAINT "defense_schedules_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_schedules" ADD CONSTRAINT "defense_schedules_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_requirements" ADD CONSTRAINT "defense_requirements_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_requirements" ADD CONSTRAINT "defense_requirements_defenseId_fkey" FOREIGN KEY ("defenseId") REFERENCES "defense_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisees" ADD CONSTRAINT "advisees_adviserId_fkey" FOREIGN KEY ("adviserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advisees" ADD CONSTRAINT "advisees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
