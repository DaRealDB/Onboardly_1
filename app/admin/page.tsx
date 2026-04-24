'use client'

import { useAdminStats, useAdminTenants } from '@/lib/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Users,
  FileText,
  Globe,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export default function AdminOverviewPage() {
  const { stats, isLoading: statsLoading } = useAdminStats()
  const { tenants, isLoading: tenantsLoading } = useAdminTenants()

  if (statsLoading || tenantsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  const recentTenants = tenants.slice(0, 5)

  // Calculate mock growth percentages
  const tenantGrowth = 12.5
  const clientGrowth = 8.3
  const documentGrowth = 15.2

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Platform Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor platform health and key metrics across all tenants.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tenants
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTenants || 0}</div>
            <div className="mt-1 flex items-center text-xs">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{tenantGrowth}%</span>
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            <div className="mt-1 flex items-center text-xs">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{clientGrowth}%</span>
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documents Stored
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDocuments || 0}</div>
            <div className="mt-1 flex items-center text-xs">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{documentGrowth}%</span>
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Domains
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingDomains || 0}</div>
            <div className="mt-1 flex items-center text-xs">
              {(stats?.pendingDomains || 0) > 0 ? (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-amber-500" />
                  <span className="text-amber-500">Action needed</span>
                </>
              ) : (
                <span className="text-muted-foreground">All domains verified</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Plan */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue by Plan
            </CardTitle>
            <CardDescription>
              Distribution of tenants across pricing tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/50" />
                  <span className="text-sm font-medium">Starter</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {stats?.revenueByPlan.starter || 0}
                  </span>
                  <span className="text-sm text-muted-foreground">tenants</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary/70" />
                  <span className="text-sm font-medium">Professional</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {stats?.revenueByPlan.professional || 0}
                  </span>
                  <span className="text-sm text-muted-foreground">tenants</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Enterprise</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {stats?.revenueByPlan.enterprise || 0}
                  </span>
                  <span className="text-sm text-muted-foreground">tenants</span>
                </div>
              </div>
            </div>

            {/* Progress bars */}
            <div className="mt-6 space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="flex h-full">
                  <div
                    className="bg-muted-foreground/50 transition-all"
                    style={{
                      width: `${((stats?.revenueByPlan.starter || 0) / (stats?.totalTenants || 1)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-primary/70 transition-all"
                    style={{
                      width: `${((stats?.revenueByPlan.professional || 0) / (stats?.totalTenants || 1)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-primary transition-all"
                    style={{
                      width: `${((stats?.revenueByPlan.enterprise || 0) / (stats?.totalTenants || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tenants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Recent Tenants
            </CardTitle>
            <CardDescription>
              Latest organizations to join the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTenants.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No tenants yet
                </p>
              ) : (
                recentTenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: tenant.brand_color || '#3B82F6' }}
                      >
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tenant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tenant.clientCount} clients, {tenant.documentCount} docs
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        tenant.plan === 'enterprise'
                          ? 'default'
                          : tenant.plan === 'professional'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {tenant.plan}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
