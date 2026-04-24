'use client'

import { useState } from 'react'
import { use } from 'react'
import { usePortal } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { ClientTask, TaskStatus } from '@/lib/types/database'
import { TaskDialog } from './task-dialog'

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  locked: {
    label: 'Locked',
    color: 'bg-muted text-muted-foreground',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  pending: {
    label: 'Ready',
    color: 'bg-blue-100 text-blue-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-amber-100 text-amber-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 2v4"/>
        <path d="m16.2 7.8 2.9-2.9"/>
        <path d="M18 12h4"/>
        <path d="m16.2 16.2 2.9 2.9"/>
        <path d="M12 18v4"/>
        <path d="m4.9 19.1 2.9-2.9"/>
        <path d="M2 12h4"/>
        <path d="m4.9 4.9 2.9 2.9"/>
      </svg>
    ),
  },
  complete: {
    label: 'Complete',
    color: 'bg-green-100 text-green-700',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="m9 11 3 3L22 4"/>
      </svg>
    ),
  },
  verified: {
    label: 'Verified',
    color: 'bg-primary/10 text-primary',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
}

const stepTypeIcons: Record<string, React.ReactNode> = {
  form: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
    </svg>
  ),
  file_upload: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" x2="12" y1="3" y2="15"/>
    </svg>
  ),
  signature_upload: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
  ),
  payment: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  ),
  scheduling: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M8 2v4"/>
      <path d="M16 2v4"/>
      <rect width="18" height="18" x="3" y="4" rx="2"/>
      <path d="M3 10h18"/>
    </svg>
  ),
  custom: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    </svg>
  ),
}

