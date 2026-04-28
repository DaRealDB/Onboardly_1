"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  UserPlus,
  UserCheck,
  FileText,
  Globe,
  Trash2,
  Filter,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ActivityEvent {
  id: string
  type: "signup" | "hire" | "contract" | "domain"
  message: string
  domain: string
  timestamp: Date
  actor?: string
}

const generateEvents = (): ActivityEvent[] => [
  {
    id: "1",
    type: "signup",
    message: "New candidate registered",
    domain: "acme.co",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    actor: "John Smith",
  },
  {
    id: "2",
    type: "hire",
    message: "Candidate hired successfully",
    domain: "techcorp.io",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    actor: "Sarah Chen",
  },
  {
    id: "3",
    type: "contract",
    message: "Contract signed and stored",
    domain: "startup.dev",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    actor: "Emily Rodriguez",
  },
  {
    id: "4",
    type: "signup",
    message: "New candidate registered",
    domain: "enterprise.com",
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    actor: "Marcus Johnson",
  },
  {
    id: "5",
    type: "domain",
    message: "Domain routing refreshed",
    domain: "agency.co",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: "6",
    type: "hire",
    message: "Candidate moved to final stage",
    domain: "acme.co",
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    actor: "David Kim",
  },
  {
    id: "7",
    type: "contract",
    message: "NDA generated for review",
    domain: "techcorp.io",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: "8",
    type: "signup",
    message: "Bulk import: 15 candidates added",
    domain: "enterprise.com",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "9",
    type: "domain",
    message: "SSL certificate renewed",
    domain: "startup.dev",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "10",
    type: "hire",
    message: "Offer letter sent",
    domain: "agency.co",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    actor: "Aisha Patel",
  },
]

export function ActivitySection() {
  const [events, setEvents] = useState<ActivityEvent[]>(generateEvents())
  const [auditDialog, setAuditDialog] = useState(false)
  const [filter, setFilter] = useState<string[]>([
    "signup",
    "hire",
    "contract",
    "domain",
  ])
  const [, setTick] = useState(0)

  // Update timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const clearLogs = () => {
    setEvents([])
    setAuditDialog(false)
  }

  const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "signup":
        return <UserPlus className="h-4 w-4" />
      case "hire":
        return <UserCheck className="h-4 w-4" />
      case "contract":
        return <FileText className="h-4 w-4" />
      case "domain":
        return <Globe className="h-4 w-4" />
    }
  }

  const getEventColor = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "signup":
        return "bg-accent text-accent-foreground"
      case "hire":
        return "bg-chart-2 text-primary-foreground"
      case "contract":
        return "bg-chart-3 text-primary-foreground"
      case "domain":
        return "bg-chart-4 text-primary-foreground"
    }
  }

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return date.toLocaleDateString()
  }

  const filteredEvents = events.filter((e) => filter.includes(e.type))

  const signupCount = events.filter((e) => e.type === "signup").length
  const hireCount = events.filter((e) => e.type === "hire").length
  const contractCount = events.filter((e) => e.type === "contract").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Activity</h2>
          <p className="text-sm text-muted-foreground">
            Real-time platform-wide event feed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={filter.includes("signup")}
                onCheckedChange={(checked) =>
                  setFilter(
                    checked
                      ? [...filter, "signup"]
                      : filter.filter((f) => f !== "signup")
                  )
                }
              >
                Signups
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.includes("hire")}
                onCheckedChange={(checked) =>
                  setFilter(
                    checked
                      ? [...filter, "hire"]
                      : filter.filter((f) => f !== "hire")
                  )
                }
              >
                Hires
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.includes("contract")}
                onCheckedChange={(checked) =>
                  setFilter(
                    checked
                      ? [...filter, "contract"]
                      : filter.filter((f) => f !== "contract")
                  )
                }
              >
                Contracts
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.includes("domain")}
                onCheckedChange={(checked) =>
                  setFilter(
                    checked
                      ? [...filter, "domain"]
                      : filter.filter((f) => f !== "domain")
                  )
                }
              >
                Domains
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            onClick={() => setAuditDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Audit
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {events.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <UserPlus className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {signupCount}
              </p>
              <p className="text-xs text-muted-foreground">Signups</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/20">
              <UserCheck className="h-4 w-4 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {hireCount}
              </p>
              <p className="text-xs text-muted-foreground">Hires</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/20">
              <FileText className="h-4 w-4 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {contractCount}
              </p>
              <p className="text-xs text-muted-foreground">Contracts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              Live Feed
            </span>
            <span className="text-xs text-muted-foreground">
              • {filteredEvents.length} events
            </span>
          </div>
        </div>
        <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No activity events to display
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 flex items-start gap-4 hover:bg-secondary/30 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${getEventColor(
                    event.type
                  )}`}
                >
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">
                      {event.message}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs font-mono bg-secondary/50"
                    >
                      {event.domain}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {event.actor && (
                      <span className="text-xs text-muted-foreground">
                        {event.actor}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {event.actor && "•"} {formatTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audit Confirmation Dialog */}
      <AlertDialog open={auditDialog} onOpenChange={setAuditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Activity Logs</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently clear all {events.length} activity log
              entries. This action is for audit compliance and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearLogs}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Logs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
