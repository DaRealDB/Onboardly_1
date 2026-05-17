"use client";

import { useState, useRef } from "react";
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
import { Upload, Building2, Globe, ArrowRight } from "lucide-react";

export function IdentityStep() {
  const { setCurrentView, setTenant } = useAppStore();
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCompanyName(val);

    // Auto-generate slug only if they haven't manually typed in the slug box
    if (!isSlugEdited) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-"),
      );
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugEdited(true);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    setTenant({
      companyName,
      workspaceUrl: slug, // Sends purely the slug, no .com attached to the state
      logo: logo || undefined,
      primaryColor: "#6366f1",
      secondaryColor: "#22c55e",
    });
    setCurrentView("wizard-theme");
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Company Identity
        </CardTitle>
        <CardDescription>
          Tell us about your company and customize your workspace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Acme Corporation"
            value={companyName}
            onChange={handleNameChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slugInput">Workspace URL</Label>
          <div className="relative flex h-10 w-full items-center overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="grid w-full">
              {/* Ghost layer that positions the solid black .com snugly at the end */}
              <div className="col-start-1 row-start-1 flex items-center pointer-events-none whitespace-pre">
                <span className="invisible">{slug || "your-company"}</span>
                <span className="text-foreground font-medium">.com</span>
              </div>
              {/* Interactive input layer placed directly on top */}
              <input
                id="slugInput"
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="your-company"
                className="col-start-1 row-start-1 bg-transparent w-full focus:outline-none text-foreground placeholder:text-muted-foreground z-10"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            This will be your unique workspace URL
          </p>
        </div>

        <div className="space-y-2">
          <Label>Company Logo (Optional)</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            {logo ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={logo}
                  alt="Company logo"
                  className="h-16 w-16 object-contain rounded"
                />
                <p className="text-sm text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  SVG, PNG, or JPG (max. 2MB)
                </p>
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

        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!companyName.trim()}
            className="gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
