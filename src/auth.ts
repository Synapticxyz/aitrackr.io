import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createCustomer } from '@/lib/stripe'
import type { SubscriptionStatus } from '@prisma/client'

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/auth/signin',
    newUser: '/dashboard',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.hashedPassword) return null
        if (user.deletedAt) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        )
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          subscriptionStatus: user.subscriptionStatus,
          timezone: user.timezone,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      // Block soft-deleted users
      if (dbUser?.deletedAt) return false

      // Create Stripe customer for new users on OAuth sign-in
      if (account?.provider === 'google' && dbUser && !dbUser.stripeCustomerId) {
        try {
          const customerId = await createCustomer(user.email, user.name)
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { stripeCustomerId: customerId },
          })
        } catch (err) {
          console.error('[Auth] Failed to create Stripe customer:', err)
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.subscriptionStatus = (user as { subscriptionStatus: SubscriptionStatus }).subscriptionStatus ?? 'FREE'
        token.timezone = (user as { timezone: string }).timezone ?? 'UTC'
      }

      // Refresh subscription status from DB on each token refresh
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { subscriptionStatus: true, timezone: true, deletedAt: true },
        })
        if (dbUser?.deletedAt) return token // Will be blocked on next request
        if (dbUser) {
          token.subscriptionStatus = dbUser.subscriptionStatus
          token.timezone = dbUser.timezone
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.subscriptionStatus = token.subscriptionStatus as SubscriptionStatus
        session.user.timezone = token.timezone as string
      }
      return session
    },
  },
})
