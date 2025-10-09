"use server";

import prisma from "@/lib/prisma";
import { getUsers, GetUsersParams } from "@/src/utils/getUsers";
import { revalidatePath } from "next/cache";

// GET USER INFORMATION
export async function fetchUsersAction(params: GetUsersParams) {
  return await getUsers(params);
}

// DELETE USER
export async function deleteUserAction(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    })

    revalidatePath("/dashboard/faculty")

    return { success: true }
  } catch (error) {
    console.log("Error deleting: ", error)
    return { success: false, error: "Failed to delete user." }
  }
}


// UPDATE USER 
function getFormValue(fd: FormData, key: string, required = false): string | null {
  const value = fd.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return required ? "" : null;
  return trimmed;
}

export async function updateUserAction(id: string, formData: FormData) {
  const staffId = getFormValue(formData, "staffId", true) as string;
  const firstName = getFormValue(formData, "firstName", true) as string;
  const middleName = getFormValue(formData, "middleName", false) as string;
  const lastName = getFormValue(formData, "lastName", true) as string;
  const email = getFormValue(formData, "email", true) as string;
  const phoneNumber = getFormValue(formData, "phoneNumber", false) as string;

  if (!firstName || !lastName || !email) {
    throw new Error("Missing required fields");
  }

  await prisma.user.update({
    where: { id },
    data: {
      staffId,
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
    },
  });

  // Revalidate the faculty list or edit page
  revalidatePath("/dashboard/faculty");
}