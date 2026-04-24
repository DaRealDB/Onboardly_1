import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/lib/providers'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: 'Onboardly - Client Onboarding Made Simple',
    template: '%s | Onboardly',
  },
  description: 'Streamline your client onboarding with customizable workflows, document collection, and real-time progress tracking.',
  keywords: ['onboarding', 'client management', 'workflows', 'document collection', 'SaaS'],
}

export const viewport: Viewport = {
  themeColor: '#0F766E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
