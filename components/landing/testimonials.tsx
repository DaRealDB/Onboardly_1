"use client";

import { motion, Variants } from "framer-motion";
import { TESTIMONIALS } from "./data";
import { Star } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Testimonials() {
  return (
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
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
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
  );
}
