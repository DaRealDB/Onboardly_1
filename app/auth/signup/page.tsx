"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, Variants } from "framer-motion";

// Animation variants matching landing page style
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
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
    });

    if (error) {
      setError(error);
      toast.error("Sign up failed", { description: error });
      setIsLoading(false);
    } else {
      toast.success("Account created!", {
        description: "Welcome to Onboardly. Let's set up your workspace.",
      });

      router.push("/onboarding");
      router.refresh();
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={scaleIn} className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-100">
          {/* Header Section */}
          <motion.div variants={fadeUp} className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-10 h-10 bg-[#2563EB] rounded-md flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">O</span>
                </div>
              </motion.div>
              <span className="text-2xl font-bold text-[#0A1628]">
                Onboardly
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0A1628] mb-1">
              Create Account
            </h1>
            <p className="text-slate-600 text-sm">
              Start your journey with Onboardly
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={fadeUp}
          >
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-3 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </motion.div>
            )}

            {/* Full Name */}
            <motion.div variants={fadeUp} className="space-y-1.5">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-slate-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full pl-9 h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                />
              </div>
            </motion.div>

            {/* Email Address */}
            <motion.div variants={fadeUp} className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full pl-9 h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp} className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full pl-9 h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                />
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={fadeUp} className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full pl-9 h-11 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div variants={fadeUp} className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
