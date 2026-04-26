"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { loadLead } from "@/lib/storage";

const GHL_BOOKING_URL =
  process.env.NEXT_PUBLIC_GHL_BOOKING_URL ||
  "https://api.leadconnectorhq.com/widget/bookings/blitz-mailer-strategy-call";

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
            <div className="mt-8 h-[850px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
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
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    const qName = searchParams.get("name") || "";
    const qEmail = searchParams.get("email") || "";
    const qPhone = searchParams.get("phone") || "";
    const saved = loadLead();

    const fullName = qName || saved.fullName || "";
    const email = qEmail || saved.email || "";
    const phone = qPhone || saved.phone || "";

    // Split full name into first/last for GHL prefill
    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(" ");

    const params = new URLSearchParams();
    if (firstName) params.set("first_name", firstName);
    if (lastName) params.set("last_name", lastName);
    if (email) params.set("email", email);
    if (phone) params.set("phone", phone);

    // Pass UTMs through so GHL stores them on the contact
    if (saved.utm_source) params.set("utm_source", saved.utm_source);
    if (saved.utm_medium) params.set("utm_medium", saved.utm_medium);
    if (saved.utm_campaign) params.set("utm_campaign", saved.utm_campaign);
    if (saved.utm_content) params.set("utm_content", saved.utm_content);
    if (saved.utm_term) params.set("utm_term", saved.utm_term);

    const qs = params.toString();
    setIframeSrc(qs ? `${GHL_BOOKING_URL}?${qs}` : GHL_BOOKING_URL);
  }, [searchParams]);

  // Redirect to /thanks when GHL fires its post-booking message event.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const origin = event.origin || "";
      if (!origin.includes("leadconnectorhq.com") && !origin.includes("msgsndr.com")) {
        return;
      }
      const data = event.data;
      const dataStr = typeof data === "string" ? data : JSON.stringify(data || {});
      if (
        dataStr.includes("appointment") ||
        dataStr.includes("booking") ||
        dataStr.includes("scheduled")
      ) {
        router.push("/thanks");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-glow">
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          title="Book a strategy call"
          style={{
            width: "100%",
            minWidth: "320px",
            height: "850px",
            border: "0",
            display: "block",
            background: "transparent",
          }}
        />
      ) : (
        <div className="h-[850px] animate-pulse bg-white/[0.02]" />
      )}
    </div>
  );
}
