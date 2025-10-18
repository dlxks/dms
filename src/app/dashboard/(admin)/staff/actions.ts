"use server";

import prisma from "@/lib/prisma";
import { getUsers, GetUsersParams } from "@/src/utils/getUsers";
import { revalidatePath } from "next/cache";
import { success } from "zod";
import { da } from "zod/v4/locales";


/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */
export interface CreateStaffProps {
  firstName: string,
  lastName: string
  email: string,
  image?: string;
}

/* -------------------------------------------------------------------------- */
/*                                 FETCH USERS                                */
/* -------------------------------------------------------------------------- */
export async function fetchUsersAction(params: GetUsersParams) {
  try {
    return await getUsers(params);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users.");
  }
}

/* -------------------------------------------------------------------------- */
/*                                CREATE STAFF                              */
/* -------------------------------------------------------------------------- */
export async function createStaffAction(data: CreateStaffProps) {
  const { firstName, lastName, email, image } = data

  if (!firstName || !lastName || !email) {
    throw new Error("Missing required fields.")
  }

  try {
    const existingUser = await prisma.user.findMany({
      where: { email }
    })

    if (existingUser) {
      return { success: false, message: "Staff already exists." }
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role: "STAFF",
        image: image ||
          `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}+${lastName}`,
        emailVerified: new Date()
      }
    })

    revalidatePath("/dashboard/staff")

    return { success: true, user: newUser }
  } catch (error) {
    console.error("Error adding user: ", error)
    return { success: false, message: "Failed to create user." }
  }
}

/* -------------------------------------------------------------------------- */
/*                                DELETE STUDENT                              */
/* -------------------------------------------------------------------------- */
export async function deleteUserAction(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user." };
  }
}

/* -------------------------------------------------------------------------- */
/*                                 UPDATE STAFF                               */
/* -------------------------------------------------------------------------- */
function getFormValue(
  formData: FormData,
  key: string,
  required = false
): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed && required) return "";
  return trimmed || null;
}

export async function updateUserAction(id: string, formData: FormData) {
  try {
    const staffId = getFormValue(formData, "staffId", true);
    const firstName = getFormValue(formData, "firstName", true);
    const middleName = getFormValue(formData, "middleName");
    const lastName = getFormValue(formData, "lastName", true);
    const email = getFormValue(formData, "email", true);
    const phoneNumber = getFormValue(formData, "phoneNumber");

    if (!firstName || !lastName || !email) {
      throw new Error("Missing required fields.");
    }

    await prisma.user.update({
      where: { id },
      data: {
        staffId: staffId ?? undefined,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
      },
    });

    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user." };
  }
}
