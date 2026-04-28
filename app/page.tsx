"use client";

import { useState, useEffect } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";

// Component imports
import Navbar from "../components/landing/navbar";
import Hero from "../components/landing/hero";
import Metrics from "../components/landing/metrics";
import Comparison from "../components/landing/comparison";
import Features from "../components/landing/features";
import FinalCTA from "../components/landing/final-cta";
import Footer from "../components/landing/footer";

export default function LandingPage() {
  const [navHidden, setNavHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setNavHidden(true);
    } else {
      setNavHidden(false);
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    setScrollProgress(latest);
  });

  // Smooth scroll behavior
  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener("click", handleSmoothScroll);
    });

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Fonts & Global Styles ── */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-sora { font-family: 'Sora', sans-serif; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
          align-items: center;
          width: max-content;
        }
        .animate-marquee:hover { animation-play-state: paused; }
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* ── Components ── */}
      <Navbar navHidden={navHidden} />
      <Hero />
      <Metrics />
      <Comparison />
      <Features />
      <FinalCTA />
      <Footer />
    </div>
  );
}
