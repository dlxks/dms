import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

// --- Type augmentation ---
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
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: { params: { prompt: "select_account" } },
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          middleName: null,
          image: profile.picture,
          role: "STUDENT", // default role for new Google users
        };
      },
    }),
  ],

  callbacks: {
    /**
     * ✅ signIn callback
     * Automatically links existing manual users to Google login.
     */
    async signIn({ user, account }) {
      if (!user.email || !account || account.provider !== "google") return true;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        // Check if already linked to Google
        const existingAccount = await prisma.account.findFirst({
          where: { provider: "google", userId: existingUser.id },
        });

        // If not, link Google account manually
        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: "oauth",
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              id_token: account.id_token,
              scope: account.scope,
              expires_at: account.expires_at,
              token_type: account.token_type,
            },
          });
        }

        // Sync role for consistency
        user.id = existingUser.id;
        user.role = existingUser.role;
      }

      return true;
    },

    /**
     * ✅ session callback
     * Enrich session with database fields.
     */
    async session({ session }) {
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
    },
  },

  pages: {
    signIn: "/signin",
  },

  events: {
    async createUser({ user }) {
      // Ensures nullable fields are properly set on creation
      await prisma.user.update({
        where: { id: user.id },
        data: { middleName: null },
      });
    },
  },
});
