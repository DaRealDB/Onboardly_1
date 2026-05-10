"use client";

// Imports
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTenant } from "@/lib/providers/tenant-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Save, Check, Loader2 } from "lucide-react";

// Component
export function BrandTab() {
  const { tenant, refreshTenant } = useTenant();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (tenant) {
      setPrimaryColor(tenant.brand_color || "#3B82F6");
      setLogo(tenant.logo_url || "");
    }
  }, [tenant]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenant) return;

    setLoading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${tenant.id}-${Math.random()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("branding")
      .upload(filePath, file);

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("branding").getPublicUrl(filePath);
      await supabase
        .from("companies")
        .update({ logo_url: publicUrl })
        .eq("id", tenant.id);
      setLogo(publicUrl);
      await refreshTenant();
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!tenant) return;
    setLoading(true);
    const { error } = await supabase
      .from("companies")
      .update({ brand_color: primaryColor })
      .eq("id", tenant.id);

    if (!error) {
      await refreshTenant();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Brand Identity</CardTitle>
          <CardDescription>
            Customize your brand appearance for the client portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              {logo ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-16 w-16 object-contain rounded"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click to change
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload logo</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label>Primary Brand Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor || "#3B82F6"}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-20 rounded cursor-pointer border border-border"
              />
              <span className="text-sm font-mono text-muted-foreground uppercase">
                {primaryColor}
              </span>
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
            {saved ? "Branding Saved" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription>How your workspace looks to clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="rounded-lg border border-border p-4 space-y-4"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}20 100%)`,
            }}
          >
            <div className="flex items-center gap-3">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 w-10 rounded object-contain"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  {tenant?.name?.[0] || "O"}
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">
                  {tenant?.name || "Your Company"}
                </p>
                <p className="text-xs text-muted-foreground">
                  onboardly.app/{tenant?.slug}
                </p>
              </div>
            </div>
            <button
              className="w-full py-2 px-4 rounded-md text-white text-sm font-medium"
              style={{ backgroundColor: primaryColor }}
            >
              Portal Action Button
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
