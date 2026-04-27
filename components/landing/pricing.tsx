"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { PRICING_PLANS, FAQS } from "./data";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingYearly, setPricingYearly] = useState(false);

  return (
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
              className={`relative rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                plan.highlight
                  ? "bg-[#0A1628] shadow-2xl md:-mt-4 md:mb-4"
                  : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl"
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 },
                ...(plan.highlight ? {} : { boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" })
              }}
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
  );
}
