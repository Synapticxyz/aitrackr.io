import {
  Body, Button, Container, Head, Heading, Html,
  Preview, Text,
} from '@react-email/components'

interface DataExportEmailProps {
  name: string
}

export default function DataExportEmail({ name }: DataExportEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aitrackr.io'
  return (
    <Html>
      <Head />
      <Preview>Your AiTrackr data export is ready to download</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ color: '#1a1a2e', fontSize: '24px' }}>
            Your Data Export is Ready
          </Heading>
          <Text style={{ color: '#444', fontSize: '16px', lineHeight: '1.6' }}>
            Hi {name}, your AiTrackr data export has been processed. You can download your data (subscriptions, usage history, account details) from your Settings page.
          </Text>
          <Text style={{ color: '#888', fontSize: '14px' }}>
            The export includes all data we hold about your account in JSON format, as required by GDPR Article 20 (Right to Data Portability).
          </Text>
          <Button
            href={`${appUrl}/dashboard/settings`}
            style={{ backgroundColor: '#6366f1', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontSize: '16px' }}
          >
            Go to Settings
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
