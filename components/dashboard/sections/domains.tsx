"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ExternalLink,
} from "lucide-react"

interface Domain {
  id: string
  subdomain: string
  company: string
  status: "active" | "pending" | "error"
  sslStatus: "valid" | "expiring" | "invalid"
  lastChecked: string
  responseTime: string
}

const initialDomains: Domain[] = [
  {
    id: "1",
    subdomain: "acme.onboardly.io",
    company: "Acme Corporation",
    status: "active",
    sslStatus: "valid",
    lastChecked: "2 min ago",
    responseTime: "124ms",
  },
  {
    id: "2",
    subdomain: "techcorp.onboardly.io",
    company: "TechCorp Inc",
    status: "active",
    sslStatus: "valid",
    lastChecked: "5 min ago",
    responseTime: "89ms",
  },
  {
    id: "3",
    subdomain: "startup.onboardly.io",
    company: "Startup Labs",
    status: "pending",
    sslStatus: "expiring",
    lastChecked: "1 hour ago",
    responseTime: "—",
  },
  {
    id: "4",
    subdomain: "enterprise.onboardly.io",
    company: "Enterprise Solutions",
    status: "active",
    sslStatus: "valid",
    lastChecked: "10 min ago",
    responseTime: "156ms",
  },
  {
    id: "5",
    subdomain: "agency.onboardly.io",
    company: "Creative Agency",
    status: "error",
    sslStatus: "invalid",
    lastChecked: "3 hours ago",
    responseTime: "—",
  },
  {
    id: "6",
    subdomain: "consulting.onboardly.io",
    company: "Consulting Group",
    status: "active",
    sslStatus: "expiring",
    lastChecked: "30 min ago",
    responseTime: "201ms",
  },
]

export function DomainsSection() {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [fixDialog, setFixDialog] = useState<{
    open: boolean
    domain: Domain | null
    action: "refresh" | "delete"
  }>({ open: false, domain: null, action: "refresh" })
  const [refreshing, setRefreshing] = useState<string | null>(null)

  const handleFix = () => {
    if (fixDialog.domain) {
      if (fixDialog.action === "delete") {
        setDomains((prev) =>
          prev.filter((d) => d.id !== fixDialog.domain?.id)
        )
      } else {
        setRefreshing(fixDialog.domain.id)
        setTimeout(() => {
          setDomains((prev) =>
            prev.map((d) =>
              d.id === fixDialog.domain?.id
                ? { ...d, status: "active", sslStatus: "valid", lastChecked: "Just now" }
                : d
            )
          )
          setRefreshing(null)
        }, 1500)
      }
      setFixDialog({ open: false, domain: null, action: "refresh" })
    }
  }

  const getStatusIcon = (status: Domain["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-accent" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-chart-3" />
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />
    }
  }

  const getStatusBadge = (status: Domain["status"]) => {
    switch (status) {
      case "active":
        return "bg-accent/20 text-accent border-accent/30"
      case "pending":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "error":
        return "bg-destructive/20 text-destructive border-destructive/30"
    }
  }

  const getSSLBadge = (ssl: Domain["sslStatus"]) => {
    switch (ssl) {
      case "valid":
        return "bg-accent/20 text-accent border-accent/30"
      case "expiring":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "invalid":
        return "bg-destructive/20 text-destructive border-destructive/30"
    }
  }

  const activeDomains = domains.filter((d) => d.status === "active").length
  const pendingDomains = domains.filter((d) => d.status === "pending").length
  const errorDomains = domains.filter((d) => d.status === "error").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Domains</h2>
        <p className="text-sm text-muted-foreground">
          Monitor and configure automatic subdomains
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {domains.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Domains</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <CheckCircle className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {activeDomains}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/20">
              <AlertTriangle className="h-4 w-4 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {pendingDomains}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {errorDomains}
              </p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SSL</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Last Check</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(domain.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-foreground">
                          {domain.subdomain}
                        </p>
                        <a
                          href={`https://${domain.subdomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {domain.company}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusBadge(domain.status)}
                  >
                    {domain.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getSSLBadge(domain.sslStatus)}
                  >
                    {domain.sslStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono">
                  {domain.responseTime}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {domain.lastChecked}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setFixDialog({
                          open: true,
                          domain,
                          action: "refresh",
                        })
                      }
                      disabled={refreshing === domain.id}
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-1 ${
                          refreshing === domain.id ? "animate-spin" : ""
                        }`}
                      />
                      Fix
                    </Button>
                    {domain.status === "error" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          setFixDialog({
                            open: true,
                            domain,
                            action: "delete",
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Fix Confirmation Dialog */}
      <AlertDialog
        open={fixDialog.open}
        onOpenChange={(open) =>
          setFixDialog({ ...fixDialog, open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {fixDialog.action === "delete"
                ? "Remove Broken Domain"
                : "Refresh Domain Routing"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {fixDialog.action === "delete" ? (
                <>
                  This will permanently remove{" "}
                  <span className="font-mono text-foreground">
                    {fixDialog.domain?.subdomain}
                  </span>{" "}
                  and all associated routing configuration.
                </>
              ) : (
                <>
                  This will refresh DNS and routing configuration for{" "}
                  <span className="font-mono text-foreground">
                    {fixDialog.domain?.subdomain}
                  </span>
                  . This may take a few minutes to propagate.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFix}
              className={
                fixDialog.action === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {fixDialog.action === "delete" ? "Remove Domain" : "Refresh Now"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
