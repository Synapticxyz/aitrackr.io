import {
  Body, Button, Container, Head, Heading, Html,
  Preview, Text, Hr,
} from '@react-email/components'
import { format } from 'date-fns'
import { formatMoney } from '@/lib/currencies'

interface RenewalAlertEmailProps {
  subscriptionName: string
  cost: number
  renewalDate: Date
  currency?: string
}

export default function RenewalAlertEmail({ subscriptionName, cost, renewalDate, currency = 'EUR' }: RenewalAlertEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aitrackr.io'
  const formattedDate = format(renewalDate, 'MMMM d, yyyy')
  const formattedCost = formatMoney(cost, currency ?? 'EUR')

  return (
    <Html>
      <Head />
      <Preview>{subscriptionName} renews on {formattedDate} for {formattedCost}</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ color: '#1a1a2e', fontSize: '24px' }}>
            Renewal Reminder 📅
          </Heading>
          <Text style={{ color: '#444', fontSize: '16px', lineHeight: '1.6' }}>
            Your <strong>{subscriptionName}</strong> subscription renews on{' '}
            <strong>{formattedDate}</strong> for <strong>{formattedCost}</strong>.
          </Text>
          <Text style={{ color: '#444', fontSize: '16px' }}>
            Head to your dashboard to review usage and decide if you still need it.
          </Text>
          <Hr />
          <Button
            href={`${appUrl}/dashboard/subscriptions`}
            style={{ backgroundColor: '#6366f1', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontSize: '16px' }}
          >
            Review Subscription
          </Button>
          <Text style={{ color: '#888', fontSize: '12px', marginTop: '32px' }}>
            AiTrackr · <a href={`${appUrl}/privacy`} style={{ color: '#888' }}>Privacy Policy</a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
