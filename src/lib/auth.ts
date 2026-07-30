import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

/**
 * Resolve a user by email OR username.
 * Identifier can be an email (contains "@") or a username.
 */
async function findUserByIdentifier(identifier: string) {
  const trimmed = identifier.trim().toLowerCase()
  if (!trimmed) return null

  // If it looks like an email, query by email
  if (trimmed.includes('@')) {
    return await db.user.findUnique({ where: { email: trimmed } })
  }

  // Otherwise treat as username — username is stored case-sensitively,
  // so try the trimmed input and a lowercased variant
  return await db.user.findUnique({
    where: { username: identifier.trim() },
  }) ?? await db.user.findUnique({
    where: { username: trimmed },
  })
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Forge Login',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Email/username and password are required')
        }

        const user = await findUserByIdentifier(credentials.identifier)

        // Friendly error if no such user
        if (!user) {
          throw new Error('No account found with that email or username. Please sign up first.')
        }

        // OAuth-only accounts (registered via Google) have no password
        if (!user.passwordHash) {
          throw new Error('This account was created with Google. Please use "Continue with Google" to sign in.')
        }

        // Verify password with bcrypt
        const passwordMatches = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!passwordMatches) {
          throw new Error('Incorrect password. Please try again.')
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
    async signIn({ user, account }) {
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
              provider: 'google',
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
      // Persist the user id and extra info in the JWT token on first sign-in
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
    // Use our custom login page (SPA handles navigation via store)
    signIn: '/',
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
