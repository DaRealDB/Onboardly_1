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
import { Progress } from "@/components/ui/progress"
import { Users, UserCheck, UserX, Clock, Trash2 } from "lucide-react"

interface Hire {
  id: string
  name: string
  email: string
  domain: string
  position: string
  stage: number
  totalStages: number
  status: "active" | "hired" | "rejected"
  appliedDate: string
}

const initialHires: Hire[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@email.com",
    domain: "acme.co",
    position: "Senior Engineer",
    stage: 4,
    totalStages: 5,
    status: "active",
    appliedDate: "2026-04-15",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@email.com",
    domain: "techcorp.io",
    position: "Product Manager",
    stage: 3,
    totalStages: 4,
    status: "active",
    appliedDate: "2026-04-18",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@email.com",
    domain: "startup.dev",
    position: "UX Designer",
    stage: 4,
    totalStages: 4,
    status: "hired",
    appliedDate: "2026-04-10",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james@email.com",
    domain: "enterprise.com",
    position: "DevOps Lead",
    stage: 2,
    totalStages: 5,
    status: "active",
    appliedDate: "2026-04-22",
  },
  {
    id: "5",
    name: "Aisha Patel",
    email: "aisha@email.com",
    domain: "agency.co",
    position: "Data Analyst",
    stage: 3,
    totalStages: 3,
    status: "rejected",
    appliedDate: "2026-04-08",
  },
  {
    id: "6",
    name: "David Kim",
    email: "david@email.com",
    domain: "acme.co",
    position: "Frontend Dev",
    stage: 2,
    totalStages: 5,
    status: "active",
    appliedDate: "2026-04-25",
  },
]

export function HiresSection() {
  const [hires, setHires] = useState<Hire[]>(initialHires)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    hire: Hire | null
  }>({ open: false, hire: null })

  const removeHire = () => {
    if (deleteDialog.hire) {
      setHires((prev) => prev.filter((h) => h.id !== deleteDialog.hire?.id))
      setDeleteDialog({ open: false, hire: null })
    }
  }

  const getStatusColor = (status: Hire["status"]) => {
    switch (status) {
      case "active":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      case "hired":
        return "bg-accent/20 text-accent border-accent/30"
      case "rejected":
        return "bg-destructive/20 text-destructive border-destructive/30"
    }
  }

  const totalCandidates = hires.length
  const activeCandidates = hires.filter((h) => h.status === "active").length
  const hiredCandidates = hires.filter((h) => h.status === "hired").length
  const pendingReview = hires.filter(
    (h) => h.status === "active" && h.stage >= h.totalStages - 1
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Hires</h2>
        <p className="text-sm text-muted-foreground">
          Track candidates across all company pipelines
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {totalCandidates.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Candidates</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/20">
              <Clock className="h-4 w-4 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {activeCandidates}
              </p>
              <p className="text-xs text-muted-foreground">In Pipeline</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <UserCheck className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {hiredCandidates}
              </p>
              <p className="text-xs text-muted-foreground">Hired</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/20">
              <UserX className="h-4 w-4 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {pendingReview}
              </p>
              <p className="text-xs text-muted-foreground">Final Stage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>Candidate</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hires.map((hire) => (
              <TableRow key={hire.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{hire.name}</p>
                    <p className="text-xs text-muted-foreground">{hire.email}</p>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {hire.domain}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {hire.position}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <Progress
                      value={(hire.stage / hire.totalStages) * 100}
                      className="h-2 flex-1"
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {hire.stage}/{hire.totalStages}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(hire.status)}
                  >
                    {hire.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(hire.appliedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteDialog({ open: true, hire })}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
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
          setDeleteDialog({ open, hire: deleteDialog.hire })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Hire Record</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {deleteDialog.hire?.name}
              </span>
              &apos;s record from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeHire}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
