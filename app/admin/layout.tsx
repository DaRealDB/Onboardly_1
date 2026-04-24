'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  LayoutDashboard,
  Building2,
  FileStack,
  Globe,
  LogOut,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/tenants', label: 'Tenants', icon: Building2 },
  { href: '/admin/templates', label: 'Templates', icon: FileStack },
  { href: '/admin/domains', label: 'Domains', icon: Globe },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isSuperAdmin, isLoading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    } else if (!isLoading && user && !isSuperAdmin) {
      router.push('/dashboard')
    }
  }, [user, isSuperAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!user || !isSuperAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-semibold text-foreground">Onboardly</span>
              <span className="ml-1.5 rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
                Admin
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-border p-4">
            <div className="mb-3 rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="truncate text-sm font-medium text-foreground">
                {user.email}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
