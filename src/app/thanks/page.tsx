"use client";

import { useEffect } from "react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { clearLead } from "@/lib/storage";
import { track } from "@/lib/tracking";

export default function ThanksPage() {
  useEffect(() => {
    track.lead();
    // Clear funnel state so a repeat visit in the same tab starts fresh.
    clearLead();
  }, []);

  return (
    <main className="relative flex min-h-dvh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-radial-violet opacity-70"
      />

      <div className="mx-auto w-full max-w-xl px-5 pt-8">
        <div className="flex justify-center">
          <Logo size="sm" href="/" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 pb-16 pt-10">
        <div className="animate-fade-up text-center">
          {/* Check badge */}
          <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-full border border-violet-400/40 bg-violet-500/10 text-violet-300 shadow-glow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                d="M5 12.5L10 17.5L19 7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            You&apos;re booked.
            <br className="hidden sm:block" /> See you soon.
          </h1>
          <p className="mt-4 text-[15px] text-zinc-400 sm:text-base">
            Check your email for the calendar invite. If you don&apos;t see it
            in a few minutes, check spam.
          </p>
        </div>

        <div className="animate-fade-up mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-xs uppercase tracking-wider text-violet-400/80">
            What to expect
          </p>
          <ul className="mt-4 space-y-4">
            {[
              "A 30-minute call with one of our strategists",
              "We'll audit your current outreach (if any) and map out a plan",
              "No pressure, no pitch — just a clear next step",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-violet-400/40 bg-violet-500/10 text-violet-300"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3 w-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-[15px] leading-relaxed text-zinc-300">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </main>
  );
}
