'use client'

import { useState } from 'react'
import { useAdminTenants } from '@/lib/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Building2,
  Search,
  MoreVertical,
  Users,
  FileText,
  Trash2,
  ArrowUpRight,
  Crown,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function AdminTenantsPage() {
  const { tenants, isLoading, updateTenantPlan, deleteTenant } = useAdminTenants()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; tenantId: string | null; tenantName: string }>({
    open: false,
    tenantId: null,
    tenantName: '',
  })

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async () => {
    if (deleteDialog.tenantId) {
      await deleteTenant(deleteDialog.tenantId)
      setDeleteDialog({ open: false, tenantId: null, tenantName: '' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tenants</h1>
        <p className="mt-1 text-muted-foreground">
          Manage all organizations using the Onboardly platform.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {filteredTenants.length} tenants
        </Badge>
      </div>

      {/* Tenants List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            All Tenants
          </CardTitle>
          <CardDescription>
            View and manage tenant accounts, plans, and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No tenants found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term.' : 'Tenants will appear here once they sign up.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-semibold text-white"
                      style={{ backgroundColor: tenant.brand_color || '#3B82F6' }}
                    >
                      {tenant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{tenant.name}</p>
                        <Badge
                          variant={
                            tenant.plan === 'enterprise'
                              ? 'default'
                              : tenant.plan === 'professional'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {tenant.plan === 'enterprise' && <Crown className="mr-1 h-3 w-3" />}
                          {tenant.plan}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        /{tenant.slug} &middot; Joined{' '}
                        {formatDistanceToNow(new Date(tenant.created_at!), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{tenant.clientCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{tenant.documentCount}</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          View Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Plan</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => updateTenantPlan(tenant.id, 'starter')}
                          disabled={tenant.plan === 'starter'}
                        >
                          Set to Starter
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateTenantPlan(tenant.id, 'professional')}
                          disabled={tenant.plan === 'professional'}
                        >
                          Set to Professional
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateTenantPlan(tenant.id, 'enterprise')}
                          disabled={tenant.plan === 'enterprise'}
                        >
                          Set to Enterprise
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            setDeleteDialog({ open: true, tenantId: tenant.id, tenantName: tenant.name })
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteDialog.tenantName}</strong>? This will
              permanently remove all their data including clients, documents, and workflows. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Tenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
