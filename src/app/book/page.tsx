"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import Logo from "@/components/Logo";
import { loadLead } from "@/lib/storage";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/jackson-blitzmailer-syp_/blitz-mailer-strategy-call";

export default function BookPage() {
  return (
    <main className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px] bg-radial-violet opacity-60"
      />

      <div className="mx-auto max-w-3xl px-5 pt-8">
        <div className="flex justify-center">
          <Logo size="sm" href="/" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-10">
        <div className="animate-fade-up text-center">
          <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Pick a time that works for you.
          </h1>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            We&apos;ll see you then.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mt-8 h-[700px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
          }
        >
          <BookEmbed />
        </Suspense>

        <p className="mt-6 text-center text-xs text-zinc-500 sm:text-sm">
          30-minute call · No obligation · Usually booked within 48 hours
        </p>
      </div>
    </main>
  );
}

function BookEmbed() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [prefill, setPrefill] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const qName = searchParams.get("name") || "";
    const qEmail = searchParams.get("email") || "";
    const saved = loadLead();
    setPrefill({
      name: qName || saved.fullName || "",
      email: qEmail || saved.email || "",
    });
  }, [searchParams]);

  // Redirect to /thanks when Calendly fires event_scheduled.
  useCalendlyEventListener({
    onEventScheduled: () => {
      router.push("/thanks");
    },
  });

  // Pass UTMs to Calendly so they land in the scheduling payload (and downstream in GHL).
  const utm = useMemo(() => {
    if (typeof window === "undefined") return {};
    const saved = loadLead();
    return {
      utmSource: saved.utm_source,
      utmMedium: saved.utm_medium,
      utmCampaign: saved.utm_campaign,
      utmContent: saved.utm_content,
      utmTerm: saved.utm_term,
    };
  }, []);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-glow">
      {prefill ? (
        <InlineWidget
          url={CALENDLY_URL}
          prefill={{
            name: prefill.name,
            email: prefill.email,
          }}
          utm={utm}
          styles={{ height: "700px", minWidth: "320px" }}
          pageSettings={{
            backgroundColor: "0A0A0F",
            primaryColor: "7C3AED",
            textColor: "FFFFFF",
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
            hideGdprBanner: true,
          }}
        />
      ) : (
        <div className="h-[700px] animate-pulse bg-white/[0.02]" />
      )}
    </div>
  );
}
