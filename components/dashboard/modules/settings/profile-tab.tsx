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

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user?.user_metadata?.full_name || user?.user_metadata?.fullName) {
      setFullName(user.user_metadata.full_name || user.user_metadata.fullName);
    }
  }, [user]);

  // Handlers
  const handleSaveProfile = async () => {
    setLoading(true);

    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (user?.email) {
      await supabase
        .from("clients")
        .update({ full_name: fullName })
        .eq("email", user.email);
    }

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
    setPwdMessage({ type: "", text: "" });

    if (!newPassword || newPassword !== confirmPassword) {
      setPwdMessage({
        type: "error",
        text: "Passwords do not match or are empty.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (authError) throw authError;

      if (user?.email) {
        await supabase
          .from("clients")
          .update({ temp_password: newPassword })
          .eq("email", user.email);
      }

      setPwdMessage({
        type: "success",
        text: "Your password has been changed successfully.",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setPwdMessage({ type: "error", text: error.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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

          {pwdMessage.text && (
            <p
              className={`text-sm font-medium ${pwdMessage.type === "error" ? "text-destructive" : "text-green-600 dark:text-green-500"}`}
            >
              {pwdMessage.text}
            </p>
          )}

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
