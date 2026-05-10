"use client";

// Imports
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
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
import { Save, Check, Lock, Loader2, KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Component
export function ProfileTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Sync state when user loads
  useEffect(() => {
    if (user?.user_metadata?.full_name || user?.user_metadata?.fullName) {
      setFullName(user.user_metadata.full_name || user.user_metadata.fullName);
    }
  }, [user]);

  // Handlers
  const handleSaveProfile = async () => {
    setLoading(true);

    // 1. Update Auth Metadata (For Team Members)
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    // 2. Check if user is also a client and sync name there
    await supabase
      .from("clients")
      .update({ full_name: fullName })
      .eq("email", user?.email);

    if (authError) {
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive",
      });
    } else {
      setSaved(true);
      toast({ title: "Profile updated successfully" });
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match or are empty.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      // 1. Update Supabase Auth Password (Primary)
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      // 2. Sync to Clients table (If user is a client)
      // This ensures portal login using temp_password still works
      await supabase
        .from("clients")
        .update({ temp_password: newPassword })
        .eq("email", user?.email);

      if (authError) throw authError;

      toast({
        title: "Success",
        description: "Your password has been changed successfully.",
      });

      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Info Card */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>Update your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={fullName || ""}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? "Saved" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Direct Password Change Card */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" /> Security
          </CardTitle>
          <CardDescription>
            Change your password directly. No email confirmation required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleUpdatePassword}
            disabled={passwordLoading || !newPassword}
            className="gap-2"
          >
            {passwordLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
