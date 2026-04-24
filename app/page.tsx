"use client"

import { useState } from 'react'
import Link from 'next/link'
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
  Play
} from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 - NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-extrabold text-[#0F172A]">
              Onboardly
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#475569] font-medium hover:text-[#2563EB] transition-colors">Features</a>
              <a href="#how-it-works" className="text-[#475569] font-medium hover:text-[#2563EB] transition-colors">How It Works</a>
              <a href="#pricing" className="text-[#475569] font-medium hover:text-[#2563EB] transition-colors">Pricing</a>
              <a href="#case-studies" className="text-[#475569] font-medium hover:text-[#2563EB] transition-colors">Case Studies</a>
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login" className="text-[#475569] font-medium hover:text-[#2563EB] transition-colors">
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#1D4ED8] transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-[#475569] font-medium hover:text-[#2563EB]">Features</a>
                <a href="#how-it-works" className="text-[#475569] font-medium hover:text-[#2563EB]">How It Works</a>
                <a href="#pricing" className="text-[#475569] font-medium hover:text-[#2563EB]">Pricing</a>
                <a href="#case-studies" className="text-[#475569] font-medium hover:text-[#2563EB]">Case Studies</a>
                <hr className="border-slate-100" />
                <Link href="/auth/login" className="text-[#475569] font-medium">Sign In</Link>
                <Link href="/auth/signup" className="bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold text-center">
                  Start Free Trial
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* SECTION 2 - HERO */}
      <section className="bg-[#F8FAFC] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              <span className="text-[#0F172A]">Stop Losing Clients in the</span>
              <br />
              <span className="text-[#2563EB]">Onboarding Black Hole</span>
            </h1>
            
            <p className="mt-6 text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Give professional clients a secure, white-labeled portal to sign contracts, upload documents, and complete onboarding — so you can reclaim billable hours and start projects faster.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/signup"
                className="bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-[#1D4ED8] transition-colors flex items-center gap-2"
              >
                Start Free Trial <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link 
                href="/auth/signup"
                className="bg-white text-[#0F172A] px-8 py-4 rounded-xl font-semibold text-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Book a Demo
              </Link>
            </div>
          </div>

          {/* Hero Visual - Browser Mockup */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="relative">
              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 z-10 bg-[#16A34A] text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                100% Complete
              </div>

              {/* Browser Window */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Browser Top Bar */}
                <div className="bg-slate-100 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-sm text-[#94A3B8]">
                    portal.acmelawfirm.com
                  </div>
                </div>

                {/* Portal Header */}
                <div className="bg-[#2563EB] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded"></div>
                    <span className="text-white font-semibold">Acme Law Firm</span>
                  </div>
                  <span className="text-white/90 text-sm">Welcome, James Whitmore</span>
                </div>

                {/* Portal Content */}
                <div className="p-6 bg-[#F8FAFC]">
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-6">Your Onboarding Progress</h3>
                  
                  {/* Stepper */}
                  <div className="space-y-4">
                    {/* Step 1 - Complete */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-[#0F172A]">Sign Engagement Letter</p>
                        <p className="text-sm text-[#16A34A]">Completed</p>
                      </div>
                    </div>

                    {/* Step 2 - In Progress */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">2</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-[#0F172A]">Upload Government ID</p>
                        <p className="text-sm text-[#2563EB]">In Progress</p>
                      </div>
                    </div>

                    {/* Step 3 - Locked */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#94A3B8] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">3</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-[#94A3B8]">Pay Retainer</p>
                        <p className="text-sm text-[#94A3B8]">Locked 🔒</p>
                      </div>
                    </div>

                    {/* Step 4 - Locked */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#94A3B8] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">4</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-[#94A3B8]">Schedule Consultation</p>
                        <p className="text-sm text-[#94A3B8]">Locked 🔒</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-8 bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#475569]">2 of 4 steps complete</span>
                      <span className="font-semibold text-[#0F172A]">50%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-[#2563EB] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - TRUST BAR */}
      <section className="bg-white border-y border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[#94A3B8] mb-6">Trusted by 1,200+ professional service firms</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[#94A3B8] font-medium">
            <span>Law Firms</span>
            <span className="text-slate-200">|</span>
            <span>Creative Agencies</span>
            <span className="text-slate-200">|</span>
            <span>Financial Advisors</span>
            <span className="text-slate-200">|</span>
            <span>Consultants</span>
          </div>
        </div>
      </section>

      {/* SECTION 4 - COMPARISON */}
      <section id="case-studies" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A]">The Old Way vs. The Onboardly Way</h2>
            <p className="mt-4 text-[#475569] max-w-xl mx-auto">
              Professional clients expect professionalism. Messy email threads and lost documents don&apos;t inspire confidence — or referrals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - The Old Way */}
            <div className="space-y-6">
              <span className="inline-block bg-[#FEE2E2] text-[#DC2626] text-sm font-semibold px-3 py-1 rounded-full">
                ✕ The Old Way
              </span>
              <h3 className="text-2xl font-bold text-[#0F172A]">The Onboarding Black Hole</h3>
              
              <ul className="space-y-3">
                {[
                  "Lost PDFs buried in email threads spanning weeks",
                  "Clients asking \"What do I need to do next?\" for the 5th time",
                  "Unsigned contracts sitting in spam folders",
                  "Billable hours wasted on administrative back-and-forth",
                  "Zero visibility into where each client is stuck"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569]">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4">
                <p className="text-sm font-semibold text-[#DC2626]">
                  Result: Frustrated clients, delayed project starts, and lost revenue.
                </p>
              </div>

              {/* Before Card */}
              <div className="bg-red-50/30 border border-red-200 rounded-xl p-4">
                <span className="inline-block bg-[#DC2626] text-white text-xs font-semibold px-2 py-1 rounded mb-4">Before</span>
                <div className="space-y-2">
                  {[
                    "Re: Re: Re: Need your signature",
                    "Fwd: Documents needed",
                    "Re: Can't find the contract",
                    "Re: Re: File too large to email"
                  ].map((email, i) => (
                    <div key={i} className="bg-white border-l-4 border-orange-400 px-3 py-2 text-sm text-[#475569] rounded-r">
                      {email}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - The Onboardly Way */}
            <div className="space-y-6">
              <span className="inline-block bg-[#DCFCE7] text-[#16A34A] text-sm font-semibold px-3 py-1 rounded-full">
                ✓ The Onboardly Way
              </span>
              <h3 className="text-2xl font-bold text-[#0F172A]">A Professional Front Door</h3>
              
              <ul className="space-y-3">
                {[
                  "All documents organized in one secure, branded portal",
                  "Real-time progress tracking with automated reminders",
                  "E-signature workflows that actually get completed",
                  "Reclaim 10+ hours per client onboarded",
                  "Live dashboard showing exactly who needs what"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569]">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-4">
                <p className="text-sm font-semibold text-[#16A34A]">
                  Result: Delighted clients, faster project starts, and protected margins.
                </p>
              </div>

              {/* After Card */}
              <div className="bg-green-50/30 border border-green-200 rounded-xl p-4">
                <span className="inline-block bg-[#16A34A] text-white text-xs font-semibold px-2 py-1 rounded mb-4">After</span>
                <div className="space-y-2">
                  {[
                    "Contract Signed",
                    "Documents Uploaded",
                    "Payment Received"
                  ].map((task, i) => (
                    <div key={i} className="bg-white px-3 py-2 text-sm text-[#0F172A] rounded flex items-center justify-between">
                      {task}
                      <Check className="w-5 h-5 text-[#16A34A]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#F8FAFC] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A]">How It Works (For Your Business)</h2>
            <p className="mt-4 text-[#475569]">
              Set up your first white-labeled onboarding portal in less than 10 minutes. No technical expertise required.
            </p>
          </div>

          {/* Step 01 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">01</span>
                </div>
                <Palette className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A]">Brand Your Portal</h3>
              <p className="text-[#475569]">
                Upload your logo and set brand colors via our CSS Variable Engine. The portal looks like your native website — clients think it&apos;s yours, not ours.
              </p>
              <ul className="space-y-2">
                {["Custom logo placement", "Hex color matching to your brand guidelines", "Instant preview before going live"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#475569]">
                    <Check className="w-4 h-4 text-[#2563EB]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#2563EB] rounded-lg"></div>
                <div>
                  <p className="font-semibold text-[#0F172A]">Your Logo</p>
                  <div className="h-2 w-24 bg-slate-200 rounded mt-1"></div>
                </div>
              </div>
              <p className="text-sm font-semibold text-[#0F172A] mb-3">Brand Colors</p>
              <div className="flex gap-3 mb-6">
                <div className="w-12 h-12 bg-[#2563EB] rounded-lg"></div>
                <div className="w-12 h-12 bg-[#0F172A] rounded-lg"></div>
                <div className="w-12 h-12 bg-[#E2E8F0] rounded-lg"></div>
              </div>
              <p className="text-sm font-semibold text-[#0F172A] mb-2">Hex Codes</p>
              <code className="text-sm bg-slate-100 px-3 py-1 rounded font-mono text-[#475569]">
                Primary: #2563EB
              </code>
            </div>
          </div>

          {/* Step 02 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1 bg-white rounded-2xl shadow-md p-6">
              <div className="space-y-3 mb-4">
                <div className="border-l-4 border-[#2563EB] bg-blue-50 px-4 py-3 rounded-r">
                  <p className="font-semibold text-[#0F172A]">Strict Mode</p>
                  <p className="text-sm text-[#475569]">Contract → Payment → Files</p>
                </div>
                <div className="text-center text-[#94A3B8] text-sm">or</div>
                <div className="border-l-4 border-[#16A34A] bg-green-50 px-4 py-3 rounded-r">
                  <p className="font-semibold text-[#0F172A]">Parallel Mode</p>
                  <p className="text-sm text-[#475569]">All tasks available at once</p>
                </div>
              </div>
              <p className="text-xs text-[#94A3B8] mb-2">Preview</p>
              <div className="space-y-2">
                <div className="bg-white border border-slate-200 px-3 py-2 rounded text-sm text-[#0F172A] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A]" /> Sign Contract
                </div>
                <div className="bg-slate-100 px-3 py-2 rounded text-sm text-[#94A3B8]">
                  🔒 Upload Files (locked)
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">02</span>
                </div>
                <GitBranch className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A]">Build the Workflow</h3>
              <p className="text-[#475569]">
                Use the Policy Engine to control the onboarding sequence. Choose Strict Mode to enforce contract signatures before file uploads, or Parallel Mode for flexible checklists.
              </p>
              <ul className="space-y-2">
                {["Strict Mode: Force sequential task completion", "Parallel Mode: Let clients complete tasks in any order", "Conditional logic for complex workflows"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#475569]">
                    <Check className="w-4 h-4 text-[#2563EB]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 03 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">03</span>
                </div>
                <Send className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A]">Invite &amp; Track</h3>
              <p className="text-[#475569]">
                Send a secure, branded link to your client. Watch the Tenant Dashboard to track real-time progress, identify bottlenecks, and send automated reminders.
              </p>
              <ul className="space-y-2">
                {["One-click secure portal links", "Live progress tracking for every client", "Automated nudges for stuck clients"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#475569]">
                    <Check className="w-4 h-4 text-[#2563EB]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="space-y-3">
                {[
                  { name: "Acme Law Firm", id: "#4829", percent: "100%", status: "Complete", color: "green" },
                  { name: "Smith Consulting", id: "#4830", percent: "67%", status: "In Progress", color: "amber" },
                  { name: "Creative Co.", id: "#4831", percent: "33%", status: "Reminder sent", color: "red" }
                ].map((client, i) => (
                  <div 
                    key={i} 
                    className={`px-4 py-3 rounded-lg flex items-center justify-between ${
                      client.color === 'green' ? 'bg-green-50' : 
                      client.color === 'amber' ? 'bg-amber-50' : 'bg-red-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-[#0F172A]">{client.name}</p>
                      <p className="text-xs text-[#94A3B8]">Client ID: {client.id}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        client.color === 'green' ? 'text-[#16A34A]' : 
                        client.color === 'amber' ? 'text-amber-600' : 'text-[#DC2626]'
                      }`}>{client.percent}</p>
                      <p className="text-xs text-[#94A3B8]">{client.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - ENTERPRISE FEATURES */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">Enterprise Features, Simple Pricing</h2>
            <p className="mt-4 text-[#475569]">
              Built for professional service firms who demand security, flexibility, and white-glove branding.
            </p>
          </div>

          {/* Stats Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: "E-Signature Integration", value: "Built-in" },
              { label: "File Size Limit", value: "5GB per file" },
              { label: "Automated Reminders", value: "Smart scheduling" },
              { label: "Audit Logs", value: "Complete history" }
            ].map((stat, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-sm text-[#94A3B8] mb-1">{stat.label}</p>
                <p className="font-bold text-[#0F172A]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Document Vault",
                description: "Industry-standard AES-256 encryption protects every file. Role-based access controls ensure only authorized users see sensitive documents. SOC 2 Type II compliant infrastructure.",
                bullets: ["AES-256 Encryption", "Role-Based Access", "SOC 2 Type II Certified"]
              },
              {
                icon: Palette,
                title: "Dynamic White-Labeling",
                description: "Your brand, your rules. Upload logos, set colors, and customize every element via our CSS Variable Engine. Clients never see our name — just yours.",
                bullets: ["Custom Branding", "CSS Variable Control", "Zero Onboardly Branding"]
              },
              {
                icon: Globe,
                title: "Custom Domain Orchestration",
                description: "Point portal.yourdomain.com to your Onboardly workspace. Enterprise clients get fully native URLs with SSL certificates provisioned automatically.",
                bullets: ["Custom Subdomains", "Auto SSL Provisioning", "Enterprise-Grade DNS"]
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#EFF6FF] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                <p className="text-[#475569] text-sm mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#475569]">
                      <Check className="w-4 h-4 text-[#2563EB]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 - PRICING */}
      <section id="pricing" className="bg-[#F8FAFC] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">Transparent, Predictable Pricing</h2>
            <p className="mt-4 text-[#475569]">
              No hidden fees. No per-user charges. Just simple monthly pricing based on your active client count.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Starter */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold text-[#0F172A]">Starter</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#0F172A]">$49</span>
                <span className="text-[#94A3B8]">/month</span>
              </div>
              <p className="text-sm text-[#475569] mt-2">Perfect for solo practitioners and small teams</p>
              <Link 
                href="/auth/signup"
                className="mt-6 block w-full bg-[#0F172A] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#1E293B] transition-colors"
              >
                Start Free Trial
              </Link>
              <ul className="mt-6 space-y-3">
                {[
                  { text: "Up to 5 active clients", included: true },
                  { text: "Basic white-labeling (logo + colors)", included: true },
                  { text: "Secure document vault (50GB storage)", included: true },
                  { text: "E-signature workflows", included: true },
                  { text: "Email support", included: true },
                  { text: "Standard templates", included: true },
                  { text: "No Strict Mode policy enforcement", included: false },
                  { text: "No custom domain", included: false }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {item.included ? (
                      <Check className="w-4 h-4 text-[#16A34A] mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-[#94A3B8] mt-0.5 flex-shrink-0" />
                    )}
                    <span className={item.included ? "text-[#475569]" : "text-[#94A3B8]"}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional - HIGHLIGHTED */}
            <div className="relative bg-white border-2 border-[#2563EB] rounded-xl p-6 shadow-xl hover:scale-105 transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#2563EB] text-white text-sm font-semibold px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Professional</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#0F172A]">$149</span>
                <span className="text-[#94A3B8]">/month</span>
              </div>
              <p className="text-sm text-[#475569] mt-2">For growing firms managing multiple clients</p>
              <Link 
                href="/auth/signup"
                className="mt-6 block w-full bg-[#2563EB] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#1D4ED8] transition-colors"
              >
                Start Free Trial
              </Link>
              <ul className="mt-6 space-y-3">
                {[
                  "Up to 25 active clients",
                  "Full white-labeling with CSS variables",
                  "Secure document vault (500GB storage)",
                  "E-signature workflows",
                  "Strict Mode policy enforcement",
                  "Parallel Mode flexible checklists",
                  "Automated client reminders",
                  "Priority email support",
                  "Custom workflow templates",
                  "Real-time analytics dashboard"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#16A34A] mt-0.5 flex-shrink-0" />
                    <span className="text-[#475569]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold text-[#0F172A]">Enterprise</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#0F172A]">$399</span>
                <span className="text-[#94A3B8]">/month</span>
              </div>
              <p className="text-sm text-[#475569] mt-2">For established firms demanding total control</p>
              <Link 
                href="/auth/signup"
                className="mt-6 block w-full bg-[#0F172A] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#1E293B] transition-colors"
              >
                Book Enterprise Demo
              </Link>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited active clients",
                  "Complete white-labeling + CSS engine",
                  "Secure document vault (unlimited storage)",
                  "E-signature workflows",
                  "Strict & Parallel Mode",
                  "Custom domain orchestration (portal.yourdomain.com)",
                  "Auto SSL certificate provisioning",
                  "Dedicated account manager",
                  "Custom integrations & API access",
                  "Advanced audit logs & compliance reports",
                  "SSO/SAML authentication",
                  "SLA guarantee (99.9% uptime)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#16A34A] mt-0.5 flex-shrink-0" />
                    <span className="text-[#475569]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-16 grid md:grid-cols-2 gap-4">
            {[
              { q: "What counts as an \"active client\"?", a: "A client with an open onboarding portal. Once they complete onboarding, they no longer count toward your limit." },
              { q: "Is there a setup fee?", a: "No setup fees, ever. All plans include onboarding assistance and template setup." },
              { q: "Can I upgrade or downgrade anytime?", a: "Yes. Changes take effect immediately, and we'll prorate the difference on your next invoice." },
              { q: "What's included in the free trial?", a: "14 days of full Professional plan access. No credit card required to start." }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-[#0F172A]">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-[#94A3B8]" /> : <ChevronDown className="w-5 h-5 text-[#94A3B8]" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-[#475569]">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 - FINAL CTA */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Stop Losing Clients in Email Threads.
            <br />
            Start Onboarding Like a Pro.
          </h2>
          <p className="mt-6 text-xl text-white/90">
            Join 1,200+ professional service firms who&apos;ve reclaimed their time, impressed their clients, and protected their margins with Onboardly.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/signup"
              className="bg-white text-[#2563EB] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-colors"
            >
              Start Your Free 14-Day Trial &rarr;
            </Link>
            <Link 
              href="/auth/signup"
              className="border border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Schedule a Demo
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-white text-sm">
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
              Setup in under 10 minutes
            </span>
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
              Cancel anytime, no questions asked
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 9 - FOOTER */}
      <footer className="bg-[#0F172A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-white">Onboardly</h3>
              <p className="mt-2 text-sm text-[#94A3B8]">
                Professional client onboarding for modern service firms.
              </p>
              <div className="mt-4 flex gap-3">
                {/* Twitter */}
                <a href="#" className="w-10 h-10 bg-[#334155] rounded-lg flex items-center justify-center hover:bg-[#475569] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-10 h-10 bg-[#334155] rounded-lg flex items-center justify-center hover:bg-[#475569] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                {/* Email */}
                <a href="#" className="w-10 h-10 bg-[#334155] rounded-lg flex items-center justify-center hover:bg-[#475569] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-[#94A3B8] hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-[#94A3B8] hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="font-semibold text-white mb-4">Use Cases</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Law Firms</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Creative Agencies</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Financial Advisors</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Consultants</a></li>
                <li><a href="#case-studies" className="text-[#94A3B8] hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-[#94A3B8] hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#334155] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#64748B]">&copy; 2025 Onboardly, Inc. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-[#64748B]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
