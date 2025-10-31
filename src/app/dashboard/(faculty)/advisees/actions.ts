"use server";

import prisma from "@/lib/prisma";
import { AdviseeStatus, MemberType } from "@/src/app/generated/prisma";
import { getAdvisees, GetAdviseesParams } from "@/src/utils/getAdvisees";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

/* -------------------------------------------------
   Utility: Safe FormData Reader
---------------------------------------------------*/
function getFormValue(fd: FormData, key: string, required = false): string | null {
  const value = fd.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (required && !trimmed) throw new Error(`Missing field: ${key}`);
  return trimmed || null;
}

/* -------------------------------------------------
   Fetch Advisees (Cached)
---------------------------------------------------*/
export const fetchAdviseesAction = unstable_cache(
  async (params: GetAdviseesParams) => getAdvisees(params),
  ["advisees"],
  { tags: ["advisees"] }
);

/* -------------------------------------------------
   Fetch Faculty
---------------------------------------------------*/
export async function getFacultyServer() {
  const faculty = await prisma.user.findMany({
    where: { role: { in: ["FACULTY", "STAFF"] } },
    select: { id: true, firstName: true, middleName: true, lastName: true },
    orderBy: { lastName: "asc" },
  });

  return faculty.map((f) => ({
    id: f.id,
    name: [f.firstName, f.middleName, f.lastName].filter(Boolean).join(" "),
  }));
}

/* -------------------------------------------------
   Add Advisee
---------------------------------------------------*/
export async function addAdvisee({
  adviserId,
  studentId,
  memberIds = [],
}: {
  adviserId: string;
  studentId: string;
  memberIds?: string[];
}) {
  if (!adviserId || !studentId) {
    return { success: false, message: "Missing required fields." };
  }

  try {
    // Ensure student exists and is indeed a STUDENT
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { role: true },
    });

    if (!student || student.role !== "STUDENT") {
      return { success: false, message: "Selected user is not a student." };
    }

    // Check existing advisee records
    const existing = await prisma.advisee.findMany({
      where: { studentId },
      select: { status: true },
    });

    if (existing.some((r) => r.status === AdviseeStatus.ACTIVE))
      return { success: false, message: "This student already has an active adviser." };

    if (existing.some((r) => r.status === AdviseeStatus.PENDING))
      return { success: false, message: "This student already has a pending request." };

    // Create new advisee record
    const advisee = await prisma.advisee.create({
      data: {
        adviserId,
        studentId,
        status: AdviseeStatus.PENDING,
        members: {
          create: memberIds.map((id) => ({
            memberId: id,
            type: MemberType.MEMBER,
          })),
        },
      },
      include: {
        adviser: true,
        student: true,
        members: { include: { member: true } },
      },
    });

    revalidateTag("advisees");

    return {
      success: true,
      message: "Advisee request created successfully.",
      advisee,
    };
  } catch (error) {
    console.error("Error adding advisee:", error);
    return { success: false, message: "Failed to create advisee request." };
  }
}

/* -------------------------------------------------
   Update Advisee
---------------------------------------------------*/
export async function updateAdviseeAction(id: string, formData: FormData) {
  try {
    const adviserId = getFormValue(formData, "adviserId", true)!;
    const studentId = getFormValue(formData, "studentId", true)!;
    const memberIds = (formData.getAll("memberIds") as string[])?.filter(Boolean) || [];
    const status = getFormValue(formData, "status") as AdviseeStatus | undefined;

    await prisma.advisee.update({
      where: { id },
      data: {
        adviserId,
        studentId,
        ...(status && { status }),
        updatedAt: new Date(),
        members: {
          deleteMany: {},
          create: memberIds.map((id) => ({
            memberId: id,
            type: MemberType.MEMBER,
          })),
        },
      },
    });


    revalidatePath("/dashboard/advisees");
    revalidateTag("advisees");
    return { success: true, message: "Advisee updated successfully." };
  } catch (error) {
    console.error("Error updating advisee:", error);
    return { success: false, message: "Failed to update advisee." };
  }
}

/* -------------------------------------------------
   Update Advisee Status
---------------------------------------------------*/
export async function updateAdviseeStatusAction(id: string, status: AdviseeStatus) {
  try {
    await prisma.advisee.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });

    revalidateTag("advisees");
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Failed to update status." };
  }
}

/* -------------------------------------------------
   Delete Advisee
---------------------------------------------------*/
export async function deleteAdviseeAction(id: string) {
  try {
    const advisee = await prisma.advisee.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!advisee) return { success: false, error: "Advisee not found." };

    await prisma.adviseeMember.deleteMany({ where: { adviseeId: id } });
    await prisma.advisee.delete({ where: { id } });

    revalidateTag("advisees");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting advisee:", error);
    return { success: false, error: "Failed to delete advisee." };
  }
}

/* -------------------------------------------------
   Fetch Students
---------------------------------------------------*/
export async function getStudentsServer(query: string) {
  // normalize query (empty string allowed)
  return searchStudents(query || "", 20); // default initial limit 20
}

export async function searchStudents(query: string, limit = 10) {
  const q = query.trim();

  // If no query provided -> return the first `limit` students for initial list
  if (!q) {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, studentId: true, firstName: true, middleName: true, lastName: true },
      orderBy: { lastName: "asc" },
      take: limit,
    });

    return students.map((s) => ({
      id: s.id,
      name: `${s.studentId} — ${[s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ")}`,
    }));
  }

  // Otherwise do the filtered search (existing behavior)
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      OR: [
        { studentId: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { middleName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, studentId: true, firstName: true, middleName: true, lastName: true },
    orderBy: { lastName: "asc" },
    take: limit,
  });

  return students.map((s) => ({
    id: s.id,
    name: `${s.studentId} — ${[s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ")}`,
  }));
}
