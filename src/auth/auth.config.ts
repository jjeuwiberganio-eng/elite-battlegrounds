import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";
import {
  assertNotRateLimited,
  recordFailedLoginAttempt,
  resetLoginAttempts,
  verifyOtpCode,
  isKnownLoginSource,
  sendNewDeviceAlert,
  logActivity,
  extractIpAddress,
  extractUserAgent,
} from "@/src/auth/auth-security";

export const authConfig: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Shorter than the NextAuth default (30 days) - an admin panel
    // should force periodic re-login rather than stay signed in
    // indefinitely.
    maxAge: 24 * 60 * 60, // 24 hours
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

        otpCode: {
          label: "Login Code",
          type: "text",
        },
      },

      async authorize(credentials, req) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.otpCode
        ) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;
        const otpCode = credentials.otpCode.trim();

        const ipAddress = await extractIpAddress(
          req?.headers as Record<string, string | string[]> | undefined
        );

        const userAgent = await extractUserAgent(
          req?.headers as Record<string, string | string[]> | undefined
        );

        await assertNotRateLimited(email);

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
          await recordFailedLoginAttempt(email);

          await logActivity({
            action: "LOGIN",
            entity: "User",
            description: `Failed login attempt for ${email} (unknown account)`,
            ipAddress,
            userAgent,
          });

          return null;
        }

        if (user.status !== UserStatus.ACTIVE) {
          await recordFailedLoginAttempt(email);

          await logActivity({
            userId: user.id,
            action: "LOGIN",
            entity: "User",
            description: `Failed login attempt for ${email} (account not active)`,
            ipAddress,
            userAgent,
          });

          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatches) {
          await recordFailedLoginAttempt(email);

          await logActivity({
            userId: user.id,
            action: "LOGIN",
            entity: "User",
            description: `Failed login attempt for ${email} (wrong password)`,
            ipAddress,
            userAgent,
          });

          return null;
        }

        const otpValid = await verifyOtpCode(email, otpCode);

        if (!otpValid) {
          await recordFailedLoginAttempt(email);

          await logActivity({
            userId: user.id,
            action: "LOGIN",
            entity: "User",
            description: `Failed login attempt for ${email} (invalid or expired code)`,
            ipAddress,
            userAgent,
          });

          return null;
        }

        // Full login succeeded - clear the failure counter.
        await resetLoginAttempts(email);

        const isKnownSource = await isKnownLoginSource(
          user.id,
          ipAddress
        );

        if (!isKnownSource) {
          try {
            await sendNewDeviceAlert(
              user.email,
              ipAddress,
              userAgent
            );
          } catch (error) {
            // A failed alert email should never block a legitimate,
            // fully-verified login.
            console.error(
              "Failed to send new-device alert:",
              error
            );
          }
        }

        await logActivity({
          userId: user.id,
          action: "LOGIN",
          entity: "User",
          description: `Successful login for ${email}`,
          ipAddress,
          userAgent,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          username: user.username,
          displayName: user.displayName,
          isSystem: user.isSystem,
          roles: user.userRoles.map(
            (userRole) => userRole.role.slug
          ),
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
