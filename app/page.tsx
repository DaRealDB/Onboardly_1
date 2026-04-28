"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  Variants,
} from "framer-motion";
import {
  Menu,
  X,
  Palette,
  GitBranch,
  Send,
  Shield,
  Globe,
  Check,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowRight,
  Star,
  BarChart3,
  Bell,
} from "lucide-react";

// ─── Motion Variants ──────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({
  end,
  prefix = "",
  suffix = "",
}: {
  end: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [triggered, end]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const LOGOS = [
  "Apex Legal Group",
  "Summit Financial",
  "Meridian Consulting",
  "Sterling Creative",
  "Atlas Advisory",
  "Fortis Law Partners",
  "Nova Strategy",
  "Pinnacle Group",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Palette,
    title: "Brand Your Portal",
    description:
      "Upload your logo, set brand colors, and create a portal that feels like it was built by your firm — not a SaaS vendor. Live preview before going live.",
  },
  {
    step: "02",
    icon: GitBranch,
    title: "Build the Workflow",
    description:
      "Use the Policy Engine to design your sequence. Enforce strict order or allow flexible parallel completion — your call, your clients.",
  },
  {
    step: "03",
    icon: Send,
    title: "Invite & Track Live",
    description:
      "Send a secure branded link and watch real-time progress on your dashboard. Automated reminders chase down stuck clients so you don't have to.",
  },
];

