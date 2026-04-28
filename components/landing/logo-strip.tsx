import { LOGOS } from "./data";

export default function LogoStrip() {
  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-[#94A3B8] font-semibold uppercase tracking-widest mb-8">
          Trusted by professional service firms at
        </p>
        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee">
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <span
                key={i}
                className="flex-shrink-0 mx-10 text-[#CBD5E1] font-semibold text-sm whitespace-nowrap cursor-default hover:text-[#94A3B8] transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
