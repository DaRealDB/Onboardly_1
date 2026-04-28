"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function FinalCTA() {
  return (
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
          Join professional service firms who&apos;ve reclaimed their
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
  );
}
