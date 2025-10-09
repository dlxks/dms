import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!, authorization: {
        params: {
          prompt: "select_account",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          middleName: null, // Google doesn’t provide this
          image: profile.picture,
          role: "STUDENT", // default role, change as needed
        };
      }
    }),

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
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            role: true,
          },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.firstName = dbUser.firstName;
          session.user.middleName = dbUser.middleName;
          session.user.lastName = dbUser.lastName;
          session.user.role = dbUser.role;
        }
      }
      return session;
    }
  },

  pages: {
    signIn: "/signin",
  },

  events: {
    // This runs when a user is created for the first time
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          middleName: null, // default
        },
      });
    },
  },
});
