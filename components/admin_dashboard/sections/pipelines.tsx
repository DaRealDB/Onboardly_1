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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Trash2, Settings, GitBranch } from "lucide-react"

interface Pipeline {
  id: string
  domain: string
  activePipelines: number
  mode: "strict" | "parallel"
  candidates: number
  lastActivity: string
  status: "active" | "paused" | "error"
}

const initialPipelines: Pipeline[] = [
  {
    id: "1",
    domain: "acme.co",
    activePipelines: 8,
    mode: "parallel",
    candidates: 245,
    lastActivity: "2 min ago",
    status: "active",
  },
  {
    id: "2",
    domain: "techcorp.io",
    activePipelines: 12,
    mode: "strict",
    candidates: 389,
    lastActivity: "5 min ago",
    status: "active",
  },
  {
    id: "3",
    domain: "startup.dev",
    activePipelines: 3,
    mode: "parallel",
    candidates: 67,
    lastActivity: "18 min ago",
    status: "active",
  },
  {
    id: "4",
    domain: "enterprise.com",
    activePipelines: 15,
    mode: "strict",
    candidates: 512,
    lastActivity: "1 hour ago",
    status: "paused",
  },
  {
    id: "5",
    domain: "agency.co",
    activePipelines: 6,
    mode: "parallel",
    candidates: 156,
    lastActivity: "3 hours ago",
    status: "active",
  },
  {
    id: "6",
    domain: "consulting.io",
    activePipelines: 4,
    mode: "strict",
    candidates: 89,
    lastActivity: "5 hours ago",
    status: "error",
  },
]

export function PipelinesSection() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(initialPipelines)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    pipeline: Pipeline | null
  }>({ open: false, pipeline: null })

  const toggleMode = (id: string) => {
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, mode: p.mode === "strict" ? "parallel" : "strict" }
          : p
      )
    )
  }

  const deletePipeline = () => {
    if (deleteDialog.pipeline) {
      setPipelines((prev) =>
        prev.filter((p) => p.id !== deleteDialog.pipeline?.id)
      )
      setDeleteDialog({ open: false, pipeline: null })
    }
  }

  const getStatusColor = (status: Pipeline["status"]) => {
    switch (status) {
      case "active":
        return "bg-accent/20 text-accent border-accent/30"
      case "paused":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "error":
        return "bg-destructive/20 text-destructive border-destructive/30"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Pipelines</h2>
        <p className="text-sm text-muted-foreground">
          Manage hiring flows across all company domains
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-accent" />
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {pipelines.reduce((acc, p) => acc + p.activePipelines, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Active Flows</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
              <span className="text-[10px] font-bold text-accent-foreground">P</span>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {pipelines.filter((p) => p.mode === "parallel").length}
              </p>
              <p className="text-xs text-muted-foreground">Parallel Mode</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-chart-2 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {pipelines.filter((p) => p.mode === "strict").length}
              </p>
              <p className="text-xs text-muted-foreground">Strict Mode</p>
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
              <TableHead>Pipelines</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Candidates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Config</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipelines.map((pipeline) => (
              <TableRow key={pipeline.id}>
                <TableCell className="font-mono text-foreground">
                  {pipeline.domain}
                </TableCell>
                <TableCell>
                  <span className="text-foreground font-medium">
                    {pipeline.activePipelines}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={pipeline.mode === "parallel"}
                      onCheckedChange={() => toggleMode(pipeline.id)}
                      className="data-[state=checked]:bg-accent"
                    />
                    <span className="text-xs text-muted-foreground capitalize">
                      {pipeline.mode}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {pipeline.candidates.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(pipeline.status)}
                  >
                    {pipeline.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {pipeline.lastActivity}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Logic Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onClick={() =>
                          setDeleteDialog({ open: true, pipeline })
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Tenant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, pipeline: deleteDialog.pipeline })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entire Tenant System</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all data for{" "}
              <span className="font-mono text-foreground">
                {deleteDialog.pipeline?.domain}
              </span>
              , including all pipelines, candidates, and vault assets. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deletePipeline}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
