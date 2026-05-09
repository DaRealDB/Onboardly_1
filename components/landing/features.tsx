"use client";

// Imports
import { motion, Variants } from "framer-motion";
import {
  Shield,
  Palette,
  GitMerge,
  Send,
  Bell,
  Globe,
  LineChart,
} from "lucide-react";

// Data
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Brand Your Workspace",
    description:
      "Upload your company logo and define your primary colors. The system instantly generates a dedicated subdomain with your Native Brand Feel.",
    icon: Palette,
  },
  {
    step: "02",
    title: "Build Onboarding Tracks",
    description:
      "Use the Workflow Engine to create role-specific templates. Enforce sequential steps with Strict Mode or flexible checklists with Parallel Mode.",
    icon: GitMerge,
  },
  {
    step: "03",
    title: "Invite & Track Live",
    description:
      "Set a candidate to 'To Be Hired' to provision their portal. Watch their progress in real-time on your Pipeline analytics dashboard.",
    icon: Send,
  },
];

const SECONDARY_FEATURES = [
  {
    title: "Workflow Engine",
    desc: "Design macro-templates for full onboarding tracks or micro-snippets for one-off document requests.",
    icon: GitMerge,
  },
  {
    title: "Live Notifications",
    desc: "Real-time alerts in your notification center when a candidate submits a document or finishes a track.",
    icon: Bell,
  },
  {
    title: "Custom Subdomains",
    desc: "Dedicated workspaces (e.g., company.onboardly.com) automatically provisioned upon tenant sign-up.",
    icon: Globe,
  },
  {
    title: "Pipeline Analytics",
    desc: "Monitor your Total Active Hires and completion rates to identify bottlenecks in the HR process.",
    icon: LineChart,
  },
];

// Animations
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Main Component
export default function Features() {
  return (
    <>
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
              Automate Hiring in Under 10 Minutes
            </h2>
            <p className="mt-4 text-[#475569] max-w-xl mx-auto">
              Transition candidates from pending to active employees seamlessly.
              Professional HR results from day one.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-sora text-5xl font-black text-[#E2E8F0] group-hover:text-[#DBEAFE] transition-colors">
                      {step.step}
                    </span>
                    <div className="w-11 h-11 bg-blue-50 group-hover:bg-[#2563EB] rounded-xl flex items-center justify-center transition-colors duration-300">
                      <IconComponent className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="font-sora text-xl font-bold text-[#0A1628] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

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
              Enterprise HR Features, Simple Setup
            </h2>
            <p className="mt-4 text-[#475569] max-w-xl mx-auto">
              Built for back-office teams who demand compliance, flexibility,
              and a premium front-facing experience for candidates.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Digital Signatures", value: "Verified" },
              { label: "Data Architecture", value: "Multi-Tenant" },
              { label: "Candidate Status", value: "Real-Time Tracking" },
              { label: "Access Control", value: "Role-Based" },
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Global Document Vault
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md">
                A centralized repository for reviewing all uploaded company
                documentation. Sort by pending or verified statuses, download
                raw files, and manage historical employee records with
                enterprise-grade security.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Verified Signatures",
                  "Role-Based Access",
                  "Encrypted PDFs",
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
                CSS Variable Engine
              </h3>
              <p className="text-[#475569] text-sm leading-relaxed mb-5">
                Maintain visual isolation. Candidates engage with your custom
                primary colors and logos, ensuring a premium, fully
                white-labeled experience.
              </p>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg" />
                <div className="w-8 h-8 bg-[#0A1628] rounded-lg" />
                <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg border border-slate-200" />
              </div>
            </motion.div>

            {SECONDARY_FEATURES.map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={i}
                  className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 hover:border-[#2563EB] hover:shadow-xl transition-all duration-300 cursor-pointer"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-sora text-base font-bold text-[#0A1628] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
