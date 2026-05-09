"use client";

import { motion, Variants } from "framer-motion";
import { X, Check } from "lucide-react";

// Animations
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Comparison() {
  return (
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
            A seamless onboarding experience sets the tone from day one. When
            the transition from candidate to active employee is clear, your new
            hires thrive — and your HR team reclaims hours of administrative
            work.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="bg-[#0A1628] rounded-2xl p-8 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeLeft}
          >
            <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <X className="w-3.5 h-3.5" /> The Old Way
            </span>
            <h3 className="font-sora text-2xl font-bold text-white mb-6">
              The HR Black Hole
            </h3>
            <ul className="space-y-3 mb-6">
              {[
                "Lost compliance PDFs buried in email threads spanning weeks",
                'Candidates asking "What do I need to do next?" for the 5th time',
                "Unsigned offer letters sitting in spam folders",
                "HR hours wasted on administrative back-and-forth",
                "Zero visibility into where each candidate is stuck in the pipeline",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              {[
                "Chasing down missing ID uploads",
                "Manually tracking compliance documents",
                "Resending lost blank forms (again)",
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white/5 border-l-4 border-red-400 px-3 py-2 text-sm text-slate-300 rounded-r"
                >
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeRight}
          >
            <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Check className="w-3.5 h-3.5" /> The Onboardly Way
            </span>
            <h3 className="font-sora text-2xl font-bold text-[#0A1628] mb-6">
              A White-Labeled Welcome
            </h3>
            <ul className="space-y-3 mb-6">
              {[
                "All documents organized in one secure, company-branded portal",
                "Dynamic onboarding tracks tailored to specific roles",
                "E-signature workflows that actually get completed",
                "Seamless transition from 'To-Be-Hired' to active roster",
                "Live dashboard showing exactly where each hire stands",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#475569] text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
              {[
                "Offer Letter Signed",
                "Compliance Docs Verified",
                "Added to Employee Roster",
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white border border-blue-100/50 shadow-sm px-3 py-2 text-sm text-[#0A1628] rounded-lg flex items-center justify-between"
                >
                  {t}
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
