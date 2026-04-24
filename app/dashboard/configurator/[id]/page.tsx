'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  Plus,
  GripVertical,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Save,
  FileText,
  Upload,
  CreditCard,
  CalendarDays,
  PenTool,
  Settings2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { useTenant } from '@/lib/providers/tenant-provider'
import { useWorkflow } from '@/lib/hooks/use-workflows'
import { createClient } from '@/lib/supabase/client'
import { mutate } from 'swr'
import type { TemplateStep, StepType, LogicGateMode } from '@/lib/types/database'

const stepTypes: { value: StepType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'form', label: 'Form', icon: <FileText className="h-5 w-5" />, description: 'Collect information via form fields' },
  { value: 'file_upload', label: 'File Upload', icon: <Upload className="h-5 w-5" />, description: 'Request document uploads' },
  { value: 'signature_upload', label: 'Signature', icon: <PenTool className="h-5 w-5" />, description: 'Capture digital signatures' },
  { value: 'payment', label: 'Payment', icon: <CreditCard className="h-5 w-5" />, description: 'Collect payments via Stripe' },
  { value: 'scheduling', label: 'Scheduling', icon: <CalendarDays className="h-5 w-5" />, description: 'Book meetings or appointments' },
  { value: 'custom', label: 'Custom', icon: <Settings2 className="h-5 w-5" />, description: 'Custom task with instructions' },
]

