"use client";

import { motion, Variants } from "framer-motion";
import { X, Check } from "lucide-react";

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
  );
}
