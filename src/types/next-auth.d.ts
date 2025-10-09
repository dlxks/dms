import { DefaultUser } from "@auth/core/types"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
  }
}