export default function WorkflowBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string
  const { currentTenant, can } = useTenant()
  const { workflow, steps, isLoading } = useWorkflow(workflowId)
  const supabase = createClient()

  const [localSteps, setLocalSteps] = useState<TemplateStep[]>([])
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [logicMode, setLogicMode] = useState<LogicGateMode>('strict')
  const [isDefault, setIsDefault] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [isAddStepOpen, setIsAddStepOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<TemplateStep | null>(null)
  const [stepForm, setStepForm] = useState({
    name: '',
    description: '',
    step_type: 'form' as StepType,
    is_required: true,
    config: {} as Record<string, unknown>,
  })

  useEffect(() => {
    if (workflow) {
      setWorkflowName(workflow.name)
      setWorkflowDescription(workflow.description || '')
      setLogicMode(workflow.logic_mode)
      setIsDefault(workflow.is_default)
    }
  }, [workflow])

  useEffect(() => {
    if (steps) {
      setLocalSteps([...steps].sort((a, b) => a.step_order - b.step_order))
    }
  }, [steps])

  const canEdit = can('workflows:edit')

  const handleSave = async () => {
    if (!canEdit) return
    setIsSaving(true)

    try {
      // Update workflow
      const { error: workflowError } = await supabase
        .from('workflow_templates')
        .update({
          name: workflowName,
          description: workflowDescription || null,
          logic_mode: logicMode,
          is_default: isDefault,
        })
        .eq('id', workflowId)

      if (workflowError) throw workflowError

      // Update step orders
      for (let i = 0; i < localSteps.length; i++) {
        const step = localSteps[i]
        if (step.step_order !== i + 1) {
          const { error } = await supabase
            .from('template_steps')
            .update({ step_order: i + 1 })
            .eq('id', step.id)
          if (error) throw error
        }
      }

      mutate(`workflow-${workflowId}`)
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving workflow:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddStep = async () => {
    if (!canEdit) return

    try {
      const newOrder = localSteps.length + 1
      const { data, error } = await supabase
        .from('template_steps')
        .insert({
          template_id: workflowId,
          name: stepForm.name,
          description: stepForm.description || null,
          step_type: stepForm.step_type,
          step_order: newOrder,
          is_required: stepForm.is_required,
          config: stepForm.config,
        })
        .select()
        .single()

      if (error) throw error

      setLocalSteps([...localSteps, data])
      setIsAddStepOpen(false)
      resetStepForm()
      setHasChanges(true)
    } catch (error) {
      console.error('Error adding step:', error)
    }
  }

  const handleUpdateStep = async () => {
    if (!canEdit || !editingStep) return

    try {
      const { error } = await supabase
        .from('template_steps')
        .update({
          name: stepForm.name,
          description: stepForm.description || null,
          step_type: stepForm.step_type,
          is_required: stepForm.is_required,
          config: stepForm.config,
        })
        .eq('id', editingStep.id)

      if (error) throw error

      setLocalSteps(localSteps.map(s => 
        s.id === editingStep.id 
          ? { ...s, ...stepForm }
          : s
      ))
      setEditingStep(null)
      resetStepForm()
      setHasChanges(true)
    } catch (error) {
      console.error('Error updating step:', error)
    }
  }

  const handleDeleteStep = async (stepId: string) => {
    if (!canEdit) return

    try {
      const { error } = await supabase
        .from('template_steps')
        .delete()
        .eq('id', stepId)

      if (error) throw error

      setLocalSteps(localSteps.filter(s => s.id !== stepId))
      setHasChanges(true)
    } catch (error) {
      console.error('Error deleting step:', error)
    }
  }

  const handleDuplicateStep = async (step: TemplateStep) => {
    if (!canEdit) return

    try {
      const newOrder = localSteps.length + 1
      const { data, error } = await supabase
        .from('template_steps')
        .insert({
          template_id: workflowId,
          name: `${step.name} (Copy)`,
          description: step.description,
          step_type: step.step_type,
          step_order: newOrder,
          is_required: step.is_required,
          config: step.config,
        })
        .select()
        .single()

      if (error) throw error

      setLocalSteps([...localSteps, data])
      setHasChanges(true)
    } catch (error) {
      console.error('Error duplicating step:', error)
    }
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (!canEdit) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= localSteps.length) return

    const newSteps = [...localSteps]
    const temp = newSteps[index]
    newSteps[index] = newSteps[newIndex]
    newSteps[newIndex] = temp
    setLocalSteps(newSteps)
    setHasChanges(true)
  }

  const resetStepForm = () => {
    setStepForm({
      name: '',
      description: '',
      step_type: 'form',
      is_required: true,
      config: {},
    })
  }

  const openEditStep = (step: TemplateStep) => {
    setStepForm({
      name: step.name,
      description: step.description || '',
      step_type: step.step_type,
      is_required: step.is_required,
      config: step.config || {},
    })
    setEditingStep(step)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Workflow not found</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/configurator">Back to Configurator</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/configurator">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Workflow Builder</h1>
            <p className="text-muted-foreground">Configure onboarding steps for this workflow</p>
          </div>
        </div>

        {canEdit && (
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      {/* Workflow Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Workflow Settings</CardTitle>
          <CardDescription>Configure the basic settings for this workflow template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={workflowName}
                onChange={(e) => {
                  setWorkflowName(e.target.value)
                  setHasChanges(true)
                }}
                disabled={!canEdit}
                placeholder="e.g., Standard Onboarding"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logic">Logic Mode</Label>
              <Select
                value={logicMode}
                onValueChange={(value: LogicGateMode) => {
                  setLogicMode(value)
                  setHasChanges(true)
                }}
                disabled={!canEdit}
              >
                <SelectTrigger id="logic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">Strict (Sequential)</SelectItem>
                  <SelectItem value="parallel">Parallel (Any Order)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={workflowDescription}
              onChange={(e) => {
                setWorkflowDescription(e.target.value)
                setHasChanges(true)
              }}
              disabled={!canEdit}
              placeholder="Describe what this workflow is used for..."
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="default"
              checked={isDefault}
              onCheckedChange={(checked) => {
                setIsDefault(checked)
                setHasChanges(true)
              }}
              disabled={!canEdit}
            />
            <Label htmlFor="default">Set as default workflow for new clients</Label>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Workflow Steps</CardTitle>
            <CardDescription>
              {localSteps.length} step{localSteps.length !== 1 ? 's' : ''} - 
              {logicMode === 'strict' ? ' completed sequentially' : ' can be completed in any order'}
            </CardDescription>
          </div>
          {canEdit && (
            <Dialog open={isAddStepOpen} onOpenChange={setIsAddStepOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Step</DialogTitle>
                  <DialogDescription>
                    Configure a new step for this workflow
                  </DialogDescription>
                </DialogHeader>
                <StepForm
                  form={stepForm}
                  setForm={setStepForm}
                  stepTypes={stepTypes}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddStepOpen(false)
                    resetStepForm()
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStep} disabled={!stepForm.name}>
                    Add Step
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {localSteps.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No steps yet. Add your first step to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {localSteps.map((step, index) => {
                const typeInfo = stepTypes.find(t => t.value === step.step_type)
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    {canEdit && (
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveStep(index, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveStep(index, 'down')}
                          disabled={index === localSteps.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      {typeInfo?.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{step.name}</p>
                        {step.is_required && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        )}
                      </div>
                      {step.description && (
                        <p className="text-sm text-muted-foreground truncate">{step.description}</p>
                      )}
                    </div>

                    <Badge variant="outline" className="capitalize">
                      {step.step_type.replace('_', ' ')}
                    </Badge>

                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditStep(step)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateStep(step)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteStep(step.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Step Dialog */}
      <Dialog open={!!editingStep} onOpenChange={(open) => !open && setEditingStep(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Step</DialogTitle>
            <DialogDescription>
              Update the configuration for this step
            </DialogDescription>
          </DialogHeader>
          <StepForm
            form={stepForm}
            setForm={setStepForm}
            stepTypes={stepTypes}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingStep(null)
              resetStepForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStep} disabled={!stepForm.name}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StepForm({
  form,
  setForm,
  stepTypes,
}: {
  form: {
    name: string
    description: string
    step_type: StepType
    is_required: boolean
    config: Record<string, unknown>
  }
  setForm: (form: any) => void
  stepTypes: { value: StepType; label: string; icon: React.ReactNode; description: string }[]
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="step-name">Step Name</Label>
        <Input
          id="step-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., Upload ID Document"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="step-description">Description</Label>
        <Textarea
          id="step-description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Instructions for the client..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Step Type</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {stepTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setForm({ ...form, step_type: type.value })}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                form.step_type === type.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={form.step_type === type.value ? 'text-primary' : 'text-muted-foreground'}>
                {type.icon}
              </div>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="step-required"
          checked={form.is_required}
          onCheckedChange={(checked) => setForm({ ...form, is_required: checked })}
        />
        <Label htmlFor="step-required">This step is required to complete onboarding</Label>
      </div>
    </div>
  )
}
