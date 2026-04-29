"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Animation variants matching landing page style
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
      
      // Check if the error is related to email verification
      if (error.includes("verify your email") || error.includes("email confirmed")) {
        toast.error("Email verification required", { 
          description: "Please check your email for the confirmation link." 
        });
        // Redirect to signup-success page with email pre-filled
        window.location.href = `/auth/signup-success?email=${encodeURIComponent(email)}`;
      } else {
        toast.error("Sign in failed", { description: error });
      }
      setIsLoading(false);
    } else {
      toast.success("Welcome back!", { description: "Redirecting..." });
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={scaleIn} className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          {/* Onboardly Header */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-12 h-12 bg-[#2563EB] rounded-md flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">O</span>
                </div>
              </motion.div>
              <span className="text-2xl font-bold text-[#0A1628]">Onboardly</span>
            </div>
            <h1 className="text-3xl font-bold text-[#0A1628] mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to continue your journey</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="space-y-6" variants={fadeUp}>
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="space-y-2">
              <Label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 h-12 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 h-12 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </motion.form>
          
          <motion.div variants={fadeUp} className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors">
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
