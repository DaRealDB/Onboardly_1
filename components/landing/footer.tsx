export default function Footer() {
  return (
    <footer className="bg-[#050D1A] py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#2563EB] rounded-md flex items-center justify-center">
                <span className="font-sora text-white text-xs font-bold">
                  O
                </span>
              </div>
              <span className="font-sora text-lg font-bold text-white">
                Onboardly
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Professional client onboarding for modern service firms.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="/"
                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="/"
                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="/"
                className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>
          {[
            {
              title: "Product",
              links: [
                "Features",
                "Pricing",
                "Security",
                "Integrations",
                "API Documentation",
              ],
            },
            {
              title: "Use Cases",
              links: [
                "Law Firms",
                "Creative Agencies",
                "Financial Advisors",
                "Consultants",
                "Case Studies",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Blog", "Careers", "Contact", "Support"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-sora font-semibold text-white text-sm mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            &copy; 2025 Onboardly, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-600">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (link) => (
                <a
                  key={link}
                  href="/"
                  className="hover:text-slate-400 transition-colors"
                >
                  {link}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
