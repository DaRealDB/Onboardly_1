"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Added for hard redirect
import { createClient } from "@/lib/supabase/client"; // Added for DB access
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

interface Step {
  id: string;
  name: string;
  mandatory: boolean;
  attachments: string[];
}

export function LogicStep() {
  const router = useRouter();
  const supabase = createClient();
  const { tenant, addOnboardingTrack } = useAppStore();

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
    // This assumes your WizardLayout listens to this view to show Step 2
    const { setCurrentView } = useAppStore.getState();
    setCurrentView("wizard-theme");
  };

  // THE FIXED LAUNCH LOGIC
  const handleLaunch = async () => {
    setIsLoading(true);
    try {
      // 1. Get current user for the owner_id requirement
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // 2. Create the Tenant using your specific schema columns
      const { data: newTenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          owner_id: session.user.id, // Required by your schema
          name: tenant?.companyName || trackName, // Maps to company name
          slug: tenant?.workspaceUrl || `org-${Date.now()}`, // Maps to URL
          brand_color: tenant?.primaryColor || "#3B82F6", // Maps to brand color
          default_logic_mode: mode, // Sets your chosen 'strict' or 'parallel' mode
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // NOTE: Your database trigger 'on_tenant_created_add_owner'
      // automatically handles adding you to team_members. No extra code needed here!

      // 3. Save the Workflow Template using the new tenant ID
      const { error: trackError } = await supabase
        .from("workflow_templates")
        .insert({
          tenant_id: newTenant.id,
          name: trackName,
          mode: mode,
        });

      if (trackError) {
        console.warn(
          "Tenant created, but template failed:",
          trackError.message,
        );
      }

      toast.success("Workspace launched successfully!");

      // 4. Hard Redirect to Dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error("Launch failed", { description: err.message });
      console.error("Supabase Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="space-y-2">
          <Label htmlFor="trackName">Track Name</Label>
          <Input
            id="trackName"
            placeholder="e.g., Standard Onboarding"
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
          />
        </div>

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

        <div className="space-y-3">
          <Label>Onboarding Steps</Label>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
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
