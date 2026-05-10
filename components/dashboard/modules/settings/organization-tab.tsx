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
import { Save, Check, Loader2 } from "lucide-react";

// Component
export function OrganizationTab() {
  const { tenant, refreshTenant } = useTenant();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync with database
  useEffect(() => {
    if (tenant) {
      setName(tenant.name || "");
      setSlug(tenant.slug || "");
    }
  }, [tenant]);

  // Live Slug Preview Logic
  const handleNameChange = (newName: string) => {
    setName(newName);
    const generatedSlug = newName
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    setSlug(generatedSlug);
  };

  const handleSave = async () => {
    if (!tenant) return;
    setLoading(true);
    const { error } = await supabase
      .from("companies")
      .update({ name, slug })
      .eq("id", tenant.id);

    if (!error) {
      await refreshTenant();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Organization Details</CardTitle>
        <CardDescription>
          Manage your organization settings and public workspace identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={name || ""}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Workspace Slug (Live Preview)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                onboardly.app/
              </span>
              <Input
                value={slug || ""}
                onChange={(e) => setSlug(e.target.value)}
                className="pl-[95px] bg-muted/30"
              />
            </div>
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
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
