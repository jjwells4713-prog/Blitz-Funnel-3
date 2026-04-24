const items = [
  {
    title: "A complete cold email system",
    body: "Built and running in under 7 days. Infrastructure, copy, lists, and sending — all done for you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 6h16v12H4z" strokeLinejoin="round" />
        <path d="M4 6l8 7 8-7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Ongoing campaign management",
    body: "Copywriting, reply handling, and weekly optimization — so the system keeps improving.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 12a9 9 0 019-9v3a6 6 0 00-6 6H3z" strokeLinejoin="round" />
        <path d="M21 12a9 9 0 01-9 9v-3a6 6 0 006-6h3z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Qualified meetings on your calendar",
    body: "Delivered straight to your booking link. You show up, they show up, you close.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Lead list sourcing",
    body: "Targeted lead lists built to your exact ICP — cleaned, validated, and ready to send. Or plug in your own.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function WhatYouGet() {
  return (
    <section className="relative border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-wider text-violet-400/80">
            What you get
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A full cold-email engine, handled end to end
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <div
              key={it.title}
              className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-violet-400/30"
            >
              <div className="flex-shrink-0">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10 text-violet-300">
                  {it.icon}
                </div>
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-white">
                  {it.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {it.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