const SECONDARY_FEATURES = [
  {
    icon: GitBranch,
    title: "Policy Engine",
    desc: "Strict Mode or Parallel Mode. Control exactly how clients progress through onboarding.",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    desc: "Smart scheduling nudges stuck clients. No more chasing.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    desc: "portal.yourdomain.com with auto-provisioned SSL. Fully native enterprise URLs.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Live pipeline dashboard. Know exactly where every client stands at all times.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Onboardly transformed how we onboard new clients. What used to take weeks of back-and-forth emails now completes in under 48 hours. Our clients comment on how professional the experience feels — and that trust translates directly into retainer renewals.",
    name: "Sarah Chen",
    role: "Managing Partner",
    company: "Chen & Associates Law",
    initials: "SC",
  },
  {
    quote:
      "The white-labeling is flawless. Clients have no idea they're using a third-party tool — it just looks like our firm's portal.",
    name: "Marcus Webb",
    role: "CEO",
    company: "Webb Financial Group",
    initials: "MW",
  },
  {
    quote:
      "We've reclaimed 15+ hours per client onboarded. That's directly billable time back in our pocket every single month.",
    name: "Diana Reyes",
    role: "Operations Director",
    company: "Reyes Creative Agency",
    initials: "DR",
  },
  {
    quote:
      "Setup took 20 minutes. First client through the portal the same day. The ROI was immediate.",
    name: "James Whitmore",
    role: "Principal Consultant",
    company: "Whitmore Consulting",
    initials: "JW",
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    description: "Perfect for solo practitioners and small teams",
    cta: "Start Free Trial",
    ctaHref: "/auth/signup",
    highlight: false,
    features: [
      { text: "Up to 5 active clients", included: true },
      { text: "Basic white-labeling (logo + colors)", included: true },
      { text: "Secure document vault (50GB)", included: true },
      { text: "E-signature workflows", included: true },
      { text: "Email support", included: true },
      { text: "Standard templates", included: true },
      { text: "Strict Mode policy enforcement", included: false },
      { text: "Custom domain", included: false },
    ],
  },
  {
    name: "Professional",
    monthlyPrice: 3999,
    yearlyPrice: 39990,
    description: "For growing firms managing multiple clients",
    cta: "Start Free Trial",
    ctaHref: "/auth/signup",
    highlight: true,
    features: [
      { text: "Up to 25 active clients", included: true },
      { text: "Full white-labeling + CSS variables", included: true },
      { text: "Secure document vault (500GB)", included: true },
      { text: "E-signature workflows", included: true },
      { text: "Strict & Parallel Mode", included: true },
      { text: "Automated client reminders", included: true },
      { text: "Priority support", included: true },
      { text: "Real-time analytics dashboard", included: true },
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: 15999,
    yearlyPrice: 159990,
    description: "For established firms demanding total control",
    cta: "Book a Demo",
    ctaHref: "/auth/signup",
    highlight: false,
    features: [
      { text: "Unlimited active clients", included: true },
      { text: "Complete white-labeling + CSS engine", included: true },
      { text: "Unlimited storage", included: true },
      { text: "Custom domain + auto SSL", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom API integrations", included: true },
      { text: "SSO/SAML authentication", included: true },
      { text: "99.9% SLA uptime guarantee", included: true },
    ],
  },
];

const FAQS = [
  {
    q: 'What counts as an "active client"?',
    a: "A client with an open onboarding portal. Once they complete onboarding, they no longer count toward your limit.",
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees, ever. All plans include onboarding assistance and template setup at no extra cost.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Yes. Changes take effect immediately, and we'll prorate the difference on your next invoice.",
  },
  {
    q: "What's included in the free trial?",
    a: "14 days of full Professional plan access. No credit card required to start.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingYearly, setPricingYearly] = useState(false);
  const { scrollY } = useScroll();
  const [navHidden, setNavHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setNavHidden(true);
    } else {
      setNavHidden(false);
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* ── Fonts & Global Styles ── */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-sora { font-family: 'Sora', sans-serif; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
          align-items: center;
          width: max-content;
        }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Navbar ── */}
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={navHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#2563EB] rounded-md flex items-center justify-center">
                <span className="font-sora text-white text-xs font-bold">
                  O
                </span>
              </div>
              <span className="font-sora text-lg font-bold text-[#0A1628]">
                Onboardly
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                ["Features", "#features"],
                ["How It Works", "#how-it-works"],
                ["Pricing", "#pricing"],
                ["Case Studies", "#case-studies"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-[#475569] text-sm font-medium hover:text-[#0A1628] transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-[#475569] text-sm font-medium hover:text-[#0A1628] transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-[#475569]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              <nav className="flex flex-col gap-4">
                {[
                  ["Features", "#features"],
                  ["How It Works", "#how-it-works"],
                  ["Pricing", "#pricing"],
                  ["Case Studies", "#case-studies"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#475569] font-medium hover:text-[#0A1628]"
                  >
                    {label}
                  </a>
                ))}
                <hr className="border-slate-100" />
                <Link href="/auth/login" className="text-[#475569] font-medium">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#2563EB] text-white px-4 py-2.5 rounded-lg font-semibold text-center"
                >
                  Start Free Trial
                </Link>
              </nav>
            </div>
          )}
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="bg-[#F8FAFC] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left — copy */}
            <motion.div
              className="flex-1 lg:max-w-[55%]"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6"
              >
                <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
                <span className="text-[#2563EB] text-sm font-medium">
                  Enterprise Client Onboarding Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-sora text-5xl md:text-6xl font-extrabold text-[#0A1628] leading-[1.1] tracking-tight"
              >
                Stop Losing Clients in the{" "}
                <span className="text-[#2563EB]">Onboarding Black Hole</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-[#475569] leading-relaxed max-w-lg"
              >
                Give professional clients a secure, white-labeled portal to sign
                contracts, upload documents, and complete onboarding — so you
                reclaim billable hours and start projects faster.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-white text-[#0A1628] px-6 py-3.5 rounded-xl font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <Play className="w-4 h-4" /> View Demo
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#64748B]"
              >
                {[
                  "No credit card required",
                  "14-day free trial",
                  "Cancel anytime",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#16A34A]" /> {t}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — UI mock with floating stat cards */}
            <motion.div
              className="flex-1 lg:max-w-[45%] hidden lg:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative mx-12 my-8">
                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                  {/* Browser chrome */}
                  <div className="bg-slate-100 px-4 py-3 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                    </div>
                    <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-[#94A3B8]">
                      portal.acmelawfirm.com
                    </div>
                  </div>

                  {/* Portal header */}
                  <div className="bg-[#0A1628] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded" />
                      <span className="font-sora text-white font-semibold text-sm">
                        Acme Law Firm
                      </span>
                    </div>
                    <span className="text-white/60 text-xs">
                      Welcome, James Whitmore
                    </span>
                  </div>

                  {/* Portal body */}
                  <div className="p-5 bg-[#F8FAFC]">
                    <h3 className="font-sora text-sm font-semibold text-[#0A1628] mb-4">
                      Your Onboarding Progress
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          label: "Sign Engagement Letter",
                          status: "Completed",
                          done: true,
                          active: false,
                          locked: false,
                          num: "",
                        },
                        {
                          label: "Upload Government ID",
                          status: "In Progress",
                          done: false,
                          active: true,
                          locked: false,
                          num: "2",
                        },
                        {
                          label: "Pay Retainer",
                          status: "Locked 🔒",
                          done: false,
                          active: false,
                          locked: true,
                          num: "3",
                        },
                        {
                          label: "Schedule Consultation",
                          status: "Locked 🔒",
                          done: false,
                          active: false,
                          locked: true,
                          num: "4",
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.done
                                ? "bg-[#16A34A]"
                                : item.active
                                  ? "bg-[#2563EB]"
                                  : "bg-[#CBD5E1]"
                            }`}
                          >
                            {item.done ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-white text-xs font-bold">
                                {item.num}
                              </span>
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${item.locked ? "text-[#94A3B8]" : "text-[#0A1628]"}`}
                            >
                              {item.label}
                            </p>
                            <p
                              className={`text-xs ${item.done ? "text-[#16A34A]" : item.active ? "text-[#2563EB]" : "text-[#94A3B8]"}`}
                            >
                              {item.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#64748B]">
                          2 of 4 steps complete
                        </span>
                        <span className="font-semibold text-[#0A1628]">
                          50%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#2563EB] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "50%" }}
                          transition={{
                            duration: 1.5,
                            delay: 1,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating card — top-right */}
                <motion.div
                  className="absolute -top-5 -right-8 bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.7, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                >
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0A1628]">
                      100% Complete
                    </p>
                    <p className="text-xs text-[#64748B]">Acme Law Firm</p>
                  </div>
                </motion.div>

                {/* Floating card — bottom-left */}
                <motion.div
                  className="absolute -bottom-5 -left-8 bg-[#0A1628] rounded-xl shadow-xl px-4 py-3"
                  initial={{ opacity: 0, scale: 0.7, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                >
                  <p className="font-sora text-white text-xl font-bold">
                    10hrs+
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    saved per client
                  </p>
                </motion.div>

                {/* Floating card — right-middle */}
                <motion.div
                  className="absolute top-1/2 -right-10 -translate-y-1/2 bg-[#2563EB] rounded-xl shadow-xl px-4 py-3"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                >
                  <p className="font-sora text-white text-xl font-bold">
                    1,200+
                  </p>
                  <p className="text-blue-100 text-xs mt-0.5">firms trust us</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Logo Strip ── */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-[#94A3B8] font-semibold uppercase tracking-widest mb-8">
            Trusted by professional service firms at
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="animate-marquee">
              {[...LOGOS, ...LOGOS].map((name, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 mx-10 text-[#CBD5E1] font-semibold text-sm whitespace-nowrap cursor-default hover:text-[#94A3B8] transition-colors"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section className="bg-[#0A1628] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { label: "Firms Trust Onboardly", end: 1200, suffix: "+" },
              { label: "Hours Saved Per Client", end: 10, suffix: "hrs+" },
              { label: "Client Completion Rate", end: 98, suffix: "%" },
            ].map((m, i) => (
              <motion.div
                key={i}
                className="py-10 md:py-0 md:px-12 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-sora text-5xl font-extrabold text-white">
                  <AnimatedCounter end={m.end} suffix={m.suffix} />
                </p>
                <p className="mt-2 text-slate-400 text-sm">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section id="case-studies" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <h2 className="font-sora text-4xl font-bold text-[#0A1628]">
              The Old Way vs. The Onboardly Way
            </h2>
            <p className="mt-4 text-[#475569] max-w-xl mx-auto">
              Trust is built in the details. When communication is clear and
              organized, clients notice — and so does your bottom line.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <motion.div
              className="bg-slate-50 border border-slate-200 rounded-2xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeLeft}
            >
              <span className="inline-flex items-center gap-2 bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <X className="w-3.5 h-3.5" /> The Old Way
              </span>
              <h3 className="font-sora text-2xl font-bold text-[#0A1628] mb-6">
                The Onboarding Black Hole
              </h3>
              <ul className="space-y-3 mb-6">
                {[
                  "Lost PDFs buried in email threads spanning weeks",
                  'Clients asking "What do I need to do next?" for the 5th time',
                  "Unsigned contracts sitting in spam folders",
                  "Billable hours wasted on administrative back-and-forth",
                  "Zero visibility into where each client is stuck",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-2">
                {[
                  "Chasing down missing signatures",
                  "Digging through old email threads",
                  "Resending lost attachments (again)",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="bg-white border-l-4 border-red-300 px-3 py-2 text-sm text-[#475569] rounded-r"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              className="bg-[#0A1628] rounded-2xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeRight}
            >
              <span className="inline-flex items-center gap-2 bg-green-400/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <Check className="w-3.5 h-3.5" /> The Onboardly Way
              </span>
              <h3 className="font-sora text-2xl font-bold text-white mb-6">
                A Professional Front Door
              </h3>
              <ul className="space-y-3 mb-6">
                {[
                  "All documents organized in one secure, branded portal",
                  "Real-time progress tracking with automated reminders",
                  "E-signature workflows that actually get completed",
                  "Reclaim 10+ hours per client onboarded",
                  "Live dashboard showing exactly who needs what",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                {[
                  "Contract Signed",
                  "Documents Uploaded",
                  "Payment Received",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="bg-white/5 px-3 py-2 text-sm text-white rounded-lg flex items-center justify-between"
                  >
                    {t}
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-[#F8FAFC] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <h2 className="font-sora text-4xl font-bold text-[#0A1628]">
              Set Up in Under 10 Minutes
            </h2>
            <p className="mt-4 text-[#475569] max-w-xl mx-auto">
              No technical expertise required. Professional results from day
              one.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-[#2563EB] hover:shadow-lg transition-all duration-300 group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.12 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sora text-5xl font-black text-[#E2E8F0] group-hover:text-[#DBEAFE] transition-colors">
                    {step.step}
                  </span>
                  <div className="w-11 h-11 bg-blue-50 group-hover:bg-[#2563EB] rounded-xl flex items-center justify-center transition-colors duration-300">
                    <step.icon className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="font-sora text-xl font-bold text-[#0A1628] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bento ── */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <h2 className="font-sora text-4xl font-bold text-[#0A1628]">
              Enterprise Features, Simple Pricing
            </h2>
            <p className="mt-4 text-[#475569] max-w-xl mx-auto">
              Built for professional service firms who demand security,
              flexibility, and white-glove branding.
            </p>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "E-Signature", value: "Built-in" },
              { label: "File Size Limit", value: "5GB / file" },
              { label: "Reminders", value: "Automated" },
              { label: "Audit Logs", value: "Full history" },
            ].map((stat, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-xl p-4 text-center bg-[#F8FAFC]"
              >
                <p className="text-xs text-[#94A3B8] mb-1">{stat.label}</p>
                <p className="font-sora font-bold text-[#0A1628] text-sm">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large dark tile */}
            <motion.div
              className="md:col-span-2 bg-[#0A1628] rounded-2xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeLeft}
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-sora text-2xl font-bold text-white mb-3">
                Secure Document Vault
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md">
                Industry-standard AES-256 encryption protects every file.
                Role-based access controls ensure only authorized users see
                sensitive documents. SOC 2 Type II compliant infrastructure.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "AES-256 Encryption",
                  "Role-Based Access",
                  "SOC 2 Type II",
                ].map((b) => (
                  <span
                    key={b}
                    className="bg-white/10 text-slate-300 text-xs px-3 py-1.5 rounded-full border border-white/10"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* White-label tile */}
            <motion.div
              className="bg-[#F8FAFC] rounded-2xl p-8 border border-slate-200 hover:border-[#2563EB] hover:shadow-lg transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeRight}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="font-sora text-lg font-bold text-[#0A1628] mb-2">
                Dynamic White-Labeling
              </h3>
              <p className="text-[#475569] text-sm leading-relaxed mb-5">
                Your brand, your rules. Upload logos, set colors, and customize
                every element. Clients never see our name — just yours.
              </p>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg" />
                <div className="w-8 h-8 bg-[#0A1628] rounded-lg" />
                <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg border border-slate-200" />
              </div>
            </motion.div>

            {/* 4 smaller tiles */}
            {SECONDARY_FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 hover:border-[#2563EB] hover:shadow-lg transition-all duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <h3 className="font-sora text-base font-bold text-[#0A1628] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-[#F8FAFC] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <h2 className="font-sora text-4xl font-bold text-[#0A1628]">
              What Firms Are Saying
            </h2>
            <p className="mt-4 text-[#475569]">
              Join 1,200+ professional service firms who&apos;ve transformed
              their onboarding experience.
            </p>
          </motion.div>

          {/* Featured testimonial */}
          <motion.div
            className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]"
                />
              ))}
            </div>
            <blockquote className="font-sora text-xl md:text-2xl font-medium text-[#0A1628] leading-relaxed mb-8 max-w-3xl">
              &ldquo;{TESTIMONIALS[0].quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center">
                <span className="font-sora text-white font-bold">
                  {TESTIMONIALS[0].initials}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#0A1628]">
                  {TESTIMONIALS[0].name}
                </p>
                <p className="text-[#64748B] text-sm">
                  {TESTIMONIALS[0].role}, {TESTIMONIALS[0].company}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3 smaller testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(1).map((t, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                    />
                  ))}
                </div>
                <blockquote className="text-[#475569] text-sm leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0A1628] rounded-full flex items-center justify-center">
                    <span className="font-sora text-white text-xs font-bold">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1628] text-sm">
                      {t.name}
                    </p>
                    <p className="text-[#94A3B8] text-xs">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <h2 className="font-sora text-4xl font-bold text-[#0A1628]">
              Transparent, Predictable Pricing
            </h2>
            <p className="mt-4 text-[#475569]">
              No hidden fees. No per-user charges. Simple monthly pricing based
              on your active client count.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-sm font-medium transition-colors ${!pricingYearly ? "text-[#0A1628]" : "text-[#94A3B8]"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setPricingYearly(!pricingYearly)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${pricingYearly ? "bg-[#2563EB]" : "bg-slate-200"}`}
              aria-label="Toggle billing period"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${pricingYearly ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
            <span
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${pricingYearly ? "text-[#0A1628]" : "text-[#94A3B8]"}`}
            >
              Yearly
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                Save 17%
              </span>
            </span>
          </div>

          {/* Plan cards */}
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={i}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlight
                    ? "bg-[#0A1628] shadow-2xl md:-mt-4 md:mb-4"
                    : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#2563EB] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3
                  className={`font-sora text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-[#0A1628]"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${plan.highlight ? "text-slate-400" : "text-[#64748B]"}`}
                >
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span
                    className={`font-sora text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-[#0A1628]"}`}
                  >
                    ₱
                    {(pricingYearly
                      ? plan.yearlyPrice
                      : plan.monthlyPrice
                    ).toLocaleString()}
                  </span>
                  <span
                    className={`text-sm ml-1 ${plan.highlight ? "text-slate-400" : "text-[#94A3B8]"}`}
                  >
                    /{pricingYearly ? "year" : "month"}
                  </span>
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`block w-full py-3 rounded-xl font-semibold text-center text-sm transition-colors mb-8 ${
                    plan.highlight
                      ? "bg-[#2563EB] text-white hover:bg-[#3B82F6]"
                      : "bg-[#0A1628] text-white hover:bg-[#1E293B]"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      {f.included ? (
                        <Check
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-green-400" : "text-[#16A34A]"}`}
                        />
                      ) : (
                        <X
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-slate-600" : "text-[#CBD5E1]"}`}
                        />
                      )}
                      <span
                        className={
                          f.included
                            ? plan.highlight
                              ? "text-slate-300"
                              : "text-[#475569]"
                            : plan.highlight
                              ? "text-slate-600"
                              : "text-[#94A3B8]"
                        }
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h3 className="font-sora text-xl font-bold text-[#0A1628] text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="divide-y divide-slate-100">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-4 flex items-center justify-between text-left group"
                  >
                    <span className="font-semibold text-[#0A1628] text-sm group-hover:text-[#2563EB] transition-colors">
                      {faq.q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pb-4"
                    >
                      <p className="text-sm text-[#475569] leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-[#0A1628] py-24 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="font-sora text-4xl md:text-5xl font-extrabold text-white leading-tight"
          >
            Stop Losing Clients in Email Threads.
            <br />
            <span className="text-[#60A5FA]">Start Onboarding Like a Pro.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto"
          >
            Join 1,200+ professional service firms who&apos;ve reclaimed their
            time, impressed their clients, and protected their margins with
            Onboardly.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#3B82F6] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Your Free 14-Day Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signup"
              className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              View Demo
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm"
          >
            {[
              "No credit card required",
              "Setup in under 10 minutes",
              "Cancel anytime, no questions asked",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#050D1A] py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-[#2563EB] rounded-md flex items-center justify-center">
                  <span className="font-sora text-white text-xs font-bold">
                    O
                  </span>
                </div>
                <span className="font-sora text-lg font-bold text-white">
                  Onboardly
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Professional client onboarding for modern service firms.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Link columns */}
            {[
              {
                title: "Product",
                links: [
                  "Features",
                  "Pricing",
                  "Security",
                  "Integrations",
                  "API Documentation",
                ],
              },
              {
                title: "Use Cases",
                links: [
                  "Law Firms",
                  "Creative Agencies",
                  "Financial Advisors",
                  "Consultants",
                  "Case Studies",
                ],
              },
              {
                title: "Company",
                links: ["About Us", "Blog", "Careers", "Contact", "Support"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-sora font-semibold text-white text-sm mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              &copy; 2025 Onboardly, Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-600">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="hover:text-slate-400 transition-colors"
                  >
                    {link}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
