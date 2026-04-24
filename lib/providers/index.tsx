'use client'

import { AuthProvider } from './auth-provider'
import { TenantProvider } from './tenant-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TenantProvider>
        {children}
      </TenantProvider>
    </AuthProvider>
  )
}

export { useAuth } from './auth-provider'
export { useTenant } from './tenant-provider'
