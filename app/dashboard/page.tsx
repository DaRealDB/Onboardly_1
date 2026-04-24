'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTenant } from '@/lib/providers'
import { useClients } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import type { Client, ClientStatus } from '@/lib/types/database'

const statusColors: Record<ClientStatus, string> = {
  invited: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-100 text-blue-800',
  awaiting_review: 'bg-amber-100 text-amber-800',
  complete: 'bg-green-100 text-green-800',
}

const statusLabels: Record<ClientStatus, string> = {
  invited: 'Invited',
  in_progress: 'In Progress',
  awaiting_review: 'Awaiting Review',
  complete: 'Complete',
}

export default function PipelinePage() {
  const { tenant, stats, isLoading: tenantLoading } = useTenant()
  const { clients, isLoading: clientsLoading, createClient } = useClients()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    company_name: '',
  })

  const isLoading = tenantLoading || clientsLoading

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const clientsByStatus = {
    invited: filteredClients.filter(c => c.status === 'invited'),
    in_progress: filteredClients.filter(c => c.status === 'in_progress'),
    awaiting_review: filteredClients.filter(c => c.status === 'awaiting_review'),
    complete: filteredClients.filter(c => c.status === 'complete'),
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenant) return

    setIsCreating(true)
    const { error } = await createClient({
      ...newClient,
      tenant_id: tenant.id,
    })

    if (!error) {
      setIsAddDialogOpen(false)
      setNewClient({ name: '', email: '', company_name: '' })
    }
    setIsCreating(false)
  }

  if (!tenant && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" x2="19" y1="8" y2="14"/>
            <line x1="22" x2="16" y1="11" y2="11"/>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Create Your First Workspace</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Get started by creating a workspace for your business. You can customize it later.
        </p>
        <Link href="/dashboard/settings/new-workspace">
          <Button>Create Workspace</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
          <p className="text-muted-foreground">
            Track and manage your client onboarding progress
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" x2="19" y1="8" y2="14"/>
                <line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the client&apos;s details to start their onboarding process.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClient}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={newClient.company_name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Acme Inc"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <><Spinner className="mr-2" /> Adding...</> : 'Add Client'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Clients</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.totalClients || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{stats?.activeClients || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats?.completedClients || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completion Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.completionRate || 0}%</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <Input
          type="search"
          placeholder="Search clients..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(clientsByStatus) as ClientStatus[]).map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{statusLabels[status]}</h3>
                <Badge variant="secondary">{clientsByStatus[status].length}</Badge>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {clientsByStatus[status].length === 0 ? (
                  <div className="border border-dashed border-border rounded-lg p-6 text-center text-muted-foreground text-sm">
                    No clients
                  </div>
                ) : (
                  clientsByStatus[status].map((client) => (
                    <ClientCard key={client.id} client={client} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ClientCard({ client }: { client: Client }) {
  return (
    <Link href={`/dashboard/clients/${client.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="font-medium text-foreground">{client.name}</p>
              <p className="text-sm text-muted-foreground">{client.company_name || client.email}</p>
            </div>
            <Badge className={statusColors[client.status]} variant="secondary">
              {client.completion_percentage}%
            </Badge>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${client.completion_percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>{client.logic_mode === 'strict' ? 'Strict' : 'Parallel'}</span>
            <span>{new Date(client.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
