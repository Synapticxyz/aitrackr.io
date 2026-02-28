import { Resend } from 'resend'
import { createElement } from 'react'
import WelcomeEmail from '@/emails/welcome'
import RenewalAlertEmail from '@/emails/renewal-alert'
import DataExportEmail from '@/emails/data-export'
import AccountDeletedEmail from '@/emails/account-deleted'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@aitrackr.io'

async function send(to: string, subject: string, reactElement: React.ReactElement) {
  try {
    const { error } = await resend.emails.send({
      from: `AiTrackr <${FROM}>`,
      to,
      subject,
      react: reactElement,
    })
    if (error) {
      console.error('[Email] Send failed:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('[Email] Unexpected error:', err)
    return false
  }
}

export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  return send(
    to,
    'Welcome to AiTrackr! 🎉',
    createElement(WelcomeEmail, { name })
  )
}

export async function sendRenewalAlertEmail(
  to: string,
  subscriptionName: string,
  cost: number,
  renewalDate: Date,
  currency = 'EUR'
): Promise<boolean> {
  return send(
    to,
    `Reminder: ${subscriptionName} renews soon`,
    createElement(RenewalAlertEmail, { subscriptionName, cost, renewalDate, currency })
  )
}

export async function sendDataExportEmail(to: string, name: string): Promise<boolean> {
  return send(
    to,
    'Your AiTrackr data export is ready',
    createElement(DataExportEmail, { name })
  )
}

export async function sendAccountDeletedEmail(to: string, name: string): Promise<boolean> {
  return send(
    to,
    'Your AiTrackr account has been scheduled for deletion',
    createElement(AccountDeletedEmail, { name })
  )
}
