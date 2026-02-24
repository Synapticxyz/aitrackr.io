import {
  Body, Button, Container, Head, Heading, Html,
  Preview, Section, Text, Hr,
} from '@react-email/components'

interface WelcomeEmailProps {
  name: string
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aitrackr.io'
  return (
    <Html>
      <Head />
      <Preview>Welcome to AiTrackr — start tracking your AI subscriptions</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ color: '#1a1a2e', fontSize: '24px' }}>
            Welcome to AiTrackr, {name}! 🎉
          </Heading>
          <Text style={{ color: '#444', fontSize: '16px', lineHeight: '1.6' }}>
            You're all set to take control of your AI subscriptions. Here's what you can do:
          </Text>
          <Section>
            <Text style={{ color: '#444', fontSize: '14px' }}>
              ✅ <strong>Track subscriptions</strong> — Add ChatGPT, Claude, Midjourney, and more
            </Text>
            <Text style={{ color: '#444', fontSize: '14px' }}>
              📊 <strong>Analyze usage</strong> — See which tools you actually use vs. pay for
            </Text>
            <Text style={{ color: '#444', fontSize: '14px' }}>
              💡 <strong>Save money</strong> — Our Overlap Engine finds duplicate subscriptions
            </Text>
          </Section>
          <Hr />
          <Button
            href={`${appUrl}/dashboard`}
            style={{ backgroundColor: '#6366f1', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontSize: '16px' }}
          >
            Go to Dashboard
          </Button>
          <Text style={{ color: '#888', fontSize: '12px', marginTop: '32px' }}>
            AiTrackr · <a href={`${appUrl}/privacy`} style={{ color: '#888' }}>Privacy Policy</a> · <a href={`${appUrl}/unsubscribe`} style={{ color: '#888' }}>Unsubscribe</a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
