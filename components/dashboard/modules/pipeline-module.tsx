'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckCircle2, Clock, FileText, TrendingUp, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PipelineModule() {
  const { clients, documents, notifications } = useAppStore()

  const activeHires = clients.filter((c) => c.status === 'to-be-hired' || c.status === 'pending').length
  const completedHires = clients.filter((c) => c.status === 'hired').length
  const totalClients = clients.length
  const completionRate = totalClients > 0 ? Math.round((completedHires / totalClients) * 100) : 0
  const pendingDocs = documents.filter((d) => d.status === 'pending').length

  const kpiCards = [
    {
      title: 'Total Active Hires',
      value: activeHires.toString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      change: '+5%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Documents',
      value: pendingDocs.toString(),
      change: '-3',
      trend: 'down',
      icon: FileText,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Avg. Onboarding Time',
      value: '4.2 days',
      change: '-0.5 days',
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const recentActivities = [
    ...notifications.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.message,
      time: n.createdAt,
      type: n.type,
    })),
    {
      id: 'activity-1',
      title: 'New Hire Started',
      description: 'Emily Davis began the onboarding process',
      time: new Date('2024-02-10T09:00:00'),
      type: 'info' as const,
    },
    {
      id: 'activity-2',
      title: 'Document Approved',
      description: 'Sarah Johnson\'s contract was approved',
      time: new Date('2024-01-19T11:30:00'),
      type: 'success' as const,
    },
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pipeline Overview</h1>
        <p className="text-muted-foreground mt-1">
          Track your onboarding progress and key metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn('p-2 rounded-lg', card.bgColor)}>
                    <Icon className={cn('h-5 w-5', card.color)} />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    card.trend === 'up' ? 'text-green-600' : 'text-amber-600'
                  )}>
                    <TrendingUp className={cn(
                      'h-4 w-4',
                      card.trend === 'down' && 'rotate-180'
                    )} />
                    {card.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-foreground">{card.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Live Activity Feed
              <span className="text-sm font-normal text-muted-foreground">
                Last 24 hours
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full mt-2 flex-shrink-0',
                      activity.type === 'success' && 'bg-green-500',
                      activity.type === 'warning' && 'bg-yellow-500',
                      activity.type === 'error' && 'bg-red-500',
                      activity.type === 'info' && 'bg-blue-500'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTime(activity.time)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Recent Hires
              <a
                href="#"
                className="text-sm font-normal text-primary flex items-center gap-1 hover:underline"
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                    {client.fullName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{client.fullName}</p>
                    <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                  </div>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full font-medium',
                      client.status === 'hired' && 'bg-green-100 text-green-700',
                      client.status === 'pending' && 'bg-amber-100 text-amber-700',
                      client.status === 'to-be-hired' && 'bg-blue-100 text-blue-700',
                      client.status === 'offboarded' && 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {client.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
