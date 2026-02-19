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

    // jwt : enrichit le token avec les infos de la BDD
    async jwt({ token, user, trigger }) {
      if (token.email) {
        const dbUser = await prisma.utilisateur.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, trancheAgeEnfant: true, preferencesCategories: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.trancheAgeEnfant = dbUser.trancheAgeEnfant;
          token.preferencesCategories = dbUser.preferencesCategories;
        }
      }
      return token;
    },

    // session : expose les infos côté client
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).trancheAgeEnfant = token.trancheAgeEnfant;
        (session.user as any).preferencesCategories = token.preferencesCategories;
      }
      return session;
    },
  },
});
