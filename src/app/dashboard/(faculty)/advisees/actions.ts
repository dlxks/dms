"use server";

import prisma from "@/lib/prisma";
import { AdviseeStatus } from "@/src/app/generated/prisma";
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
   Add Advisee
---------------------------------------------------*/
/**
 * Creates a new advisee request for a given adviser and student.
 * Rules:
 *  - Cannot create if the student already has an ACTIVE adviser.
 *  - Cannot create if there is a PENDING request for the student.
 *  - Allows creation if the most recent advisee is INACTIVE or none exists.
 */
export async function addAdvisee({
  adviserId,
  studentId,
}: {
  adviserId: string;
  studentId: string;
}) {
  if (!adviserId || !studentId) {
    return { success: false, message: "Missing required fields." };
  }

  // Get all advisee records for this student
  const existingRecords = await prisma.advisee.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });

  // Check if student already has an active adviser
  const hasActive = existingRecords.some((r) => r.status === AdviseeStatus.ACTIVE);
  if (hasActive) {
    return { success: false, message: "This student already has an active adviser." };
  }

  // Check if student has a pending request
  const hasPending = existingRecords.some((r) => r.status === AdviseeStatus.PENDING);
  if (hasPending) {
    return { success: false, message: "This student already has a pending request." };
  }

  try {
    const advisee = await prisma.advisee.create({
      data: {
        adviserId,
        studentId,
        status: AdviseeStatus.PENDING,
      },
      include: { student: true },
    });

    revalidateTag("advisees");

    return {
      success: true,
      message: "Advisee request successfully created.",
      advisee,
    };
  } catch (error) {
    console.error("Error adding advisee:", error);
    return { success: false, message: "Failed to create advisee request." };
  }
}

/* -------------------------------------------------
   Create Advisee (FormData-based)
---------------------------------------------------*/
export async function createAdviseeAction(formData: FormData) {
  const adviserId = getFormValue(formData, "adviserId", true)!;
  const studentId = getFormValue(formData, "studentId", true)!;
  const status =
    (getFormValue(formData, "status") as AdviseeStatus) ?? AdviseeStatus.PENDING;

  await prisma.advisee.create({
    data: { adviserId, studentId, status },
  });

  revalidateTag("advisees");
}

/* -------------------------------------------------
   Update Advisee Info
---------------------------------------------------*/
export async function updateAdviseeAction(id: string, formData: FormData) {
  const adviserId = getFormValue(formData, "adviserId", true)!;
  const studentId = getFormValue(formData, "studentId", true)!;

  await prisma.advisee.update({
    where: { id },
    data: { adviserId, studentId },
  });

  revalidatePath("/dashboard/advisees");
  revalidateTag("advisees");
}

/* -------------------------------------------------
   Update Advisee Status
---------------------------------------------------*/
export async function updateAdviseeStatusAction(id: string, status: AdviseeStatus) {
  try {
    await prisma.advisee.update({
      where: { id },
      data: { status },
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
    await prisma.advisee.delete({ where: { id } });
    revalidateTag("advisees");
    return { success: true };
  } catch (error) {
    console.error("Error deleting advisee:", error);
    return { success: false, error: "Failed to delete advisee." };
  }
}

/* -------------------------------------------------
   Fetch Students for Dropdown (Server-side)
---------------------------------------------------*/
export async function getStudentsServer(query: string) {
  return searchStudents(query);
}

/**
 * Performs student search with basic filtering.
 */
export async function searchStudents(query: string, limit = 10) {
  const q = query.trim();
  if (!q) return [];

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
    select: {
      id: true,
      studentId: true,
      firstName: true,
      middleName: true,
      lastName: true,
    },
    orderBy: { lastName: "asc" },
    take: limit,
  });

  return students.map((s) => ({
    id: s.id,
    name: `${s.studentId} — ${[s.firstName, s.middleName, s.lastName]
      .filter(Boolean)
      .join(" ")}`,
  }));
}
