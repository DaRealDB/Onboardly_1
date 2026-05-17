"use client";

// Imports
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  ArrowLeft,
  Rocket,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Settings2,
} from "lucide-react";

// Types
interface Step {
  id: string;
  name: string;
  mandatory: boolean;
  attachments: string[];
}

export function LogicStep() {
  const router = useRouter();
  const supabase = createClient();
  const { tenant } = useAppStore();

  // State
  const [trackName, setTrackName] = useState("Default Onboarding");
  const [mode, setMode] = useState<"strict" | "parallel">("strict");
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { id: "1", name: "Personal Information", mandatory: true, attachments: [] },
    {
      id: "2",
      name: "ID Verification",
      mandatory: true,
      attachments: ["ID Photo"],
    },
    {
      id: "3",
      name: "Contract Signing",
      mandatory: true,
      attachments: ["Employment Contract"],
    },
  ]);
  const [newStepName, setNewStepName] = useState("");
  const [newStepAttachment, setNewStepAttachment] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Handlers
  const handleAddStep = () => {
    if (!newStepName.trim()) return;
    setSteps([
      ...steps,
      {
        id: Date.now().toString(),
        name: newStepName,
        mandatory: true,
        attachments: newStepAttachment.trim() ? [newStepAttachment.trim()] : [],
      },
    ]);
    setNewStepName("");
    setNewStepAttachment("");
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleBack = () => {
    const { setCurrentView } = useAppStore.getState();
    setCurrentView("wizard-theme");
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newSteps = [...steps];
    const draggedStep = newSteps[draggedIndex];
    newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, draggedStep);
    setSteps(newSteps);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleLaunch = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // 1. Create the Company
      const { data: newCompany, error: companyError } = await supabase
        .from("companies")
        .insert({
          owner_id: session.user.id,
          name: tenant?.companyName || trackName,
          slug: tenant?.workspaceUrl || `org-${Date.now()}`,
          brand_color: tenant?.primaryColor || "#3B82F6",
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // 2. Create the Workflow Track linked to the Company
      const { data: newTrack, error: trackError } = await supabase
        .from("workflow_tracks")
        .insert({
          company_id: newCompany.id,
          name: trackName,
          mode: mode,
        })
        .select()
        .single();

      if (trackError) throw trackError;

      // 3. Insert the individual Workflow Steps
      if (steps.length > 0) {
        const stepsToInsert = steps.map((step, index) => ({
          track_id: newTrack.id,
          step_order: index + 1,
          title: step.name,
          attachment_type:
            step.attachments.length > 0 ? step.attachments.join(", ") : "none",
        }));

        const { error: stepsError } = await supabase
          .from("workflow_steps")
          .insert(stepsToInsert);

        if (stepsError) throw stepsError;
      }

      toast.success("Workspace launched successfully!");
      router.push("/tenantdashboard");
      router.refresh();
    } catch (err: any) {
      // FIX: Force Supabase to stringify the error so it doesn't just show {}
      const errorMessage = err?.message || err?.details || JSON.stringify(err);
      toast.error("Launch failed", { description: errorMessage });
      console.error(
        "Supabase Error Full Details:",
        JSON.stringify(err, null, 2),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Render
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Onboarding Logic
        </CardTitle>
        <CardDescription>
          Create your first onboarding track to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Track Name Input */}
        <div className="space-y-2">
          <Label htmlFor="trackName">Track Name</Label>
          <Input
            id="trackName"
            placeholder="e.g., Standard Onboarding"
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
          />
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <Label>Flow Mode</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("strict")}
              className={`p-4 rounded-lg border text-left transition-colors ${
                mode === "strict"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-foreground">Strict (Sequential)</p>
              <p className="text-sm text-muted-foreground mt-1">
                Steps must be completed in order
              </p>
            </button>
            <button
              onClick={() => setMode("parallel")}
              className={`p-4 rounded-lg border text-left transition-colors ${
                mode === "parallel"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-foreground">Parallel (Flexible)</p>
              <p className="text-sm text-muted-foreground mt-1">
                Steps can be completed in any order
              </p>
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          <Label>Onboarding Steps</Label>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border transition-opacity ${
                  draggedIndex === index ? "opacity-50" : "opacity-100"
                }`}
              >
                <div className="cursor-grab active:cursor-grabbing p-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground w-6">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {step.name}
                  </p>
                  {step.attachments.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Attachment: {step.attachments.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStep(step.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add Step Inputs */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Step Title..."
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
              />
              <Input
                placeholder="Attachment Title..."
                value={newStepAttachment}
                onChange={(e) => setNewStepAttachment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddStep()}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleAddStep}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Step
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex justify-between">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleLaunch}
            disabled={isLoading || !trackName.trim() || steps.length === 0}
            className="gap-2"
          >
            {isLoading ? (
              "Launching..."
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Launch Dashboard
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
