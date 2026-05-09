"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Play, Check } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
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
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6 hover:bg-blue-100 transition-colors duration-300"
            >
              <motion.span
                className="w-2 h-2 bg-[#2563EB] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-[#2563EB] text-sm font-medium">
                Enterprise Hiring Onboarding Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-sora text-5xl md:text-6xl font-extrabold text-[#0A1628] leading-[1.1] tracking-tight"
            >
              Stop tracking paperwork.{" "}
              <span className="text-[#2563EB]">Start building your team.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-[#475569] leading-relaxed max-w-lg"
            >
              Streamline your entire hiring pipeline. Automate compliance
              tracking, instantly verify documents, and guide candidates
              seamlessly from 'to-be-hired' straight into your active roster.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8] hover:shadow-lg transition-all duration-200"
                >
                  Start Now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
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
                        label: "Sign Employment Contract",
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
                        label: "Set Up Direct Deposit",
                        status: "Locked 🔒",
                        done: false,
                        active: false,
                        locked: true,
                        num: "3",
                      },
                      {
                        label: "Select Benefits Package",
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
                      <span className="font-semibold text-[#0A1628]">50%</span>
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
                <p className="font-sora text-white text-xl font-bold">10hrs+</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  saved per client
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
