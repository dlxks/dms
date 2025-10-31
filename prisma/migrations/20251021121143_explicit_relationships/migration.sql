/*
  Warnings:

  - You are about to drop the `_DefenseFacultyMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_DefenseFacultyMembers" DROP CONSTRAINT "_DefenseFacultyMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DefenseFacultyMembers" DROP CONSTRAINT "_DefenseFacultyMembers_B_fkey";

-- DropTable
DROP TABLE "public"."_DefenseFacultyMembers";

-- CreateTable
CREATE TABLE "defense_faculty_members" (
    "defenseId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "defense_faculty_members_pkey" PRIMARY KEY ("defenseId","facultyId")
);

-- AddForeignKey
ALTER TABLE "defense_faculty_members" ADD CONSTRAINT "defense_faculty_members_defenseId_fkey" FOREIGN KEY ("defenseId") REFERENCES "defense_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense_faculty_members" ADD CONSTRAINT "defense_faculty_members_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
