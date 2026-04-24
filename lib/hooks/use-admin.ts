'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Tenant, DomainRequest } from '@/lib/types/database'

// Fetcher for admin data (bypasses RLS via service role or admin policies)
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

interface TenantWithStats extends Tenant {
  clientCount: number
  documentCount: number
}

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR<AdminStats>(
    'admin-stats',
    async () => {
      // Get tenant counts
      const { count: totalTenants } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true })

      // Get client counts
      const { count: totalClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      // Get document counts
      const { count: totalDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })

      // Get pending domain requests
      const { count: pendingDomains } = await supabase
        .from('domain_requests')
        .select('*', { count: 'exact', head: true })
        .neq('dns_status', 'active')

      // Get revenue breakdown by plan
      const { data: planCounts } = await supabase
        .from('tenants')
        .select('plan')

      const revenueByPlan = {
        starter: 0,
        professional: 0,
        enterprise: 0,
      }

      planCounts?.forEach((t) => {
        if (t.plan === 'starter') revenueByPlan.starter++
        if (t.plan === 'professional') revenueByPlan.professional++
        if (t.plan === 'enterprise') revenueByPlan.enterprise++
      })

      return {
        totalTenants: totalTenants || 0,
        totalClients: totalClients || 0,
        totalDocuments: totalDocuments || 0,
        pendingDomains: pendingDomains || 0,
        revenueByPlan,
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
  const { data, error, isLoading, mutate } = useSWR<TenantWithStats[]>(
    'admin-tenants',
    async () => {
      const { data: tenants, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (!tenants) return []

      // Get stats for each tenant
      const tenantsWithStats = await Promise.all(
        tenants.map(async (tenant) => {
          const { count: clientCount } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenant.id)

          const { count: documentCount } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenant.id)

          return {
            ...tenant,
            clientCount: clientCount || 0,
            documentCount: documentCount || 0,
          }
        })
      )

      return tenantsWithStats
    }
  )

  const updateTenantPlan = async (tenantId: string, plan: 'starter' | 'professional' | 'enterprise') => {
    const { error } = await supabase
      .from('tenants')
      .update({ plan })
      .eq('id', tenantId)

    if (error) throw error
    mutate()
  }

  const deleteTenant = async (tenantId: string) => {
    const { error } = await supabase
      .from('tenants')
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
  const { data, error, isLoading, mutate } = useSWR<(DomainRequest & { tenantName: string })[]>(
    'admin-domains',
    async () => {
      const { data: domains, error } = await supabase
        .from('domain_requests')
        .select(`
          *,
          tenants (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (domains || []).map((d) => ({
        ...d,
        tenantName: (d.tenants as { name: string })?.name || 'Unknown',
      }))
    }
  )

  const approveDomain = async (domainId: string) => {
    const { error } = await supabase
      .from('domain_requests')
      .update({
        ssl_status: 'issued',
        dns_status: 'active',
        verified_at: new Date().toISOString(),
      })
      .eq('id', domainId)

    if (error) throw error
    mutate()
  }

  const rejectDomain = async (domainId: string) => {
    const { error } = await supabase
      .from('domain_requests')
      .update({
        ssl_status: 'failed',
        dns_status: 'error',
      })
      .eq('id', domainId)

    if (error) throw error
    mutate()
  }

  const deleteDomain = async (domainId: string) => {
    const { error } = await supabase
      .from('domain_requests')
      .delete()
      .eq('id', domainId)

    if (error) throw error
    mutate()
  }

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
      const { data: templates, error } = await supabase
        .from('workflow_templates')
        .select(`
          *,
          tenants (name),
          template_steps (id)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (templates || []).map((t) => ({
        ...t,
        tenantName: (t.tenants as { name: string })?.name || 'Unknown',
        stepCount: (t.template_steps as { id: string }[])?.length || 0,
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
