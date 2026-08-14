import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";

export const authConfig: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        });

        if (!user) {
          return null;
        }

        if (user.status !== UserStatus.ACTIVE) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            userRoles: {
              include: {
                role: true,
              },
              orderBy: {
                assignedAt: "asc",
              },
            },
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.displayName = dbUser.displayName;
          token.isSystem = dbUser.isSystem;
          token.roles = dbUser.userRoles.map(
            (userRole) => userRole.role.slug
          );
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.displayName = token.displayName as string;
        session.user.isSystem = token.isSystem as boolean;
        session.user.roles = (token.roles as string[]) ?? [];
      }

      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};