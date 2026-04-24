/* eslint-disable @next/next/no-img-element */

/**
 * Testimonials — real client quotes pulled from blitzmailer.ai.
 * Photos are currently hotlinked from the blitzmailer.ai Webflow CDN for
 * convenience. For production robustness you should download them into
 * /public/testimonials/ and update the `image` paths below so the site
 * doesn't depend on an external CDN.
 */

type Quote = {
  body: string;
  name: string;
  role: string;
  image: string;
};

const quotes: Quote[] = [
  {
    body:
      "Their top-tier email infrastructure has allowed us to significantly scale our outreach — we've been able to consistently book over 30 calls per day, making it both efficient and cost-effective.",
    name: "Fabian Kis",
    role: "Blitzmailer client",
    image:
      "https://cdn.prod.website-files.com/68a5e094e4d175cc24a21f2e/69337fe57d94249a5bc12006_image%20(7).webp",
  },
  {
    body:
      "I've used a lot of different providers and infrastructures in my time and I can say Blitzmailer is the easiest way to grow your cold email results. Nothing compares to the speed of setup, the scalability, and the support you get.",
    name: "Jack Zuvelek",
    role: "Blitzmailer client",
    image:
      "https://cdn.prod.website-files.com/68a5e094e4d175cc24a21f2e/69337fe57d94249a5bc12000_image%20(6).webp",
  },
  {
    body:
      "I would not be able to operate without Blitzmailer. I went from paying $5k/month using Google Workspace to $1.5k/month for double the volume. I also took my client's onboarding from 1 month to a week.",
    name: "Louis Garoz",
    role: "Blitzmailer client",
    image:
      "https://cdn.prod.website-files.com/68a5e094e4d175cc24a21f2e/69337fe57d94249a5bc11ff2_image%20(2).webp",
  },
];

export default function Testimonials() {
  return (
    <section className="relative border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-wider text-violet-400/80">
            Proof
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Operators who are done chasing leads
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <svg
                aria-hidden
                viewBox="0 0 32 24"
                className="h-5 w-6 text-violet-400/70"
                fill="currentColor"
              >
                <path d="M0 24V14.4C0 6.8 4.8 1.6 11.2 0l1.6 3.2C9.6 4.8 7.2 7.2 6.4 11.2H12v12.8H0zm20 0V14.4c0-7.6 4.8-12.8 11.2-14.4L32.8 3.2c-3.2 1.6-5.6 4-6.4 8H32v12.8H20z" />
              </svg>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-zinc-200">
                {q.body}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                <img
                  src={q.image}
                  alt={q.name}
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-medium text-white">{q.name}</div>
                  <div className="text-xs text-zinc-500">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
