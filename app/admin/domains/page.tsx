"use client"

import { useState } from "react"
import { useAdminDomains } from "@/lib/hooks/use-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Globe, 
  Search, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Shield,
  RefreshCw,
  ExternalLink
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function AdminDomainsPage() {
  const { domains, isLoading, approveDomain, rejectDomain } = useAdminDomains()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !filterStatus || domain.ssl_status === filterStatus || domain.dns_status === filterStatus
    return matchesSearch && matchesFilter
  })

  const pendingCount = domains.filter(d => d.ssl_status === 'pending' || d.dns_status === 'propagating').length
  const activeCount = domains.filter(d => d.ssl_status === 'issued' && d.dns_status === 'active').length
  const errorCount = domains.filter(d => d.ssl_status === 'failed' || d.dns_status === 'error').length

  const getSSLBadge = (status: string) => {
    switch (status) {
      case 'issued':
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><Shield className="mr-1 h-3 w-3" />Issued</Badge>
      case 'pending':
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" />Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDNSBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle2 className="mr-1 h-3 w-3" />Active</Badge>
      case 'propagating':
        return <Badge variant="secondary"><RefreshCw className="mr-1 h-3 w-3 animate-spin" />Propagating</Badge>
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" />Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleVerifyDomain = async (domainId: string) => {
    await approveDomain(domainId)
  }

  const handleRejectDomain = async (domainId: string) => {
    await rejectDomain(domainId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Domain Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage custom domain requests and SSL certificates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Fully configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{errorCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Domain Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Domain Requests</CardTitle>
              <CardDescription>All custom domain configuration requests</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search domains..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {filterStatus || "All Status"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('pending')}>SSL Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('issued')}>SSL Issued</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('failed')}>SSL Failed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('propagating')}>DNS Propagating</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('active')}>DNS Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('error')}>DNS Error</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredDomains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No domain requests</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "No domains match your search" : "No custom domains have been requested yet"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>SSL Status</TableHead>
                  <TableHead>DNS Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{domain.domain}</span>
                        <a 
                          href={`https://${domain.domain}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {domain.tenantName || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>{getSSLBadge(domain.ssl_status)}</TableCell>
                    <TableCell>{getDNSBadge(domain.dns_status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(domain.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleVerifyDomain(domain.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve Domain
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRejectDomain(domain.id)}
                            className="text-destructive"
                          >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Reject Domain
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DNS Configuration Help */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">DNS Configuration Instructions</CardTitle>
          <CardDescription>Share these instructions with tenants for domain setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-4 font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Add the following DNS records:</p>
            <p><span className="text-primary">CNAME</span> @ → onboardly.app</p>
            <p><span className="text-primary">CNAME</span> www → onboardly.app</p>
            <p className="text-muted-foreground mt-2"># Or for apex domains:</p>
            <p><span className="text-primary">A</span> @ → 76.76.21.21</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
