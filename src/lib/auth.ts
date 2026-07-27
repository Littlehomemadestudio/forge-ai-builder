import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    }),
    CredentialsProvider({
      name: 'Demo Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        // For demo: accept any password, find or create user
        let user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          // Auto-create user for demo flow
          user = await db.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              plan: 'free',
              aiCredits: 100,
            },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth: create or update user in our database
      if (account?.provider === 'google' && user.email) {
        let existingUser = await db.user.findUnique({
          where: { email: user.email },
        })

        if (!existingUser) {
          existingUser = await db.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split('@')[0],
              avatarUrl: user.image || null,
              plan: 'free',
              aiCredits: 100,
            },
          })
        } else {
          // Update avatar URL if changed
          if (user.image && existingUser.avatarUrl !== user.image) {
            await db.user.update({
              where: { id: existingUser.id },
              data: { avatarUrl: user.image },
            })
          }
        }
        // Attach our DB user id to the NextAuth user object for JWT
        user.id = existingUser.id
      }

      return true
    },
    async jwt({ token, user, account }) {
      // Persist the user id and extra info in the JWT token
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image

        // Fetch user details from DB to include in token
        const dbUser = await db.user.findUnique({
          where: { email: user.email as string },
        })
        if (dbUser) {
          token.dbId = dbUser.id
          token.plan = dbUser.plan
          token.aiCredits = dbUser.aiCredits
        }
      }

      // On subsequent calls, refresh credits from DB
      if (token.dbId) {
        const dbUser = await db.user.findUnique({
          where: { id: token.dbId as string },
        })
        if (dbUser) {
          token.aiCredits = dbUser.aiCredits
          token.plan = dbUser.plan
          token.name = dbUser.name
        }
      }

      return token
    },
    async session({ session, token }) {
      // Transfer JWT data to the session object for client use
      if (session.user) {
        session.user.id = token.dbId as string || token.sub as string
        session.user.plan = token.plan as string || 'free'
        session.user.aiCredits = token.aiCredits as number || 100
      }
      return session
    },
  },
  pages: {
    signIn: '/', // Use our custom login page (SPA handles it via store)
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Type augmentation for NextAuth session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      plan: string
      aiCredits: number
    }
  }
  interface User {
    id: string
    plan?: string
    aiCredits?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    dbId?: string
    plan?: string
    aiCredits?: number
  }
}
