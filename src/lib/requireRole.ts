// src/lib/requireRole.ts
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Checks if the current user has the required role.
 * Redirects to /not-authorized if the user is missing or has a different role.
 *
 * @param requiredRole - Role string to check (e.g., "ADMIN", "STAFF")
 * @returns session - The authenticated user session
 */
export const requireRole = async (requiredRole: string) => {
  const session = await auth();

  if (!session?.user || session.user.role !== requiredRole) {
    redirect("/not-authorized");
  }

  return session;
};
