type Card = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

const cards: Card[] = [
  {
    title: "Lenders & Finance",
    body: "Book calls with qualified borrowers and decision-makers.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 10l9-6 9 6v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V10z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "B2B SaaS & Software",
    body: "Fill your pipeline with target-account demos.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Agencies & Consultants",
    body: "Land retainer clients without referrals or ads.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2 20a7 7 0 0114 0" strokeLinecap="round" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M15 20a5 5 0 017-4.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function WhoItsFor() {
  return (
    <section className="relative border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-wider text-violet-400/80">
            Who it&apos;s for
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for high-ticket B2B
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/[0.04]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition-opacity duration-500 group-hover:bg-violet-500/20"
              />
              <div className="relative">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10 text-violet-300">
                  {c.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
