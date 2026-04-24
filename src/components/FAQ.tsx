const faqs = [
  {
    q: "Isn't cold email dead?",
    a: "Not when done right. Our infrastructure lands in the inbox, not spam — that's the entire job, and it's what most agencies get wrong.",
  },
  {
    q: "How long until I see results?",
    a: "Most clients have meetings booked within 14 days of launch. Campaigns ramp from there as we iterate on copy and targeting each week.",
  },
  {
    q: "Do I need a list?",
    a: "No. We can build one to your exact ICP from scratch, or use yours if you already have a clean one. Either way, list quality is on us.",
  },
  {
    q: "What if I've tried cold email before and it didn't work?",
    a: "That's the most common situation we fix. Usually it's infrastructure (domain reputation, sending setup) or offer-market fit — both of which we diagnose on the call.",
  },
];

export default function FAQ() {
  return (
    <section className="relative border-t border-white/5">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-wider text-violet-400/80">
            FAQ
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {faqs.map((f, i) => (
            <details key={i} className="group [&_summary::after]:transition-transform open:bg-white/[0.02]">
              <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left">
                <span className="text-[15px] font-medium text-white sm:text-base">
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition-colors group-open:border-violet-400/40 group-open:text-violet-300"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-45"
                  >
                    <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                  {f.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
