'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './auth-provider'
import type { Tenant, TenantStats, TeamRole, TenantWithRole } from '@/lib/types/database'
import { hasPermission, ROLE_PERMISSIONS } from '@/lib/hooks/use-team'

interface RefreshOptions {
  isNewWorkspace?: boolean
}

interface TenantContextType {
  tenant: TenantWithRole | null
  tenants: TenantWithRole[]
  currentRole: TeamRole | null
  isLoading: boolean
  stats: TenantStats | null
  isImpersonating: boolean
  impersonatedBy: string | null
  setCurrentTenant: (tenant: TenantWithRole) => void
  refreshTenants: (options?: RefreshOptions) => Promise<void>
  createTenant: (data: Partial<Tenant>) => Promise<{ data: Tenant | null; error: string | null }>
  updateTenant: (id: string, data: Partial<Tenant>) => Promise<{ error: string | null }>
  can: (permission: string) => boolean
  startImpersonation: (tenantId: string, adminEmail: string) => void
  stopImpersonation: () => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantWithRole | null>(null)
  const [tenants, setTenants] = useState<TenantWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<TenantStats | null>(null)
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [impersonatedBy, setImpersonatedBy] = useState<string | null>(null)
  const { user, isSuperAdmin } = useAuth()
  const supabase = createClient()

 // AFTER
const fetchTenants = useCallback(async (): Promise<TenantWithRole[]> => {
  if (!user) {
    setTenants([])
    setTenant(null)
    setIsLoading(false)
    return []
  }

  setIsLoading(true)

  const { data: memberData, error: memberError } = await supabase
    .from('team_members')
    .select(`
      role,
      tenant:tenants (*)
    `)
    .eq('user_id', user.id)

  if (memberError) {
    console.error(
      'Supabase Tenant Error:',
      memberError?.message,
      memberError?.details,
      memberError?.hint,
      memberError?.code
    )
    setIsLoading(false)
    return []
  }

  const tenantsWithRoles: TenantWithRole[] = (memberData || [])
    .filter((item: any) => item.tenant)
    .map((item: any) => ({
      ...item.tenant,
      role: item.role as TeamRole,
    }))
    .sort((a: TenantWithRole, b: TenantWithRole) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  setTenants(tenantsWithRoles)

  // Use functional update to avoid reading stale `tenant` from closure
  setTenant(prev => {
    if (tenantsWithRoles.length === 0) return null
    if (!prev || !tenantsWithRoles.find(t => t.id === prev.id)) {
      return tenantsWithRoles[0]
    }
    return prev
  })

  setIsLoading(false)
  return tenantsWithRoles  // ← return the result so refreshTenants can check it
}, [user, supabase])  // ← removed `tenant` from deps, use functional setTenant instead

  const fetchStats = useCallback(async () => {
    if (!tenant) {
      setStats(null)
      return
    }

    const { data: clients } = await supabase
      .from('clients')
      .select('*')
      .eq('tenant_id', tenant.id)

    if (!clients) {
      setStats(null)
      return
    }

    const totalClients = clients.length
    const activeClients = clients.filter(c => c.status === 'in_progress').length
    const completedClients = clients.filter(c => c.status === 'complete').length
    
    const completedWithTime = clients.filter(c => c.completed_at && c.started_at)
    const averageCompletionTime = completedWithTime.length > 0
      ? completedWithTime.reduce((acc, c) => {
          const start = new Date(c.started_at!).getTime()
          const end = new Date(c.completed_at!).getTime()
          return acc + (end - start)
        }, 0) / completedWithTime.length / (1000 * 60 * 60 * 24)
      : 0

    const completionRate = totalClients > 0 
      ? (completedClients / totalClients) * 100 
      : 0

    setStats({
      totalClients,
      activeClients,
      completedClients,
      averageCompletionTime: Math.round(averageCompletionTime * 10) / 10,
      completionRate: Math.round(completionRate),
    })
  }, [tenant, supabase])

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  // Realtime subscription for team_members changes (new workspaces)
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('team_members_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_members',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch tenants when user is added to a new workspace
          fetchTenants()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'team_members',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch tenants when user is removed from a workspace
          fetchTenants()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase, fetchTenants])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const setCurrentTenant = (newTenant: TenantWithRole) => {
    setTenant(newTenant)
  }

 // AFTER
const refreshTenants = async (options: RefreshOptions = {}) => {
  const { isNewWorkspace = false } = options

  if (isNewWorkspace) {
    await new Promise((res) => setTimeout(res, 500))
  }

  const result = await fetchTenants()

  // ✅ Check the returned value, not the stale state variable
  if (isNewWorkspace && result.length === 0) {
    await new Promise((res) => setTimeout(res, 1000))
    await fetchTenants()
  }
}

  const createTenant = async (data: Partial<Tenant>) => {
    if (!user) {
      return { data: null, error: 'Not authenticated' }
    }

    const { data: newTenant, error } = await supabase
      .from('tenants')
      .insert({
        ...data,
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    await fetchTenants()
    return { data: newTenant, error: null }
  }

  const updateTenant = async (id: string, data: Partial<Tenant>) => {
    const { error } = await supabase
      .from('tenants')
      .update(data)
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    await fetchTenants()
    return { error: null }
  }

  // Permission check helper
  const can = useCallback((permission: string): boolean => {
    if (isSuperAdmin) return true
    if (isImpersonating) return true // Super admin impersonating has full access
    return hasPermission(tenant?.role, permission)
  }, [tenant?.role, isSuperAdmin, isImpersonating])

  // Super admin impersonation
  const startImpersonation = async (tenantId: string, adminEmail: string) => {
    if (!isSuperAdmin) return

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (!error && data) {
      setTenant({ ...data, role: 'owner' as TeamRole })
      setIsImpersonating(true)
      setImpersonatedBy(adminEmail)
    }
  }

  const stopImpersonation = () => {
    setIsImpersonating(false)
    setImpersonatedBy(null)
    // Refresh to get back to normal tenant list
    fetchTenants()
  }

  return (
    <TenantContext.Provider value={{
      tenant,
      tenants,
      currentRole: tenant?.role || null,
      isLoading,
      stats,
      isImpersonating,
      impersonatedBy,
      setCurrentTenant,
      refreshTenants,
      createTenant,
      updateTenant,
      can,
      startImpersonation,
      stopImpersonation,
    }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