export default function PortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const { client, tenant, tasks, isLoading, error, startOnboarding } = usePortal(token)
  const [selectedTask, setSelectedTask] = useState<ClientTask | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  if (isLoading) {
    return <PortalSkeleton />
  }

  if (error || !client || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-red-600">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Portal Not Found</h2>
            <p className="text-muted-foreground">
              {error || 'This portal link is invalid or has expired. Please contact your service provider for a new link.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleStartOnboarding = async () => {
    setIsStarting(true)
    await startOnboarding()
    setIsStarting(false)
  }

  // Welcome state - client hasn't started
  if (client.status === 'invited') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            {tenant.logo_url && (
              <img 
                src={tenant.logo_url} 
                alt={tenant.name} 
                className="h-12 mx-auto mb-4 object-contain"
              />
            )}
            <CardTitle className="text-2xl">Welcome, {client.name}!</CardTitle>
            <CardDescription>
              {tenant.name} has invited you to complete your onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">What to expect:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="m9 11 3 3L22 4"/>
                  </svg>
                  Complete {tasks.length} onboarding {tasks.length === 1 ? 'task' : 'tasks'}
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="m9 11 3 3L22 4"/>
                  </svg>
                  {client.logic_mode === 'strict' ? 'Tasks must be completed in order' : 'Complete tasks in any order'}
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="m9 11 3 3L22 4"/>
                  </svg>
                  Your progress is saved automatically
                </li>
              </ul>
            </div>
            
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleStartOnboarding}
              disabled={isStarting}
            >
              {isStarting ? 'Starting...' : 'Get Started'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Completed state
  if (client.status === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-green-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <path d="m9 11 3 3L22 4"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">All Done!</h2>
            <p className="text-muted-foreground mb-6">
              You&apos;ve completed all your onboarding tasks. {tenant.name} will review your submissions and be in touch soon.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground">Completed on</p>
              <p className="font-medium">
                {client.completed_at ? new Date(client.completed_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Active onboarding
  const completedTasks = tasks.filter(t => t.status === 'complete' || t.status === 'verified').length
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {tenant.logo_url ? (
              <img 
                src={tenant.logo_url} 
                alt={tenant.name} 
                className="h-10 object-contain"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: tenant.brand_color }}
              >
                {tenant.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-semibold text-lg">{tenant.name}</h1>
              <p className="text-sm text-muted-foreground">Client Portal</p>
            </div>
          </div>
          <Badge variant="secondary" className={statusConfig[client.status as TaskStatus]?.color || ''}>
            {client.status === 'in_progress' ? 'In Progress' : 'Awaiting Review'}
          </Badge>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Welcome back, {client.name}</h2>
              <span className="text-sm font-medium">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedTasks} of {tasks.length} tasks completed
            </p>
          </CardContent>
        </Card>
      </header>

      {/* Tasks */}
      {client.logic_mode === 'strict' ? (
        <StrictTaskList tasks={tasks} onTaskClick={setSelectedTask} />
      ) : (
        <ParallelTaskGrid tasks={tasks} onTaskClick={setSelectedTask} />
      )}

      {/* Task Dialog */}
      <TaskDialog 
        task={selectedTask} 
        tenant={tenant}
        token={token}
        onClose={() => setSelectedTask(null)} 
      />
    </div>
  )
}

function StrictTaskList({ tasks, onTaskClick }: { tasks: ClientTask[]; onTaskClick: (task: ClientTask) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-muted-foreground">
          <path d="M8 6h13"/>
          <path d="M8 12h13"/>
          <path d="M8 18h13"/>
          <path d="M3 6h.01"/>
          <path d="M3 12h.01"/>
          <path d="M3 18h.01"/>
        </svg>
        Complete in Order
      </h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const status = statusConfig[task.status]
            const isClickable = task.status !== 'locked'

            return (
              <div key={task.id} className="relative flex gap-4">
                {/* Step indicator */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0",
                  task.status === 'complete' || task.status === 'verified' 
                    ? "bg-green-500 text-white" 
                    : task.status === 'locked'
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
                )}>
                  {task.status === 'complete' || task.status === 'verified' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <path d="m9 11 3 3L22 4"/>
                    </svg>
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Task card */}
                <Card 
                  className={cn(
                    "flex-1 transition-all",
                    isClickable && "cursor-pointer hover:shadow-md hover:border-primary/50",
                    !isClickable && "opacity-60"
                  )}
                  onClick={() => isClickable && onTaskClick(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shrink-0">
                          {stepTypeIcons[task.step_type]}
                        </div>
                        <div>
                          <h4 className="font-medium">{task.name}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge className={status.color} variant="secondary">
                        {status.icon}
                        <span className="ml-1">{status.label}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ParallelTaskGrid({ tasks, onTaskClick }: { tasks: ClientTask[]; onTaskClick: (task: ClientTask) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-muted-foreground">
          <rect width="7" height="7" x="3" y="3" rx="1"/>
          <rect width="7" height="7" x="14" y="3" rx="1"/>
          <rect width="7" height="7" x="14" y="14" rx="1"/>
          <rect width="7" height="7" x="3" y="14" rx="1"/>
        </svg>
        Complete in Any Order
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {tasks.map((task) => {
          const status = statusConfig[task.status]
          const isClickable = task.status !== 'locked'
          const isComplete = task.status === 'complete' || task.status === 'verified'

          return (
            <Card 
              key={task.id}
              className={cn(
                "transition-all",
                isClickable && "cursor-pointer hover:shadow-md hover:border-primary/50",
                isComplete && "bg-green-50/50 border-green-200"
              )}
              onClick={() => isClickable && onTaskClick(task)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                    isComplete ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                  )}>
                    {stepTypeIcons[task.step_type]}
                  </div>
                  <Badge className={status.color} variant="secondary">
                    {status.icon}
                    <span className="ml-1">{status.label}</span>
                  </Badge>
                </div>
                <h4 className="font-medium mb-1">{task.name}</h4>
                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
                {task.is_required && (
                  <Badge variant="outline" className="mt-3 text-xs">Required</Badge>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function PortalSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
