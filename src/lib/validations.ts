import { z } from 'zod'

export const usageLogSchema = z.object({
  tool: z.string().min(1).max(100),
  model: z.string().max(100).optional(),
  feature: z.string().min(1).max(100),
  durationSeconds: z.number().int().min(1).max(86400),
  sessionId: z.string().min(1).max(200),
  timestamp: z.string().datetime(),
})

export const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  provider: z.string().min(1, 'Provider is required').max(100),
  cost: z.number().min(0, 'Cost must be positive').max(100000),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
  nextBillingDate: z.string().datetime().or(z.string().date()),
  category: z.enum(['TEXT_GEN', 'IMAGE_GEN', 'CODE', 'VIDEO', 'AUDIO', 'RESEARCH', 'OTHER']),
  features: z.array(z.string().min(1)).min(1, 'At least one feature required'),
  url: z.string().url().optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
})

export const subscriptionUpdateSchema = subscriptionSchema.partial().extend({
  id: z.string().cuid(),
  isActive: z.boolean().optional(),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().min(1).max(100).optional(),
  currency: z.string().length(3).optional(),
  emailPreferences: z
    .object({
      marketing: z.boolean(),
      renewalAlerts: z.boolean(),
    })
    .optional(),
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const dismissAlertSchema = z.object({
  alertId: z.string().cuid(),
})

export type UsageLogInput = z.infer<typeof usageLogSchema>
export type SubscriptionInput = z.infer<typeof subscriptionSchema>
export type SubscriptionUpdateInput = z.infer<typeof subscriptionUpdateSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
