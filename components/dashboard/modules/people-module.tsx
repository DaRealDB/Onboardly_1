'use client'

import { useState } from 'react'
import { useAppStore, type Client } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  UserPlus,
  Clock,
  CheckCircle2,
  MoreVertical,
  Mail,
  Phone,
  FileText,
  Eye,
  Key,
  UserX,
  Copy,
  AlertCircle,
  Trash2,
  Check,
  X,
  Download,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TabValue = 'pending' | 'hired'

export function PeopleModule() {
  const {
    clients,
    onboardingTracks,
    documentSnippets,
    addClient,
    updateClient,
    deleteClient,
    addNotification,
  } = useAppStore()

  const [activeTab, setActiveTab] = useState<TabValue>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false)
  const [viewCredentialsDialog, setViewCredentialsDialog] = useState<Client | null>(null)
  const [requestDocumentDialog, setRequestDocumentDialog] = useState<Client | null>(null)
  const [viewDocumentsDialog, setViewDocumentsDialog] = useState<Client | null>(null)

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === 'pending') {
      return matchesSearch && (client.status === 'pending' || client.status === 'to-be-hired')
    }
    if (activeTab === 'hired') {
      return matchesSearch && (client.status === 'hired' || client.status === 'offboarded')
    }
    return matchesSearch
  })

  const counts = {
    pending: clients.filter((c) => c.status === 'pending' || c.status === 'to-be-hired').length,
    hired: clients.filter((c) => c.status === 'hired' || c.status === 'offboarded').length,
  }

  const handleFinalizeHire = (client: Client) => {
    updateClient(client.id, {
      status: 'hired',
      hiredAt: new Date(),
      tempCredentials: undefined,
    })
    addNotification({
      id: Date.now().toString(),
      title: 'Hire Finalized',
      message: `${client.fullName} has been successfully hired`,
      type: 'success',
      read: false,
      createdAt: new Date(),
    })
  }

  const handleOffboard = (client: Client) => {
    updateClient(client.id, { status: 'offboarded' })
    addNotification({
      id: Date.now().toString(),
      title: 'Client Offboarded',
      message: `${client.fullName} has been offboarded`,
      type: 'info',
      read: false,
      createdAt: new Date(),
    })
  }

  const handleResetPassword = (client: Client) => {
    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
    const username = client.email.split('@')[0].toLowerCase()
    updateClient(client.id, {
      tempCredentials: { username, password: newPassword },
    })
    addNotification({
      id: Date.now().toString(),
      title: 'Password Reset',
      message: `Password has been reset for ${client.fullName}`,
      type: 'success',
      read: false,
      createdAt: new Date(),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">People & Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage clients through their onboarding journey
          </p>
        </div>
        <Dialog open={addClientDialogOpen} onOpenChange={setAddClientDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <AddClientDialog
            tracks={onboardingTracks}
            onSave={(client) => {
              addClient(client)
              setAddClientDialogOpen(false)
              addNotification({
                id: Date.now().toString(),
                title: 'New Client Added',
                message: `${client.fullName} has been added as ${client.status === 'hired' ? 'a direct hire' : 'a new hire'}`,
                type: 'success',
                read: false,
                createdAt: new Date(),
              })
            }}
          />
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {counts.pending}
            </span>
          </TabsTrigger>
          <TabsTrigger value="hired" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Hired
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {counts.hired}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <ClientList
            clients={filteredClients}
            emptyTitle="No pending reviews"
            emptyDescription="Clients completing onboarding will appear here"
            onViewCredentials={setViewCredentialsDialog}
            onViewDocuments={setViewDocumentsDialog}
            onRequestDocument={setRequestDocumentDialog}
            onFinalizeHire={handleFinalizeHire}
            onDeleteClient={deleteClient}
            viewType="pending"
          />
        </TabsContent>

        <TabsContent value="hired" className="mt-6">
          <ClientList
            clients={filteredClients}
            emptyTitle="No hired clients"
            emptyDescription="Finalized hires will appear here"
            onViewCredentials={setViewCredentialsDialog}
            onViewDocuments={setViewDocumentsDialog}
            onRequestDocument={setRequestDocumentDialog}
            onResetPassword={handleResetPassword}
            onDeleteClient={deleteClient}
            viewType="hired"
          />
        </TabsContent>
      </Tabs>

      {viewCredentialsDialog && (
        <Dialog
          open={!!viewCredentialsDialog}
          onOpenChange={() => setViewCredentialsDialog(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Temporary Credentials</DialogTitle>
              <DialogDescription>
                Credentials for {viewCredentialsDialog.fullName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {viewCredentialsDialog.tempCredentials ? (
                <div className="space-y-2">
                  <Label>Credentials</Label>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap break-all">
{`Link: ${typeof window !== 'undefined' ? window.location.origin : 'https://onboardly.app'}
Username: ${viewCredentialsDialog.tempCredentials.username}
Password: ${viewCredentialsDialog.tempCredentials.password}`}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 gap-2"
                      onClick={() =>
                        navigator.clipboard.writeText(
`Link: ${typeof window !== 'undefined' ? window.location.origin : 'https://onboardly.app'}
Username: ${viewCredentialsDialog.tempCredentials!.username}
Password: ${viewCredentialsDialog.tempCredentials!.password}`
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  No temporary credentials available
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {requestDocumentDialog && (
        <Dialog
          open={!!requestDocumentDialog}
          onOpenChange={() => setRequestDocumentDialog(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Document</DialogTitle>
              <DialogDescription>
                Send a document request to {requestDocumentDialog.fullName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {documentSnippets.length > 0 ? (
                <div className="space-y-2">
                  <Label>Select Snippet</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a snippet..." />
                    </SelectTrigger>
                    <SelectContent>
                      {documentSnippets.map((snippet) => (
                        <SelectItem key={snippet.id} value={snippet.id}>
                          {snippet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No document snippets available</p>
                  <p className="text-sm">Create snippets in the Workflow Engine</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  addNotification({
                    id: Date.now().toString(),
                    title: 'Document Requested',
                    message: `Document request sent to ${requestDocumentDialog.fullName}`,
                    type: 'info',
                    read: false,
                    createdAt: new Date(),
                  })
                  setRequestDocumentDialog(null)
                }}
                disabled={documentSnippets.length === 0}
              >
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {viewDocumentsDialog && (
        <Dialog
          open={!!viewDocumentsDialog}
          onOpenChange={() => setViewDocumentsDialog(null)}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Documents for {viewDocumentsDialog.fullName}</DialogTitle>
              <DialogDescription>
                Review and manage submitted documents
              </DialogDescription>
            </DialogHeader>
            <ViewDocumentsContent client={viewDocumentsDialog} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ViewDocumentsContent({ client }: { client: Client }) {
  // Mock document data based on assigned track steps
  const mockDocuments = [
    {
      id: '1',
      stepTitle: 'Government ID',
      attachmentName: 'passport_scan.pdf',
      uploadedAt: new Date(Date.now() - 86400000 * 2),
      status: 'pending' as const,
    },
    {
      id: '2',
      stepTitle: 'Proof of Address',
      attachmentName: 'utility_bill.pdf',
      uploadedAt: new Date(Date.now() - 86400000),
      status: 'pending' as const,
    },
    {
      id: '3',
      stepTitle: 'Profile Photo',
      attachmentName: 'headshot.jpg',
      uploadedAt: new Date(),
      status: 'pending' as const,
    },
  ]

  const [documents, setDocuments] = useState(mockDocuments)

  const handleAccept = (docId: string) => {
    setDocuments(docs => docs.map(d => d.id === docId ? { ...d, status: 'accepted' as const } : d))
  }

  const handleRequestChange = (docId: string) => {
    setDocuments(docs => docs.map(d => d.id === docId ? { ...d, status: 'change-requested' as const } : d))
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4" />
        <p>No documents submitted yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-4 p-4 rounded-lg border border-border"
        >
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">{doc.stepTitle}</p>
            <p className="text-sm text-muted-foreground truncate">{doc.attachmentName}</p>
            <p className="text-xs text-muted-foreground">
              Uploaded {doc.uploadedAt.toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {doc.status === 'accepted' && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                Accepted
              </span>
            )}
            {doc.status === 'change-requested' && (
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                Change Requested
              </span>
            )}
            {doc.status === 'pending' && (
              <>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleAccept(doc.id)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  onClick={() => handleRequestChange(doc.id)}
                >
                  <X className="h-3.5 w-3.5" />
                  Request Change
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function ClientList({
  clients,
  emptyTitle,
  emptyDescription,
  onViewCredentials,
  onViewDocuments,
  onRequestDocument,
  onFinalizeHire,
  onOffboard,
  onDeleteClient,
  onResetPassword,
  viewType,
}: {
  clients: Client[]
  emptyTitle: string
  emptyDescription: string
  onViewCredentials: (client: Client) => void
  onViewDocuments: (client: Client) => void
  onRequestDocument: (client: Client) => void
  onFinalizeHire?: (client: Client) => void
  onOffboard?: (client: Client) => void
  onDeleteClient?: (id: string) => void
  onResetPassword?: (client: Client) => void
  viewType: 'pending' | 'hired'
}) {
  if (clients.length === 0) {
    return (
      <Card className="border-border/50 border-dashed">
        <CardContent className="py-12 text-center">
          <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground">{emptyTitle}</h3>
          <p className="text-sm text-muted-foreground mt-1">{emptyDescription}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {clients.map((client) => (
        <Card key={client.id} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-lg">
                {client.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{client.fullName}</h3>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      client.status === 'hired' && 'bg-green-100 text-green-700',
                      client.status === 'pending' && 'bg-amber-100 text-amber-700',
                      client.status === 'to-be-hired' && 'bg-blue-100 text-blue-700',
                      client.status === 'offboarded' && 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {client.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {client.email}
                  </span>
                  {client.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onFinalizeHire && (client.status === 'pending' || client.status === 'to-be-hired') && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onFinalizeHire(client)}
                  >
                    Finalize Hire
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {viewType === 'pending' && (
                      <>
                        <DropdownMenuItem onClick={() => onViewCredentials(client)}>
                          <Key className="h-4 w-4 mr-2" />
                          View Credentials
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewDocuments(client)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {onDeleteClient && (
                          <DropdownMenuItem
                            onClick={() => onDeleteClient(client.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    {viewType === 'hired' && (
                      <>
                        <DropdownMenuItem onClick={() => onViewCredentials(client)}>
                          <Key className="h-4 w-4 mr-2" />
                          View Credentials
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewDocuments(client)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onRequestDocument(client)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Add Request Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onResetPassword?.(client)}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {onDeleteClient && (
                          <DropdownMenuItem
                            onClick={() => onDeleteClient(client.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function AddClientDialog({
  tracks,
  onSave,
}: {
  tracks: { id: string; name: string }[]
  onSave: (client: Client) => void
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isDirectHire, setIsDirectHire] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState('')

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) return

    const generatePassword = () =>
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

    const username = email.split('@')[0].toLowerCase()

    onSave({
      id: Date.now().toString(),
      fullName,
      email,
      phone: phone || undefined,
      status: isDirectHire ? 'hired' : 'pending',
      assignedTrack: isDirectHire ? undefined : selectedTrack || undefined,
      tempCredentials: isDirectHire
        ? undefined
        : { username, password: generatePassword() },
      documents: [],
      createdAt: new Date(),
      hiredAt: isDirectHire ? new Date() : undefined,
    })
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogDescription>
          Add a client to onboard or hire directly
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            placeholder="+1 555-0123"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <Label htmlFor="directHire" className="font-medium">
              Direct Hire
            </Label>
            <p className="text-sm text-muted-foreground">
              Skip onboarding and hire immediately
            </p>
          </div>
          <Switch
            id="directHire"
            checked={isDirectHire}
            onCheckedChange={setIsDirectHire}
          />
        </div>

        {!isDirectHire && tracks.length > 0 && (
          <div className="space-y-2">
            <Label>Assign Track</Label>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger>
                <SelectValue placeholder="Select an onboarding track..." />
              </SelectTrigger>
              <SelectContent>
                {tracks.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button onClick={handleSave} disabled={!fullName.trim() || !email.trim()}>
          {isDirectHire ? 'Add as Hired' : 'Add to Onboarding'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
