import {
  Body, Container, Head, Heading, Html,
  Preview, Text,
} from '@react-email/components'

interface AccountDeletedEmailProps {
  name: string
}

export default function AccountDeletedEmail({ name }: AccountDeletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your AiTrackr account has been scheduled for deletion</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ color: '#1a1a2e', fontSize: '24px' }}>
            Account Deletion Confirmed
          </Heading>
          <Text style={{ color: '#444', fontSize: '16px', lineHeight: '1.6' }}>
            Hi {name}, we've received your account deletion request.
          </Text>
          <Text style={{ color: '#444', fontSize: '16px', lineHeight: '1.6' }}>
            Your account and all associated data will be permanently deleted within <strong>30 days</strong> in accordance with our Privacy Policy. Any active subscriptions have been cancelled immediately.
          </Text>
          <Text style={{ color: '#888', fontSize: '14px' }}>
            If you did not request this, please contact us immediately at privacy@aitrackr.io.
          </Text>
          <Text style={{ color: '#888', fontSize: '12px', marginTop: '32px' }}>
            This action was taken in accordance with GDPR Article 17 (Right to Erasure).
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
