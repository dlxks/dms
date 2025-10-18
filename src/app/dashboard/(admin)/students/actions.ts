"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUsers, GetUsersParams } from "@/src/utils/getUsers";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */
export interface CreateStudentProps {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  providerAccountId?: string;
}

/* -------------------------------------------------------------------------- */
/*                                 FETCH USERS                                */
/* -------------------------------------------------------------------------- */
export async function fetchUsersAction(params: GetUsersParams) {
  return await getUsers(params);
}

/* -------------------------------------------------------------------------- */
/*                                CREATE STUDENT                              */
/* -------------------------------------------------------------------------- */
export async function createStudentAction(data: CreateStudentProps) {
  const { firstName, lastName, email, image } = data;

  if (!firstName || !lastName || !email) {
    throw new Error("Missing required fields");
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Create new user without creating Account record
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role: "STUDENT",
        image:
          image ||
          `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}+${lastName}`,
        emailVerified: new Date(), // optional: mark as verified
      },
    });

    // Revalidate student dashboard
    revalidatePath("/dashboard/students");

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, message: "Failed to create student" };
  }
}

/* -------------------------------------------------------------------------- */
/*                                DELETE STUDENT                              */
/* -------------------------------------------------------------------------- */
export async function deleteUserAction(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user." };
  }
}

/* -------------------------------------------------------------------------- */
/*                                UPDATE STUDENT                              */
/* -------------------------------------------------------------------------- */
function getFormValue(fd: FormData, key: string, required = false): string | null {
  const value = fd.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return required ? "" : null;
  return trimmed;
}

export async function updateUserAction(id: string, formData: FormData) {
  const studentId = getFormValue(formData, "studentId", false);
  const firstName = getFormValue(formData, "firstName", true);
  const middleName = getFormValue(formData, "middleName", false);
  const lastName = getFormValue(formData, "lastName", true);
  const email = getFormValue(formData, "email", true);
  const phoneNumber = getFormValue(formData, "phoneNumber", false);

  if (!firstName || !lastName || !email) {
    throw new Error("Missing required fields: first name, last name, or email.");
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        studentId: studentId || null,
        firstName,
        middleName: middleName || null,
        lastName,
        email,
        phoneNumber: phoneNumber || null,
      },
    });

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update student information");
  }
}
