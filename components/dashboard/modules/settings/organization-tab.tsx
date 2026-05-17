"use client";

// Imports
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTenant } from "@/lib/providers/tenant-provider";
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
import { Save, Check, Loader2, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Component
export function OrganizationTab() {
  const { tenant, refreshTenant } = useTenant();
  const { toast } = useToast();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync
  useEffect(() => {
    if (tenant) {
      setName(tenant.name || "");
      const cleanSlug = (tenant.slug || "").replace(/\.com$/, "");
      setSlug(cleanSlug);
    }
  }, [tenant]);

  // Handlers
  const handleNameChange = (newName: string) => {
    setName(newName);

    // Auto-generates the matching slug cleanly without manual edits
    const generatedSlug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    setSlug(generatedSlug);
  };

  const handleSave = async () => {
    if (!tenant) return;

    if (!name.trim() || !slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name and slug cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("companies")
      .update({ name, slug })
      .eq("id", tenant.id);

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message.includes("unique constraint")
          ? "This workspace domain is already taken. Please choose another."
          : error.message,
        variant: "destructive",
      });
    } else {
      await refreshTenant();
      setSaved(true);
      toast({
        title: "Success",
        description: "Organization details updated.",
      });
      setTimeout(() => setSaved(false), 2000);
    }

    setLoading(false);
  };

  // UI
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Organization Details
        </CardTitle>
        <CardDescription>
          Manage your organization settings and public workspace identity
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Corp"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label>Workspace Domain</Label>
            {/* Non-editable read-only display box to fix unclickable grid bugs */}
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3 py-2 text-sm cursor-not-allowed overflow-hidden">
              <span className="text-foreground font-medium truncate">
                {slug || "acme-corp"}
              </span>
              <span className="text-muted-foreground whitespace-nowrap">
                .com
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground">
              This is your unique portal domain auto-generated from your company
              name.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading || !name || !slug}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Changes Saved" : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
