"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { motion, Variants } from "framer-motion";

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      company_name: formData.companyName,
    });

    if (error) {
      setError(error);
      toast.error("Sign up failed", { description: error });
      setIsLoading(false);
    } else {
      toast.success("Account created!", {
        description: "Check your email to verify your account.",
      });
      router.push("/auth/signup-success");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={scaleIn} className="w-full max-w-md">
        {/* Branding header */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-11 h-11 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white text-lg font-bold">O</span>
              </div>
            </motion.div>
            <span className="text-2xl font-bold text-[#0A1628]">Onboardly</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0A1628]">Create Account</h1>
          <p className="text-slate-500 mt-1">Start your journey with Onboardly</p>
        </motion.div>

        {/* Card */}
        <motion.div variants={fadeUp}>
          <Card className="border-0 shadow-xl shadow-slate-200/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-semibold text-[#0A1628]">
                Create your account
              </CardTitle>
              <CardDescription>
                Start your 14-day free trial. No credit card required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <svg
                      className="w-4.5 h-4.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Full Name + Company (side-by-side) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName" className="text-sm font-medium text-slate-700">
                      Company
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Acme Inc"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Creating account…
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2.5 text-muted-foreground font-medium">
                    Already have an account?
                  </span>
                </div>
              </div>
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Sign in instead
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
