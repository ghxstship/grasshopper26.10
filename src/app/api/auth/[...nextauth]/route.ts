import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { NextAuthConfig, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { isLockedOut, recordFailedAttempt, clearFailedAttempts } from "@/lib/security/brute-force";
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { AuthService } from '@/lib/services/auth/nextauth.service';




export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as NextAuthConfig['adapter'],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
    newUser: "/auth/onboarding",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email as string;

        // Check if account is locked out
        const lockStatus = isLockedOut(email);
        if (lockStatus.locked) {
          const remainingMinutes = Math.ceil((lockStatus.remainingMs || 0) / 60000);
          throw new Error(`Account locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`);
        }

        const user = await new AuthService().findById({
          where: { email },
          include: {
            compvssProfile: true,
            atlvsProfile: true,
          }
        });

        if (!user || !user.password) {
          // Record failed attempt
          const result = recordFailedAttempt(email);
          if (result.remainingAttempts > 0) {
            throw new Error(`Invalid credentials. ${result.remainingAttempts} attempts remaining.`);
          } else {
            throw new Error("Account locked due to too many failed attempts.");
          }
        }

        const isValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          // Record failed attempt
          const result = recordFailedAttempt(email);
          if (result.remainingAttempts > 0) {
            throw new Error(`Invalid credentials. ${result.remainingAttempts} attempts remaining.`);
          } else {
            throw new Error("Account locked due to too many failed attempts.");
          }
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in");
        }

        // Clear failed attempts on successful login
        clearFailedAttempts(email);

        return {
          id: user.id,
          name: user.name || '',
          email: user.email,
          image: user.image,
          role: user.role,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    // Bluesky OAuth Provider
    {
      id: "bluesky",
      name: "Bluesky",
      type: "oauth",
      authorization: {
        url: "https://bsky.social/oauth/authorize",
        params: {
          scope: "profile email",
          response_type: "code",
        },
      },
      token: "https://bsky.social/oauth/token",
      userinfo: "https://bsky.social/oauth/userinfo",
      profile(profile: {
        sub: string;
        name?: string;
        preferred_username?: string;
        email: string;
        picture?: string;
      }) {
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username || 'Bluesky User',
          email: profile.email,
          image: profile.picture || null,
          role: 'CONSUMER',
        };
      },
      clientId: process.env.BLUESKY_CLIENT_ID!,
      clientSecret: process.env.BLUESKY_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    } as NextAuthConfig['providers'][number],
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, ensure email is verified
      if (account?.provider !== "credentials") {
        if (user.email) {
          await new AuthService().update({
            where: { email: user.email },
            data: { emailVerified: new Date() }
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }: { token: JWT; user?: User; trigger?: string; session?: Session }) {
      // Initial sign in
      if (user) {
        token.id = user.id as string;
        token.role = (user as User & { role?: string }).role;
        token.email = user.email as string;
        token.name = (user.name || '') as string;
        token.picture = user.image as string;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // Log sign in event
      await new AuthService().create({
        data: {
          userId: user.id,
          action: "SIGN_IN",
          entity: "User",
          entityId: user.id,
          metadata: {
            provider: account?.provider,
            isNewUser,
          },
        },
      });
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const { handlers } = NextAuth(authConfig);
const { GET: authGET, POST: authPOST } = handlers;

// Export dynamic route segment config
export const dynamic = 'force-dynamic';

// NextAuth handlers
export const GET = authGET;
export const POST = authPOST;
