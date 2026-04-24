import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Portal',
  description: 'Complete your onboarding tasks',
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {children}
    </div>
  )
}
