import type { Metadata } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'AiTrackr — Track Your AI Subscriptions, Save Money',
    template: '%s | AiTrackr',
  },
  description:
    'Automatically track time spent on AI tools, analyze subscription costs, and discover overlapping capabilities to optimize your AI spending.',
  keywords: ['AI subscriptions', 'ChatGPT', 'Claude', 'subscription tracker', 'AI tools'],
  authors: [{ name: 'AiTrackr' }],
  creator: 'AiTrackr',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://aitrackr.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://aitrackr.io',
    siteName: 'AiTrackr',
    title: 'AiTrackr — Track Your AI Subscriptions, Save Money',
    description: 'Stop overpaying for AI tools. Track usage, find overlaps, save money.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AiTrackr' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiTrackr — Track Your AI Subscriptions, Save Money',
    description: 'Stop overpaying for AI tools. Track usage, find overlaps, save money.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
