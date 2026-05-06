"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/providers";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);

type Mode = "signin" | "signup";

// Branding Panel (The blue sliding side)
const BrandingPanel = () => (
  <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-primary via-primary to-[var(--primary-hover)] text-primary-foreground flex flex-col p-10 lg:p-12">
    {/* Background Blobs */}
    <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    />

    {/* Logo - Top Left */}
    <Link
      href="/"
      className="relative z-10 flex items-center gap-2 w-fit hover:opacity-80 transition-opacity cursor-pointer inline-flex"
    >
      <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/25 shadow-sm">
        <span className="text-white text-lg font-bold leading-none">O</span>
      </div>
      <span className="text-lg font-semibold tracking-tight">Onboardly</span>
    </Link>

    {/* Messaging - Vertically Centered Layout, Left-Aligned Text */}
    <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6 w-full">
      <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.1] max-w-lg">
        Automate your corporate onboarding.
      </h2>
      <p className="text-base text-white/80 max-w-md leading-relaxed">
        Streamline new-hire workflows, paperwork, and training in one beautiful
        workspace — so your team can focus on what matters.
      </p>
    </div>
  </div>
);

// Form Component
const AuthForm = ({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp } = useAuth();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isSignup = mode === "signup";

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error)
      toast.error("Google Sign In Failed", { description: error.message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      setIsLoading(true);
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
      });

      if (error) {
        toast.error("Sign up failed", { description: error });
        setIsLoading(false);
      } else {
        toast.success("Account created!", {
          description: "Welcome to Onboardly. Let's set up your workspace.",
        });
        router.push("/onboarding");
        router.refresh();
      }
    } else {
      setIsLoading(true);
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        if (
          error.includes("verify your email") ||
          error.includes("email confirmed")
        ) {
          toast.error("Email verification required", {
            description: "Please check your email for the confirmation link.",
          });
          window.location.href = `/auth/signup-success?email=${encodeURIComponent(formData.email)}`;
        } else {
          toast.error("Sign in failed", { description: error });
        }
        setIsLoading(false);
      } else {
        toast.success("Welcome back!", { description: "Redirecting..." });
        router.push("/dashboard");
        router.refresh();
      }
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-card px-6 py-10 sm:px-10 lg:px-14 overflow-y-auto">
      <div className="w-full max-w-sm py-4">
        <div className="mb-8">
          <h1 className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-foreground">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup
              ? "Sign up to get started with Onboardly."
              : "Sign in to continue to Onboardly."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-1.5 animate-in fade-in duration-500">
              <Label htmlFor={`fullName-${mode}`}>Full Name</Label>
              <Input
                id={`fullName-${mode}`}
                name="fullName"
                type="text"
                placeholder="Jane Doe"
                required={isSignup}
                value={formData.fullName}
                onChange={handleChange}
                className="h-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor={`email-${mode}`}>Email Address</Label>
            <Input
              id={`email-${mode}`}
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="h-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <Input
                id={`password-${mode}`}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  isSignup ? "Create a strong password" : "Enter your password"
                }
                required
                value={formData.password}
                onChange={handleChange}
                className="h-11 pr-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Forgot password positioned under the input for Sign In */}
            {!isSignup && (
              <div className="flex justify-end pt-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-primary hover:text-[var(--primary-hover)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          {isSignup && (
            <div className="space-y-1.5 animate-in fade-in duration-500">
              <Label htmlFor={`confirmPassword-${mode}`}>
                Confirm Password
              </Label>
              <Input
                id={`confirmPassword-${mode}`}
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required={isSignup}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full h-11 font-medium text-[15px] bg-primary text-primary-foreground mt-2",
              "hover:bg-[var(--primary-hover)] hover:-translate-y-px hover:shadow-lg hover:shadow-primary/25",
              "active:translate-y-0 transition-all duration-200",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(isSignup ? "signin" : "signup")}
            className="font-medium text-primary hover:text-[var(--primary-hover)] transition-colors"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

// Main Page
export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const isSignup = mode === "signup";

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-6 lg:p-8">
      {/* Mobile Layout */}
      <div className="lg:hidden w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden h-[600px] overflow-y-auto">
        <Suspense
          fallback={
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <AuthForm mode={mode} setMode={setMode} />
        </Suspense>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block relative w-full max-w-6xl h-[680px] rounded-3xl border border-border/60 bg-card shadow-card overflow-hidden">
        {/* Sign Up Side */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1/2 transition-all duration-700 ease-[cubic-bezier(0.83,0,0.17,1)] overflow-y-auto",
            isSignup
              ? "opacity-100 translate-x-0 delay-300"
              : "opacity-0 -translate-x-8 pointer-events-none",
          )}
        >
          <Suspense
            fallback={
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            }
          >
            <AuthForm mode="signup" setMode={setMode} />
          </Suspense>
        </div>

        {/* Sign In Side */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-1/2 transition-all duration-700 ease-[cubic-bezier(0.83,0,0.17,1)] overflow-y-auto",
            !isSignup
              ? "opacity-100 translate-x-0 delay-300"
              : "opacity-0 translate-x-8 pointer-events-none",
          )}
        >
          <Suspense
            fallback={
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            }
          >
            <AuthForm mode="signin" setMode={setMode} />
          </Suspense>
        </div>

        {/* Sliding Branding Panel */}
        <div
          className={cn(
            "absolute inset-y-0 w-1/2 transition-transform duration-700 ease-[cubic-bezier(0.83,0,0.17,1)] z-10",
            isSignup ? "translate-x-full" : "translate-x-0",
          )}
        >
          <BrandingPanel />
        </div>
      </div>
    </main>
  );
}
