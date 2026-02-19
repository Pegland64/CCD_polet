import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    // signIn : upsert utilisateur en BDD (Node.js uniquement)
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await prisma.utilisateur.upsert({
          where: { email: user.email },
          update: {
            authProviderId: account.providerAccountId,
            prenom: user.name?.split(" ")[0] ?? null,
            nom: user.name?.split(" ").slice(1).join(" ") ?? null,
          },
          create: {
            authProviderId: account.providerAccountId,
            email: user.email,
            prenom: user.name?.split(" ")[0] ?? null,
            nom: user.name?.split(" ").slice(1).join(" ") ?? null,
            role: "abonne",
          },
        });
      }
      return true;
    },

    // jwt : enrichit le token avec id + role depuis la BDD (Node.js uniquement)
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.utilisateur.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    // session : expose id + role côté client
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
