import type { SubscriptionStatus, BillingCycle, AICategory, AlertType } from '@prisma/client'

export type { SubscriptionStatus, BillingCycle, AICategory, AlertType }

export interface ApiErrorResponse {
  error: string
  code: string
  status: number
}

export interface UsageLogPayload {
  tool: string
  model?: string
  feature: string
  durationSeconds: number
  sessionId: string
  timestamp: string
}

export interface SubscriptionPayload {
  name: string
  provider: string
  cost: number
  billingCycle: BillingCycle
  nextBillingDate: string
  category: AICategory
  features: string[]
  url?: string
  notes?: string
}

export interface OverlapAlertData {
  id: string
  type: AlertType
  description: string
  affectedSubscriptionIds: string[]
  potentialSavings: number
  dismissed: boolean
  createdAt: string
}

export interface DashboardStats {
  totalMonthlySpend: number
  totalSubscriptions: number
  activeAlerts: number
  todayUsageMinutes: number
  topTool: string | null
}

export interface UsageByTool {
  tool: string
  minutes: number
  percentage: number
}

export interface SpendByCategory {
  category: AICategory
  amount: number
  percentage: number
}

export interface EmailPreferences {
  marketing: boolean
  renewalAlerts: boolean
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      subscriptionStatus: SubscriptionStatus
      timezone: string
    }
  }

  interface User {
    id: string
    subscriptionStatus: SubscriptionStatus
    timezone: string
    deletedAt?: Date | null
  }
}

// JWT module augmentation - handled in auth.ts callbacks

