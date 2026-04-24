'use client'

import { useState } from 'react'
import { useAdminTemplates } from '@/lib/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import {
  FileStack,
  Search,
  Layers,
  GitBranch,
  Building2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function AdminTemplatesPage() {
  const { templates, isLoading } = useAdminTemplates()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <h1 className="text-3xl font-bold text-foreground">Workflow Templates</h1>
        <p className="mt-1 text-muted-foreground">
          View all workflow templates created across the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Strict Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter((t) => t.logic_mode === 'strict').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parallel Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter((t) => t.logic_mode === 'parallel').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {filteredTemplates.length} templates
        </Badge>
      </div>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="h-5 w-5" />
            All Templates
          </CardTitle>
          <CardDescription>
            Browse workflow templates created by tenants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileStack className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No templates found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term.' : 'Templates will appear here once created.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant={template.logic_mode === 'strict' ? 'default' : 'secondary'}>
                      <GitBranch className="mr-1 h-3 w-3" />
                      {template.logic_mode}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    {template.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{template.tenantName}</span>
                    </div>
                    <span>{template.stepCount} steps</span>
                  </div>

                  <div className="mt-3 border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(template.created_at!), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
