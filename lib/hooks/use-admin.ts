'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

// Fetch functions
const supabase = createClient()

interface AdminStats {
  totalTenants: number
  totalClients: number
  totalDocuments: number
  pendingDomains: number
  revenueByPlan: {
    starter: number
    professional: number
    enterprise: number
  }
}

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR<AdminStats>(
    'admin-stats',
    async () => {
      const { count: totalTenants } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })

      const { count: totalClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      const { count: totalDocuments } = await supabase
        .from('client_documents')
        .select('*', { count: 'exact', head: true })

      return {
        totalTenants: totalTenants || 0,
        totalClients: totalClients || 0,
        totalDocuments: totalDocuments || 0,
        pendingDomains: 3, // Placeholder Data
        revenueByPlan: {
          starter: 15, // Placeholder Data
          professional: 8, // Placeholder Data
          enterprise: 2, // Placeholder Data
        },
      }
    }
  )

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  }
}

export function useAdminTenants() {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    'admin-tenants',
    async () => {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (!companies) return []

      const tenantsWithStats = await Promise.all(
        companies.map(async (company) => {
          const { count: clientCount } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)

          return {
            ...company,
            clientCount: clientCount || 0,
            documentCount: 0, // Placeholder Data
            plan: 'starter', // Placeholder Data
          }
        })
      )

      return tenantsWithStats
    }
  )

  const updateTenantPlan = async (tenantId: string, plan: 'starter' | 'professional' | 'enterprise') => {
    // Placeholder action: no plan column in companies schema currently
    mutate()
  }

  const deleteTenant = async (tenantId: string) => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', tenantId)

    if (error) throw error
    mutate()
  }

  return {
    tenants: data || [],
    isLoading,
    error,
    updateTenantPlan,
    deleteTenant,
    mutate,
  }
}

export function useAdminDomains() {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    'admin-domains',
    async () => {
      // Placeholder since domain_requests table does not exist in schema
      return [
        {
          id: 'dummy-1',
          domain: 'acme.onboardly.com',
          status: 'pending',
          tenantName: 'Acme Corp',
          created_at: new Date().toISOString()
        }
      ]
    }
  )

  const approveDomain = async (domainId: string) => { mutate() }
  const rejectDomain = async (domainId: string) => { mutate() }
  const deleteDomain = async (domainId: string) => { mutate() }

  return {
    domains: data || [],
    isLoading,
    error,
    approveDomain,
    rejectDomain,
    deleteDomain,
    mutate,
  }
}

export function useAdminTemplates() {
  const { data, error, isLoading, mutate } = useSWR(
    'admin-templates',
    async () => {
      const { data: tracks, error } = await supabase
        .from('workflow_tracks')
        .select(`
          *,
          companies (name),
          workflow_steps (id)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (tracks || []).map((t: any) => ({
        ...t,
        tenantName: t.companies?.name || 'Unknown',
        stepCount: t.workflow_steps?.length || 0,
      }))
    }
  )

  return {
    templates: data || [],
    isLoading,
    error,
    mutate,
  }
}