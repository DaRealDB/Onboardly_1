// Imports
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  MoreVertical,
  GitBranch,
  FileStack,
  Loader2,
  Paperclip,
} from "lucide-react";

// Types
export type WorkflowStep = {
  id?: string;
  track_id?: string;
  step_order: number;
  title: string;
  attachment_type: string;
};

export type WorkflowTrack = {
  id: string;
  company_id: string;
  name: string;
  mode: "strict" | "parallel";
  steps: WorkflowStep[];
};

export type SnippetItem = {
  id: string;
  title: string;
  attachmentTitle: string;
};

export type DocumentSnippet = {
  id: string;
  company_id: string;
  title: string;
  instructions: string | null;
  items: SnippetItem[];
};

// Main Component
export function WorkflowModule() {
  const [tracks, setTracks] = useState<WorkflowTrack[]>([]);
  const [snippets, setSnippets] = useState<DocumentSnippet[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [newTrackDialogOpen, setNewTrackDialogOpen] = useState(false);
  const [newSnippetDialogOpen, setNewSnippetDialogOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<WorkflowTrack | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<DocumentSnippet | null>(
    null,
  );

  const supabase = createClient();

  // Fetch functions
  const loadData = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: teamData } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamData) return;
    setCompanyId(teamData.company_id);

    const { data: tracksData } = await supabase
      .from("workflow_tracks")
      .select("*, workflow_steps(*)")
      .eq("company_id", teamData.company_id)
      .order("created_at", { ascending: false });

    const { data: snippetsData } = await supabase
      .from("document_snippets")
      .select("*")
      .eq("company_id", teamData.company_id)
      .order("created_at", { ascending: false });

    if (tracksData) {
      const formattedTracks = tracksData.map((t) => ({
        ...t,
        steps: t.workflow_steps.sort(
          (a: any, b: any) => a.step_order - b.step_order,
        ),
      }));
      setTracks(formattedTracks);
    }

    if (snippetsData) {
      setSnippets(snippetsData);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleAddTrack = async (
    name: string,
    mode: "strict" | "parallel",
    steps: WorkflowStep[],
  ) => {
    if (!companyId) return;
    const { data: trackData } = await supabase
      .from("workflow_tracks")
      .insert({ company_id: companyId, name, mode })
      .select()
      .single();

    if (trackData && steps.length > 0) {
      const stepsToInsert = steps.map((s, idx) => ({
        track_id: trackData.id,
        step_order: idx + 1,
        title: s.title,
        attachment_type: s.attachment_type,
      }));
      await supabase.from("workflow_steps").insert(stepsToInsert);
    }
    setNewTrackDialogOpen(false);
    loadData();
  };

  const handleUpdateTrack = async (
    trackId: string,
    name: string,
    mode: "strict" | "parallel",
    steps: WorkflowStep[],
  ) => {
    await supabase
      .from("workflow_tracks")
      .update({ name, mode })
      .eq("id", trackId);
    await supabase.from("workflow_steps").delete().eq("track_id", trackId);

    if (steps.length > 0) {
      const stepsToInsert = steps.map((s, idx) => ({
        track_id: trackId,
        step_order: idx + 1,
        title: s.title,
        attachment_type: s.attachment_type,
      }));
      await supabase.from("workflow_steps").insert(stepsToInsert);
    }
    setEditingTrack(null);
    loadData();
  };

  const handleDeleteTrack = async (trackId: string) => {
    await supabase.from("workflow_tracks").delete().eq("id", trackId);
    loadData();
  };

  const handleAddSnippet = async (
    title: string,
    instructions: string,
    items: SnippetItem[],
  ) => {
    if (!companyId) return;
    await supabase
      .from("document_snippets")
      .insert({ company_id: companyId, title, instructions, items });
    setNewSnippetDialogOpen(false);
    loadData();
  };

  const handleUpdateSnippet = async (
    snippetId: string,
    title: string,
    instructions: string,
    items: SnippetItem[],
  ) => {
    await supabase
      .from("document_snippets")
      .update({ title, instructions, items })
      .eq("id", snippetId);
    setEditingSnippet(null);
    loadData();
  };

  const handleDeleteSnippet = async (snippetId: string) => {
    await supabase.from("document_snippets").delete().eq("id", snippetId);
    loadData();
  };

  const handleToggleTrackMode = async (
    trackId: string,
    currentMode: string,
  ) => {
    const newMode = currentMode === "strict" ? "parallel" : "strict";
    await supabase
      .from("workflow_tracks")
      .update({ mode: newMode })
      .eq("id", trackId);
    loadData();
  };

  // View
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Process Automations
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Configure structured onboarding tracks and reusable document
          collection templates to streamline your workforce operations.
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
              {tracks.length} track{tracks.length !== 1 && "s"} configured
            </p>
            <Dialog
              open={newTrackDialogOpen}
              onOpenChange={setNewTrackDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Track
                </Button>
              </DialogTrigger>
              <NewTrackDialog onSave={handleAddTrack} />
            </Dialog>
          </div>

          <div className="grid gap-4">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onEdit={() => setEditingTrack(track)}
                onDelete={() => handleDeleteTrack(track.id)}
                onToggleMode={() => handleToggleTrackMode(track.id, track.mode)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="snippets" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {snippets.length} snippet{snippets.length !== 1 && "s"} available
            </p>
            <Dialog
              open={newSnippetDialogOpen}
              onOpenChange={setNewSnippetDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Snippet
                </Button>
              </DialogTrigger>
              <NewSnippetDialog onSave={handleAddSnippet} />
            </Dialog>
          </div>

          {snippets.length === 0 ? (
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {snippets.map((snippet) => (
                <Card
                  key={snippet.id}
                  className="border-border/50 flex flex-col"
                >
                  <CardHeader className="pb-3 flex-1">
                    <div className="flex items-start justify-between w-full">
                      <div className="min-w-0 flex-1 pr-4">
                        <CardTitle className="text-base truncate">
                          {snippet.title}
                        </CardTitle>
                        <CardDescription className="mt-1 max-h-32 overflow-y-auto whitespace-pre-wrap break-all pr-2">
                          {snippet.instructions || "No instructions provided"}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingSnippet(snippet)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteSnippet(snippet.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      <Paperclip className="h-4 w-4 shrink-0" />
                      <span>
                        {snippet.items?.length || 0} required attachment
                        {(snippet.items?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Edit Dialogs */}
      {editingTrack && (
        <Dialog
          open={!!editingTrack}
          onOpenChange={(open) => !open && setEditingTrack(null)}
        >
          <EditTrackDialog
            track={editingTrack}
            onSave={(name, mode, steps) =>
              handleUpdateTrack(editingTrack.id, name, mode, steps)
            }
            onClose={() => setEditingTrack(null)}
          />
        </Dialog>
      )}
      {editingSnippet && (
        <Dialog
          open={!!editingSnippet}
          onOpenChange={(open) => !open && setEditingSnippet(null)}
        >
          <EditSnippetDialog
            snippet={editingSnippet}
            onSave={(title, instructions, items) =>
              handleUpdateSnippet(editingSnippet.id, title, instructions, items)
            }
            onClose={() => setEditingSnippet(null)}
          />
        </Dialog>
      )}
    </div>
  );
}

// Track Components
function TrackCard({
  track,
  onEdit,
  onDelete,
  onToggleMode,
}: {
  track: WorkflowTrack;
  onEdit: () => void;
  onDelete: () => void;
  onToggleMode: () => void;
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
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  track.mode === "strict"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700",
                )}
              >
                {track.mode === "strict" ? "Sequential" : "Parallel"}
              </span>
            </CardTitle>
            <CardDescription className="mt-1">
              {track.steps.length} mandatory step
              {track.steps.length !== 1 && "s"} configured
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-2"
            >
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
                <DropdownMenuItem onClick={onToggleMode}>
                  Switch to{" "}
                  {track.mode === "strict" ? "Parallel" : "Sequential"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive"
                >
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
              key={step.id || index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <span className="text-sm font-medium text-muted-foreground w-6">
                {step.step_order}.
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {step.title}
                </p>
                {step.attachment_type && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Requires: {step.attachment_type}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NewTrackDialog({
  onSave,
}: {
  onSave: (
    name: string,
    mode: "strict" | "parallel",
    steps: WorkflowStep[],
  ) => void;
}) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"strict" | "parallel">("strict");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepAttachment, setNewStepAttachment] = useState("");

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    setSteps([
      ...steps,
      {
        step_order: steps.length + 1,
        title: newStepTitle,
        attachment_type: newStepAttachment.trim(),
      },
    ]);
    setNewStepTitle("");
    setNewStepAttachment("");
  };

  const handleSave = () => {
    if (!name.trim() || steps.length === 0) return;
    onSave(name, mode, steps);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSteps = [...steps];
    const draggedItem = newSteps[draggedIndex];

    newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, draggedItem);

    const reorderedSteps = newSteps.map((s, i) => ({
      ...s,
      step_order: i + 1,
    }));
    setSteps(reorderedSteps);
    setDraggedIndex(null);
  };

  return (
    <DialogContent className="sm:max-w-xl">
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
              onClick={() => setMode("strict")}
              className={`p-3 rounded-lg border text-left transition-colors ${
                mode === "strict"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm text-foreground">Sequential</p>
              <p className="text-xs text-muted-foreground">
                Steps must be done in order
              </p>
            </button>
            <button
              onClick={() => setMode("parallel")}
              className={`p-3 rounded-lg border text-left transition-colors ${
                mode === "parallel"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm text-foreground">Parallel</p>
              <p className="text-xs text-muted-foreground">Done in any order</p>
            </button>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <Label>Steps Setup</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {steps.map((step, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={cn(
                  "flex items-center gap-2 p-2 bg-muted/50 rounded border border-transparent transition-all cursor-move",
                  draggedIndex === index && "opacity-50 border-primary",
                )}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground w-4">
                  {step.step_order}.
                </span>
                <div className="flex-1">
                  <span className="text-sm font-medium">{step.title}</span>
                  {step.attachment_type && (
                    <span className="text-xs ml-2 text-muted-foreground">
                      ({step.attachment_type})
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() =>
                    setSteps(
                      steps
                        .filter((_, i) => i !== index)
                        .map((s, i) => ({ ...s, step_order: i + 1 })),
                    )
                  }
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {steps.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                No steps added yet. Add a step below.
              </p>
            )}
          </div>

          <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
            <div className="flex gap-2">
              <Input
                placeholder="Step Title (e.g., Submit ID)"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Attachment Type (Optional)"
                value={newStepAttachment}
                onChange={(e) => setNewStepAttachment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddStep()}
                className="flex-1"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddStep}
              className="w-full"
            >
              Add Step
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleSave}
          disabled={!name.trim() || steps.length === 0}
        >
          Create Track
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function EditTrackDialog({
  track,
  onSave,
  onClose,
}: {
  track: WorkflowTrack;
  onSave: (
    name: string,
    mode: "strict" | "parallel",
    steps: WorkflowStep[],
  ) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(track.name);
  const [mode, setMode] = useState(track.mode);
  const [steps, setSteps] = useState<WorkflowStep[]>(track.steps);

  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepAttachment, setNewStepAttachment] = useState("");

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    setSteps([
      ...steps,
      {
        step_order: steps.length + 1,
        title: newStepTitle,
        attachment_type: newStepAttachment.trim(),
      },
    ]);
    setNewStepTitle("");
    setNewStepAttachment("");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSteps = [...steps];
    const draggedItem = newSteps[draggedIndex];

    newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, draggedItem);

    const reorderedSteps = newSteps.map((s, i) => ({
      ...s,
      step_order: i + 1,
    }));
    setSteps(reorderedSteps);
    setDraggedIndex(null);
  };

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Edit Track</DialogTitle>
        <DialogDescription>
          Modify your onboarding track settings
        </DialogDescription>
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
              onClick={() => setMode("strict")}
              className={`p-3 rounded-lg border text-left transition-colors ${
                mode === "strict"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm">Sequential</p>
            </button>
            <button
              onClick={() => setMode("parallel")}
              className={`p-3 rounded-lg border text-left transition-colors ${
                mode === "parallel"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm">Parallel</p>
            </button>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <Label>Manage Steps</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {steps.map((step, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={cn(
                  "flex items-center gap-2 p-2 bg-muted/50 rounded border border-transparent transition-all cursor-move",
                  draggedIndex === index && "opacity-50 border-primary",
                )}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground w-4">
                  {step.step_order}.
                </span>
                <div className="flex-1">
                  <span className="text-sm font-medium">{step.title}</span>
                  {step.attachment_type && (
                    <span className="text-xs ml-2 text-muted-foreground">
                      ({step.attachment_type})
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() =>
                    setSteps(
                      steps
                        .filter((_, i) => i !== index)
                        .map((s, i) => ({ ...s, step_order: i + 1 })),
                    )
                  }
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
            <div className="flex gap-2">
              <Input
                placeholder="Step Title (e.g., Submit ID)"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Attachment Type (Optional)"
                value={newStepAttachment}
                onChange={(e) => setNewStepAttachment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddStep()}
                className="flex-1"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddStep}
              className="w-full"
            >
              Add Step
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave(name, mode, steps)}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
}

// Snippet Components
function NewSnippetDialog({
  onSave,
}: {
  onSave: (title: string, instructions: string, items: SnippetItem[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [items, setItems] = useState<SnippetItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemAttachment, setNewItemAttachment] = useState("");

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        title: newItemTitle.trim(),
        attachmentTitle: newItemAttachment.trim(),
      },
    ]);
    setNewItemTitle("");
    setNewItemAttachment("");
  };

  const handleSave = () => {
    if (!title.trim() || items.length === 0) return;
    onSave(title, instructions, items);
  };

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Create Document Snippet</DialogTitle>
        <DialogDescription>
          Build a reusable multi-document request for your existing hires
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Snippet Title</Label>
          <Input
            placeholder="e.g., Government Forms"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>General Instructions</Label>
          <Textarea
            placeholder="e.g., Please read the required forms carefully and ensure all documents uploaded are clear and valid."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="resize-none h-24"
          />
        </div>

        <div className="space-y-2 border-t pt-4">
          <Label>Required Attachments</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-2 bg-muted/50 rounded"
              >
                <span className="text-sm font-medium text-muted-foreground w-4 mt-0.5">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.attachmentTitle && (
                    <p className="text-xs text-muted-foreground">
                      Format/Type: {item.attachmentTitle}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() =>
                    setItems(items.filter((i) => i.id !== item.id))
                  }
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                No attachments required yet.
              </p>
            )}
          </div>

          <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
            <div className="flex gap-2">
              <Input
                placeholder="Requirement (e.g., Valid ID)"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Type (e.g., PDF/Image)"
                value={newItemAttachment}
                onChange={(e) => setNewItemAttachment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                className="flex-1"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddItem}
              className="w-full"
            >
              Add Required Attachment
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleSave}
          disabled={!title.trim() || items.length === 0}
        >
          Create Snippet
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function EditSnippetDialog({
  snippet,
  onSave,
  onClose,
}: {
  snippet: DocumentSnippet;
  onSave: (title: string, instructions: string, items: SnippetItem[]) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(snippet.title);
  const [instructions, setInstructions] = useState(snippet.instructions || "");
  const [items, setItems] = useState<SnippetItem[]>(snippet.items || []);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemAttachment, setNewItemAttachment] = useState("");

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        title: newItemTitle.trim(),
        attachmentTitle: newItemAttachment.trim(),
      },
    ]);
    setNewItemTitle("");
    setNewItemAttachment("");
  };

  const handleSave = () => {
    if (!title.trim() || items.length === 0) return;
    onSave(title, instructions, items);
  };

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Edit Document Snippet</DialogTitle>
        <DialogDescription>
          Modify your reusable multi-document request
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Snippet Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>General Instructions</Label>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="resize-none h-24"
          />
        </div>

        <div className="space-y-2 border-t pt-4">
          <Label>Required Attachments</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-2 bg-muted/50 rounded"
              >
                <span className="text-sm font-medium text-muted-foreground w-4 mt-0.5">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.attachmentTitle && (
                    <p className="text-xs text-muted-foreground">
                      Format/Type: {item.attachmentTitle}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() =>
                    setItems(items.filter((i) => i.id !== item.id))
                  }
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                No attachments required.
              </p>
            )}
          </div>

          <div className="space-y-2 p-3 border rounded-lg bg-muted/20">
            <div className="flex gap-2">
              <Input
                placeholder="Requirement (e.g., Valid ID)"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Type (e.g., PDF/Image)"
                value={newItemAttachment}
                onChange={(e) => setNewItemAttachment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                className="flex-1"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddItem}
              className="w-full"
            >
              Add Required Attachment
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!title.trim() || items.length === 0}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
