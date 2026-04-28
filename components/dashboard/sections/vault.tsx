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
  Lock,
  FileText,
  PenTool,
  HardDrive,
  Trash2,
  Download,
  Eye,
} from "lucide-react"

interface VaultAsset {
  id: string
  name: string
  type: "contract" | "signature" | "document"
  domain: string
  size: string
  uploadedBy: string
  uploadedDate: string
  signed: boolean
}

const initialAssets: VaultAsset[] = [
  {
    id: "1",
    name: "Employment_Contract_SarahChen.pdf",
    type: "contract",
    domain: "acme.co",
    size: "245 KB",
    uploadedBy: "HR System",
    uploadedDate: "2026-04-20",
    signed: true,
  },
  {
    id: "2",
    name: "NDA_TechCorp_2026.pdf",
    type: "contract",
    domain: "techcorp.io",
    size: "128 KB",
    uploadedBy: "Legal Bot",
    uploadedDate: "2026-04-18",
    signed: true,
  },
  {
    id: "3",
    name: "Signature_MarcusJohnson.png",
    type: "signature",
    domain: "techcorp.io",
    size: "12 KB",
    uploadedBy: "Marcus Johnson",
    uploadedDate: "2026-04-18",
    signed: true,
  },
  {
    id: "4",
    name: "Offer_Letter_JamesWilson.pdf",
    type: "document",
    domain: "enterprise.com",
    size: "89 KB",
    uploadedBy: "HR System",
    uploadedDate: "2026-04-22",
    signed: false,
  },
  {
    id: "5",
    name: "Background_Check_EmilyRodriguez.pdf",
    type: "document",
    domain: "startup.dev",
    size: "1.2 MB",
    uploadedBy: "Verification Service",
    uploadedDate: "2026-04-15",
    signed: true,
  },
  {
    id: "6",
    name: "Signature_AishaPatel.png",
    type: "signature",
    domain: "agency.co",
    size: "8 KB",
    uploadedBy: "Aisha Patel",
    uploadedDate: "2026-04-12",
    signed: true,
  },
]

export function VaultSection() {
  const [assets, setAssets] = useState<VaultAsset[]>(initialAssets)
  const [purgeDialog, setPurgeDialog] = useState<{
    open: boolean
    asset: VaultAsset | null
  }>({ open: false, asset: null })

  const purgeAsset = () => {
    if (purgeDialog.asset) {
      setAssets((prev) => prev.filter((a) => a.id !== purgeDialog.asset?.id))
      setPurgeDialog({ open: false, asset: null })
    }
  }

  const getTypeIcon = (type: VaultAsset["type"]) => {
    switch (type) {
      case "contract":
        return <FileText className="h-4 w-4 text-chart-2" />
      case "signature":
        return <PenTool className="h-4 w-4 text-accent" />
      case "document":
        return <FileText className="h-4 w-4 text-chart-3" />
    }
  }

  const getTypeBadge = (type: VaultAsset["type"]) => {
    switch (type) {
      case "contract":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      case "signature":
        return "bg-accent/20 text-accent border-accent/30"
      case "document":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
    }
  }

  const totalAssets = assets.length
  const contracts = assets.filter((a) => a.type === "contract").length
  const signatures = assets.filter((a) => a.type === "signature").length
  const totalSize = "3.2 GB"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Vault</h2>
        <p className="text-sm text-muted-foreground">
          Secure storage for contracts, signatures, and documents
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {totalSize}
              </p>
              <p className="text-xs text-muted-foreground">Total Storage</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/20">
              <FileText className="h-4 w-4 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {contracts}
              </p>
              <p className="text-xs text-muted-foreground">Contracts</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <PenTool className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {signatures}
              </p>
              <p className="text-xs text-muted-foreground">Signatures</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {totalAssets}
              </p>
              <p className="text-xs text-muted-foreground">Total Assets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getTypeIcon(asset.type)}
                    <div>
                      <p className="font-mono text-sm text-foreground truncate max-w-[200px]">
                        {asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {asset.uploadedBy}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getTypeBadge(asset.type)}
                  >
                    {asset.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {asset.domain}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {asset.size}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(asset.uploadedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {asset.signed ? (
                    <Badge
                      variant="outline"
                      className="bg-accent/20 text-accent border-accent/30"
                    >
                      Signed
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-chart-3/20 text-chart-3 border-chart-3/30"
                    >
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setPurgeDialog({ open: true, asset })}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Purge
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Purge Confirmation Dialog */}
      <AlertDialog
        open={purgeDialog.open}
        onOpenChange={(open) =>
          setPurgeDialog({ open, asset: purgeDialog.asset })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purge Vault Asset</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-mono text-foreground">
                {purgeDialog.asset?.name}
              </span>
              . This action cannot be undone and the file cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={purgeAsset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Purge Asset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
