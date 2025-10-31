"use server";

import prisma from "@/lib/prisma";
import { getUsers, GetUsersParams } from "@/src/utils/getUsers";
import { revalidatePath } from "next/cache";
import { success } from "zod";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */
export interface CreateFacultyProps {
  firstName: string,
  lastName: string,
  email: string
  image?: string
}

/* -------------------------------------------------------------------------- */
/*                                 FETCH USERS                                */
/* -------------------------------------------------------------------------- */
export async function fetchUsersAction(params: GetUsersParams) {
  return await getUsers(params);
}

/* -------------------------------------------------------------------------- */
/*                                CREATE FACULTY                              */
/* -------------------------------------------------------------------------- */
export async function createFacultyAction(data: CreateFacultyProps) {
  const { firstName, lastName, email, image } = data

  if (!firstName || !lastName || !email) {
    throw new Error("Missing required fields.")
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, message: "Faculty already exisits." }
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role: "FACULTY",
        image: image ||
          `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}+${lastName}`,
        emailVerified: new Date()
      }
    })

    revalidatePath("/dashboard/faculty")

    return { success: true, user: newUser }
  } catch (error) {
    console.error("Error adding user: ", error)
    return { success: false, message: "Failed to create user." }
  }
}

/* -------------------------------------------------------------------------- */
/*                                DELETE FACULTY                              */
/* -------------------------------------------------------------------------- */
export async function deleteUserAction(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/faculty");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user." };
  }
}

/* -------------------------------------------------------------------------- */
/*                                UPDATE FACULTY                              */
/* -------------------------------------------------------------------------- */
function getFormValue(fd: FormData, key: string, required = false): string | null {
  const value = fd.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? (required ? "" : null) : trimmed;
}

export async function updateUserAction(id: string, formData: FormData) {
  const staffId = getFormValue(formData, "staffId", true);
  const firstName = getFormValue(formData, "firstName", true);
  const middleName = getFormValue(formData, "middleName");
  const lastName = getFormValue(formData, "lastName", true);
  const email = getFormValue(formData, "email", true);
  const phoneNumber = getFormValue(formData, "phoneNumber");

  if (!firstName || !lastName || !email) {
    throw new Error("Missing required fields");
  }

  await prisma.user.update({
    where: { id },
    data: { staffId, firstName, middleName, lastName, email, phoneNumber },
  });

  revalidatePath("/dashboard/faculty");
}
