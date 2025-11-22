/**
 * Edge-compatible auth configuration
 * Used in middleware where Prisma cannot be used
 * 
 * IMPORTANT: This must be truly edge-compatible with NO database access
 */

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

// Minimal auth config for edge runtime (no Prisma, no database adapter)
export const authEdgeConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [], // Providers not needed in middleware
  callbacks: {
    async jwt({ token }) {
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
  // Disable all callbacks that might try to access database
  trustHost: true,
};

export const { auth: authEdge, handlers, signIn, signOut } = NextAuth(authEdgeConfig);
