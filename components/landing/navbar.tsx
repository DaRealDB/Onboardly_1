"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  navHidden: boolean;
}

export default function Navbar({ navHidden }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Hard refresh handler for main logo
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = "/";
  };

  // Bulletproof smooth scroll handler
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    // If we are not on the home page, route to home page first, then append hash
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }

    // If we are on the home page, scroll smoothly
    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Adding a slight offset for the fixed navbar height (approx 80px)
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - 80;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else if (href === "#hero") {
        // Fallback: If #hero id is missing, just scroll to very top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={navHidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 bg-[#2563EB] rounded-md flex items-center justify-center">
              <span className="font-sora text-white text-xs font-bold">O</span>
            </div>
            <span className="font-sora text-lg font-bold text-[#0A1628]">
              Onboardly
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              ["Home", "#hero"],
              ["Case Studies", "#case-studies"],
              ["How It Works", "#how-it-works"],
              ["Features", "#features"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleSmoothScroll(e, href)}
                className="text-[#475569] text-sm font-medium hover:text-[#0A1628] transition-colors cursor-pointer"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-[#475569] text-sm font-medium hover:text-[#0A1628] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth/login"
              className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
            >
              Start Here
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#475569]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col gap-4">
              {[
                ["Home", "#hero"],
                ["Case Studies", "#case-studies"],
                ["How It Works", "#how-it-works"],
                ["Features", "#features"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => handleSmoothScroll(e, href)}
                  className="text-[#475569] font-medium hover:text-[#0A1628] cursor-pointer px-2"
                >
                  {label}
                </a>
              ))}
              <hr className="border-slate-100 my-2" />
              <div className="flex flex-col gap-3 px-2">
                <Link
                  href="/auth/login"
                  className="text-[#475569] font-medium text-center py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-[#2563EB] text-white px-4 py-2.5 rounded-lg font-semibold text-center"
                >
                  Start Free Trial
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}
