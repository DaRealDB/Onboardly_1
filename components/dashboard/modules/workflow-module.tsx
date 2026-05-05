'use client'

import { useState } from 'react'
import { useAppStore, type OnboardingTrack, type OnboardingStep } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Edit2,
  MoreVertical,
  GitBranch,
  FileStack,
  Paperclip,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function WorkflowModule() {
  const {
    onboardingTracks,
    documentSnippets,
    addOnboardingTrack,
    updateOnboardingTrack,
    deleteOnboardingTrack,
    addDocumentSnippet,
  } = useAppStore()

  const [newTrackDialogOpen, setNewTrackDialogOpen] = useState(false)
  const [newSnippetDialogOpen, setNewSnippetDialogOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState<OnboardingTrack | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Workflow Engine</h1>
        <p className="text-muted-foreground mt-1">
          Design onboarding tracks and manage document snippets
        </p>
      </div>

      <Tabs defaultValue="tracks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tracks" className="gap-2">
            <GitBranch className="h-4 w-4" />
            Onboarding Tracks
          </TabsTrigger>
          <TabsTrigger value="snippets" className="gap-2">
            <FileStack className="h-4 w-4" />
            Document Snippets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {onboardingTracks.length} track{onboardingTracks.length !== 1 && 's'} configured
            </p>
            <Dialog open={newTrackDialogOpen} onOpenChange={setNewTrackDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Track
                </Button>
              </DialogTrigger>
              <NewTrackDialog
                onSave={(track) => {
                  addOnboardingTrack(track)
                  setNewTrackDialogOpen(false)
                }}
              />
            </Dialog>
          </div>

          <div className="grid gap-4">
            {onboardingTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onEdit={() => setEditingTrack(track)}
                onDelete={() => deleteOnboardingTrack(track.id)}
                onUpdate={(updates) => updateOnboardingTrack(track.id, updates)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="snippets" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {documentSnippets.length} snippet{documentSnippets.length !== 1 && 's'} available
            </p>
            <Dialog open={newSnippetDialogOpen} onOpenChange={setNewSnippetDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <NewSnippetDialog
                onSave={(snippet) => {
                  addDocumentSnippet(snippet)
                  setNewSnippetDialogOpen(false)
                }}
              />
            </Dialog>
          </div>

          {documentSnippets.length === 0 ? (
            <Card className="border-border/50 border-dashed">
              <CardContent className="py-12 text-center">
                <FileStack className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground">No snippets yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create reusable document blueprints for quick requests
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {documentSnippets.map((snippet) => (
                <Card key={snippet.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{snippet.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {snippet.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Paperclip className="h-4 w-4" />
                      {snippet.attachments.length} requirement
                      {snippet.attachments.length !== 1 ? 's' : ''}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {editingTrack && (
        <Dialog open={!!editingTrack} onOpenChange={() => setEditingTrack(null)}>
          <EditTrackDialog
            track={editingTrack}
            onSave={(updates) => {
              updateOnboardingTrack(editingTrack.id, updates)
              setEditingTrack(null)
            }}
            onClose={() => setEditingTrack(null)}
          />
        </Dialog>
      )}
    </div>
  )
}

function TrackCard({
  track,
  onEdit,
  onDelete,
  onUpdate,
}: {
  track: OnboardingTrack
  onEdit: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<OnboardingTrack>) => void
}) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {track.name}
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  track.mode === 'strict'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                )}
              >
                {track.mode === 'strict' ? 'Sequential' : 'Parallel'}
              </span>
            </CardTitle>
            <CardDescription className="mt-1">
              {track.steps.length} step{track.steps.length !== 1 && 's'} configured
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    onUpdate({ mode: track.mode === 'strict' ? 'parallel' : 'strict' })
                  }
                >
                  Switch to {track.mode === 'strict' ? 'Parallel' : 'Sequential'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Track
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {track.steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{step.name}</p>
                {step.attachments.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {step.attachments.join(', ')}
                    </span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function NewTrackDialog({ onSave }: { onSave: (track: OnboardingTrack) => void }) {
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'strict' | 'parallel'>('strict')
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [newStepName, setNewStepName] = useState('')
  const [newStepAttachment, setNewStepAttachment] = useState('')

  const handleAddStep = () => {
    if (!newStepName.trim()) return
    setSteps([
      ...steps,
      {
        id: Date.now().toString(),
        name: newStepName,
        mandatory: true,
        attachments: newStepAttachment.trim() ? [newStepAttachment.trim()] : [],
      },
    ])
    setNewStepName('')
    setNewStepAttachment('')
  }

  const handleSave = () => {
    if (!name.trim() || steps.length === 0) return
    onSave({
      id: Date.now().toString(),
      name,
      mode,
      steps,
    })
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Create Onboarding Track</DialogTitle>
        <DialogDescription>
          Design a new onboarding workflow for your hires
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="trackName">Track Name</Label>
          <Input
            id="trackName"
            placeholder="e.g., Engineering Onboarding"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Flow Mode</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('strict')}
              className={`p-3 rounded-lg border text-left transition-colors ${
                mode === 'strict'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-sm text-foreground">Sequential</p>
              <p className="text-xs text-muted-foreground">Steps in order</p>
            </button>
            <button
              onClick={() => setMode('parallel')}
              className={`p-3 rounded-lg border text-left transition-colors ${
                mode === 'parallel'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-sm text-foreground">Parallel</p>
              <p className="text-xs text-muted-foreground">Any order</p>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Steps</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-2 p-2 bg-muted/50 rounded"
              >
                <span className="text-sm text-muted-foreground">{index + 1}.</span>
                <div className="flex-1">
                  <span className="text-sm">{step.name}</span>
                  {step.attachments.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({step.attachments.join(', ')})
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSteps(steps.filter((s) => s.id !== step.id))}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Step Title..."
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
              />
              <Input
                placeholder="Attachment Type (e.g., ID, Photo)..."
                value={newStepAttachment}
                onChange={(e) => setNewStepAttachment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleAddStep} className="w-full">
              Add Step
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSave} disabled={!name.trim() || steps.length === 0}>
          Create Track
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function EditTrackDialog({
  track,
  onSave,
  onClose,
}: {
  track: OnboardingTrack
  onSave: (updates: Partial<OnboardingTrack>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(track.name)
  const [mode, setMode] = useState(track.mode)
  const [steps, setSteps] = useState(track.steps)
  const [newStepName, setNewStepName] = useState('')
  const [newStepAttachment, setNewStepAttachment] = useState('')

  const handleAddStep = () => {
    if (!newStepName.trim()) return
    setSteps([
      ...steps,
      {
        id: Date.now().toString(),
        name: newStepName,
        mandatory: true,
        attachments: newStepAttachment.trim() ? [newStepAttachment.trim()] : [],
      },
    ])
    setNewStepName('')
    setNewStepAttachment('')
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Edit Track</DialogTitle>
        <DialogDescription>Modify your onboarding track settings</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Track Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Flow Mode</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('strict')}
              className={`p-3 rounded-lg border text-left transition-colors ${
                mode === 'strict'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-sm">Sequential</p>
            </button>
            <button
              onClick={() => setMode('parallel')}
              className={`p-3 rounded-lg border text-left transition-colors ${
                mode === 'parallel'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-sm">Parallel</p>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Steps</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-2 p-2 bg-muted/50 rounded"
              >
                <span className="text-sm text-muted-foreground">{index + 1}.</span>
                <div className="flex-1">
                  <span className="text-sm">{step.name}</span>
                  {step.attachments.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({step.attachments.join(', ')})
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSteps(steps.filter((s) => s.id !== step.id))}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Step Title..."
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
              />
              <Input
                placeholder="Attachment Type (e.g., ID, Photo)..."
                value={newStepAttachment}
                onChange={(e) => setNewStepAttachment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleAddStep} className="w-full">
              Add Step
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave({ name, mode, steps })}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  )
}

type SnippetItem = {
  id: string
  title: string
  attachmentTitle: string
  description: string
}

function NewSnippetDialog({
  onSave,
}: {
  onSave: (snippet: {
    id: string
    name: string
    description: string
    attachments: string[]
    instructions: string
    items?: SnippetItem[]
  }) => void
}) {
  const [name, setName] = useState('')
  const [items, setItems] = useState<SnippetItem[]>([])
  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemAttachment, setNewItemAttachment] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        title: newItemTitle.trim(),
        attachmentTitle: newItemAttachment.trim(),
        description: newItemDescription.trim(),
      },
    ])
    setNewItemTitle('')
    setNewItemAttachment('')
    setNewItemDescription('')
  }

  const handleSave = () => {
    if (!name.trim() || items.length === 0) return
    onSave({
      id: Date.now().toString(),
      name,
      description: `${items.length} requirement${items.length !== 1 ? 's' : ''}`,
      attachments: items.map((item) => item.attachmentTitle).filter(Boolean),
      instructions: '',
      items,
    })
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Create Document Snippet</DialogTitle>
        <DialogDescription>
          Build a micro-template with multiple requirements
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Snippet Name</Label>
          <Input
            placeholder="e.g., New Hire Document Pack"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Requirements</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-2 bg-muted/50 rounded"
              >
                <span className="text-sm text-muted-foreground mt-0.5">{index + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.attachmentTitle && (
                    <p className="text-xs text-muted-foreground">
                      Attachment: {item.attachmentTitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2 p-3 border border-dashed border-border rounded-lg">
            <Input
              placeholder="Title (e.g., Submit Government ID)"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />
            <Input
              placeholder="Title of Attachment (e.g., Company ID)"
              value={newItemAttachment}
              onChange={(e) => setNewItemAttachment(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <Button variant="outline" size="sm" onClick={handleAddItem} className="w-full">
              Add Requirement
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSave} disabled={!name.trim() || items.length === 0}>
          Create Snippet
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
