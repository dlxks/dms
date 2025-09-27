import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ✅ Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    // 🔹 Google OAuth
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // 🔹 Credentials (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = credentials as { email: string; password: string };

        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(creds.password, user.password);
        if (!isValid) return null;

        return user;
      }
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },

  },

  pages: {
    signIn: "/signin",
  }
});
