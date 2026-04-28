// Static data for landing page components

export const LOGOS = [
  "Apex Legal Group",
  "Summit Financial",
  "Meridian Consulting",
  "Sterling Creative",
  "Atlas Advisory",
  "Fortis Law Partners",
  "Nova Strategy",
  "Pinnacle Group",
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "Palette",
    title: "Brand Your Portal",
    description:
      "Upload your logo, set brand colors, and create a portal that feels like it was built by your firm — not a SaaS vendor. Live preview before going live.",
  },
  {
    step: "02",
    icon: "GitBranch",
    title: "Build the Workflow",
    description:
      "Use the Policy Engine to design your sequence. Enforce strict order or allow flexible parallel completion — your call, your clients.",
  },
  {
    step: "03",
    icon: "Send",
    title: "Invite & Track Live",
    description:
      "Send a secure branded link and watch real-time progress on your dashboard. Automated reminders chase down stuck clients so you don't have to.",
  },
];

export const SECONDARY_FEATURES = [
  {
    icon: "GitBranch",
    title: "Policy Engine",
    desc: "Strict Mode or Parallel Mode. Control exactly how clients progress through onboarding.",
  },
  {
    icon: "Bell",
    title: "Automated Reminders",
    desc: "Smart scheduling nudges stuck clients. No more chasing.",
  },
  {
    icon: "Globe",
    title: "Custom Domains",
    desc: "portal.yourdomain.com with auto-provisioned SSL. Fully native enterprise URLs.",
  },
  {
    icon: "BarChart3",
    title: "Real-Time Analytics",
    desc: "Live pipeline dashboard. Know exactly where every client stands at all times.",
  },
];

export const TESTIMONIALS = [
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

export const PRICING_PLANS = [
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

export const FAQS = [
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
