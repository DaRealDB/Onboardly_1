"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

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
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
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
  }, [triggered, mounted]);

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
      {mounted ? count.toLocaleString() : end.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Metrics() {
  return (
    <section className="bg-[#0A1628] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {[
            { label: "Hours Saved Per Client", end: 10, suffix: "hrs+" },
            { label: "Client Completion Rate", end: 93, suffix: "%" },
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
  );
}
