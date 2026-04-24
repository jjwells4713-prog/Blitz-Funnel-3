import CTAButton from "./CTAButton";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-radial-violet opacity-70"
      />
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:py-28">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Ready to see what your pipeline could look like in 30 days?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] text-zinc-400 sm:text-base">
          Book a 30-minute call. We&apos;ll audit your current outreach, map out
          a plan, and tell you straight if we&apos;re a fit.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <CTAButton href="/apply" size="lg">
            <>
              Book Your Free Strategy Call
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </>
          </CTAButton>
          <p className="text-xs text-zinc-500 sm:text-sm">
            No obligation · No pitch · Just a clear next step
          </p>
        </div>
      </div>
    </section>
  );
}
