export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-2xl font-bold">Onboardly</span>
            </div>
          </div>

          <div className="space-y-6">
            <blockquote className="text-xl font-medium leading-relaxed">
              &quot;It is one thing to have good security, but it is another to
              make your clients actually feel safe. We built a login experience
              that feels like a warm welcome rather than a strict security
              checkpoint. Onboardly works quietly in the background to protect
              your data without ever slowing down your progress. Welcome to a
              workspace that values your time just as much as your image.&quot;
            </blockquote>
            <div>
              <p className="font-semibold">- Anchorly Team</p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-primary-foreground/60 text-sm">
            <div className="flex items-center gap-2"></div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
