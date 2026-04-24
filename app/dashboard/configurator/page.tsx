'use client'

import { useState } from 'react'
import { useTenant } from '@/lib/providers'
import { useWorkflows } from '@/lib/hooks'
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
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import type { LogicGateMode } from '@/lib/types/database'

const stepTypeIcons: Record<string, React.ReactNode> = {
  form: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
    </svg>
  ),
  file_upload: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" x2="12" y1="3" y2="15"/>
    </svg>
  ),
  signature_upload: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
  ),
  payment: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  ),
  scheduling: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M8 2v4"/>
      <path d="M16 2v4"/>
      <rect width="18" height="18" x="3" y="4" rx="2"/>
      <path d="M3 10h18"/>
    </svg>
  ),
  custom: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    </svg>
  ),
}

export default function ConfiguratorPage() {
  const { tenant, isLoading: tenantLoading } = useTenant()
  const { workflows, isLoading: workflowsLoading, createWorkflow, setDefaultWorkflow, deleteWorkflow } = useWorkflows()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    logic_mode: 'strict' as LogicGateMode,
  })

  const isLoading = tenantLoading || workflowsLoading

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenant) return

    setIsCreating(true)
    const { error } = await createWorkflow({
      ...newWorkflow,
      tenant_id: tenant.id,
    })

    if (!error) {
      setIsCreateDialogOpen(false)
      setNewWorkflow({ name: '', description: '', logic_mode: 'strict' })
    }
    setIsCreating(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workflow Configurator</h1>
          <p className="text-muted-foreground">
            Create and manage your onboarding workflow templates
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Workflow Template</DialogTitle>
              <DialogDescription>
                Define a new onboarding workflow that you can assign to clients.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWorkflow}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="New Client Onboarding"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Standard onboarding process for new clients..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logic_mode">Logic Mode</Label>
                  <Select
                    value={newWorkflow.logic_mode}
                    onValueChange={(value: LogicGateMode) => setNewWorkflow(prev => ({ ...prev, logic_mode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">Strict (Sequential)</SelectItem>
                      <SelectItem value="parallel">Parallel (Any Order)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Strict mode requires tasks to be completed in order. Parallel mode allows any order.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <><Spinner className="mr-2" /> Creating...</> : 'Create Template'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflows List */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No workflow templates yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first workflow template to define the steps clients need to complete during onboarding.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="relative">
              {workflow.is_default && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Default
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {workflow.name}
                </CardTitle>
                <CardDescription>
                  {workflow.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>{workflow.logic_mode === 'strict' ? 'Strict' : 'Parallel'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M8 2v4"/>
                      <path d="M16 2v4"/>
                      <rect width="18" height="18" x="3" y="4" rx="2"/>
                      <path d="M3 10h18"/>
                    </svg>
                    <span>{new Date(workflow.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/configurator/${workflow.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Edit Steps
                    </Button>
                  </Link>
                  {!workflow.is_default && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDefaultWorkflow(workflow.id)}
                      title="Set as default"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step Types Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Step Types</CardTitle>
          <CardDescription>
            Use these step types when building your workflow templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stepTypeIcons).map(([type, icon]) => (
              <div key={type} className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground">
                  {icon}
                </div>
                <span className="text-sm font-medium capitalize">
                  {type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
