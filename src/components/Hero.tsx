import CTAButton from "./CTAButton";
import VSL from "./VSL";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px] bg-radial-violet"
      />
      {/* Grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_40%,transparent_80%)] opacity-60"
      />

      <div className="mx-auto max-w-5xl px-5 pb-12 pt-20 sm:pb-16 sm:pt-28 md:pt-32">
        {/* Eyebrow */}
        <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
          </span>
          Now booking new B2B clients
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-balance text-center text-[34px] font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
          Get{" "}
          <span className="bg-gradient-to-br from-violet-300 via-violet-400 to-violet-600 bg-clip-text text-transparent">
            30–60 qualified sales calls
          </span>{" "}
          booked on your calendar every month — using our spam-proof cold email infrastructure
        </h1>

        {/* VSL embed sits directly under the headline */}
        <div className="mx-auto mt-10 max-w-3xl">
          <VSL />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-balance text-center text-[15px] leading-relaxed text-zinc-400 sm:text-base md:text-lg">
          We build, manage, and optimize the entire cold email system for B2B
          companies selling high-ticket services. You focus on closing. We
          handle everything else.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <CTAButton href="/apply" size="lg" />
          <p className="text-xs text-zinc-500 sm:text-sm">
            No obligation · 30-minute call · Usually booked within 48 hours
          </p>
        </div>

        {/* Trust strip */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur sm:grid-cols-3 sm:gap-2 sm:p-6">
          <TrustStat value="100+" label="B2B companies served" />
          <TrustStat value="1M+" label="Emails delivered daily" />
          <TrustStat value="500+" label="Mailboxes in rotation" />
        </div>
      </div>
    </section>
  );
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-2xl font-semibold tabular-nums text-transparent sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-[13px] text-zinc-500">{label}</div>
    </div>
  );
}
