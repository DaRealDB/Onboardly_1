'use client'

import { useState, useMemo } from 'react'
import { useAppStore, type Document } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Filter,
  Download,
  Eye,
  ExternalLink,
  MoreHorizontal,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
  FolderLock,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SortField = 'fileName' | 'employeeName' | 'type' | 'status' | 'uploadedAt'
type SortOrder = 'asc' | 'desc'

export function VaultModule() {
  const { documents, clients, updateDocument, setCurrentModule } = useAppStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('uploadedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)

  const enrichedDocuments = documents.map((doc) => ({
    ...doc,
    employeeName:
      clients.find((c) => c.id === doc.employeeId)?.fullName || doc.employeeName,
  }))

  const filteredAndSortedDocs = useMemo(() => {
    return enrichedDocuments
      .filter((doc) => {
        const matchesSearch =
          doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
        const matchesType = typeFilter === 'all' || doc.type === typeFilter
        return matchesSearch && matchesStatus && matchesType
      })
      .sort((a, b) => {
        let comparison = 0
        switch (sortField) {
          case 'fileName':
            comparison = a.fileName.localeCompare(b.fileName)
            break
          case 'employeeName':
            comparison = a.employeeName.localeCompare(b.employeeName)
            break
          case 'type':
            comparison = a.type.localeCompare(b.type)
            break
          case 'status':
            comparison = a.status.localeCompare(b.status)
            break
          case 'uploadedAt':
            comparison =
              new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
            break
        }
        return sortOrder === 'asc' ? comparison : -comparison
      })
  }, [enrichedDocuments, searchQuery, statusFilter, typeFilter, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'id':
        return 'ID Document'
      case 'contract':
        return 'Contract'
      case 'certificate':
        return 'Certificate'
      case 'other':
        return 'Other'
    }
  }

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === 'pending').length,
    approved: documents.filter((d) => d.status === 'approved').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">The Vault</h1>
        <p className="text-muted-foreground mt-1">
          Central repository for all onboarding documents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="id">ID Document</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedDocs.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="py-12 text-center">
            <FolderLock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground">No documents found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Documents uploaded by clients will appear here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('fileName')}
                >
                  <div className="flex items-center gap-2">
                    File Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('employeeName')}
                >
                  <div className="flex items-center gap-2">
                    Employee
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-2">
                    Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('uploadedAt')}
                >
                  <div className="flex items-center gap-2">
                    Uploaded
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.employeeName}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {getTypeLabel(doc.type)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span
                        className={cn(
                          'text-sm capitalize',
                          doc.status === 'approved' && 'text-green-600',
                          doc.status === 'pending' && 'text-amber-600',
                          doc.status === 'rejected' && 'text-red-600'
                        )}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(doc.uploadedAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewDoc(doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setCurrentModule('people')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Go to Source
                        </DropdownMenuItem>
                        {doc.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                updateDocument(doc.id, { status: 'approved' })
                              }
                              className="text-green-600"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateDocument(doc.id, { status: 'rejected' })
                              }
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {previewDoc && (
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {previewDoc.fileName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-2" />
                  <p>Document Preview</p>
                  <p className="text-sm">Preview not available in demo</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Employee</p>
                  <p className="font-medium">{previewDoc.employeeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{getTypeLabel(previewDoc.type)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(previewDoc.status)}
                    <span className="font-medium capitalize">{previewDoc.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p className="font-medium">{formatDate(previewDoc.uploadedAt)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                {previewDoc.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      className="text-green-600 hover:text-green-600 gap-2"
                      onClick={() => {
                        updateDocument(previewDoc.id, { status: 'approved' })
                        setPreviewDoc(null)
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-600 gap-2"
                      onClick={() => {
                        updateDocument(previewDoc.id, { status: 'rejected' })
                        setPreviewDoc(null)
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
