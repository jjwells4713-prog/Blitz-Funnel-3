"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import CTAButton from "@/components/CTAButton";
import {
  loadLead,
  updateLead,
  captureUTMsFromURL,
  type Contact,
} from "@/lib/storage";
import { track } from "@/lib/tracking";

type Errors = Partial<Record<keyof Contact, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeWebsite(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidURL(s: string): boolean {
  try {
    const u = new URL(s);
    return !!u.hostname && u.hostname.includes(".");
  } catch {
    return false;
  }
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+\-\s()]/g, "").trim();
}

function isValidPhone(s: string): boolean {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState<Contact>({
    fullName: "",
    email: "",
    phone: "",
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    captureUTMsFromURL();
    const saved = loadLead();
    setForm({
      fullName: saved.fullName || "",
      email: saved.email || "",
      phone: saved.phone || "",
      website: saved.website || "",
    });
    track.contactFormView();
    setHydrated(true);
  }, []);

  const validate = (f: Contact): Errors => {
    const e: Errors = {};
    if (!f.fullName?.trim() || f.fullName.trim().length < 2) {
      e.fullName = "Please enter your full name.";
    }
    if (!f.email?.trim() || !EMAIL_RE.test(f.email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (!f.phone?.trim() || !isValidPhone(f.phone)) {
      e.phone = "Please enter a valid phone number.";
    }
    // Website is now OPTIONAL — only validate if user filled it in.
    if (f.website && f.website.trim()) {
      const normalized = normalizeWebsite(f.website);
      if (!isValidURL(normalized)) {
        e.website = "Please enter a valid website (e.g. example.com).";
      }
    }
    return e;
  };

  const onChange = (key: keyof Contact, v: string) => {
    setForm((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const cleaned: Contact = {
      fullName: form.fullName?.trim(),
      email: form.email?.trim().toLowerCase(),
      phone: normalizePhone(form.phone || ""),
      website: form.website?.trim() ? normalizeWebsite(form.website) : "",
    };

    const errs = validate(cleaned);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    setSubmitting(true);

    // Persist cleaned values.
    const fullState = updateLead(cleaned);

    // Fire-and-forget POST — but await briefly so we can detect outright failure.
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullState),
        keepalive: true,
      });
      if (!res.ok) {
        console.warn("[submit-lead] non-OK response", res.status);
      }
    } catch (err) {
      console.warn("[submit-lead] request failed", err);
    }

    // Redirect to booking step with prefill params.
    const params = new URLSearchParams({
      name: cleaned.fullName || "",
      email: cleaned.email || "",
    });
    router.push(`/book?${params.toString()}`);
  };

  return (
    <main className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-radial-violet opacity-60"
      />

      <div className="mx-auto max-w-xl px-5 pt-8">
        <div className="flex justify-center">
          <Logo size="sm" href="/" />
        </div>
      </div>

      <div className="mx-auto max-w-xl px-5 pb-20 pt-10">
        <div className="animate-fade-up">
          <p className="text-xs uppercase tracking-wider text-violet-400/80">
            Last step
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Where should we send your confirmation?
          </h1>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            We&apos;ll use this to confirm your call and send a calendar invite.
            Nothing else.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <Field
              label="Full Name"
              name="fullName"
              type="text"
              autoComplete="name"
              value={form.fullName || ""}
              onChange={(v) => onChange("fullName", v)}
              error={errors.fullName}
              placeholder="Jane Doe"
              disabled={!hydrated}
            />
            <Field
              label="Work Email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={form.email || ""}
              onChange={(v) => onChange("email", v)}
              error={errors.email}
              placeholder="jane@company.com"
              disabled={!hydrated}
            />
            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={form.phone || ""}
              onChange={(v) => onChange("phone", v)}
              error={errors.phone}
              placeholder="+1 555 123 4567"
              disabled={!hydrated}
            />
            <Field
              label="Company Website (optional)"
              name="website"
              type="text"
              autoComplete="url"
              inputMode="url"
              value={form.website || ""}
              onChange={(v) => onChange("website", v)}
              error={errors.website}
              placeholder="company.com"
              disabled={!hydrated}
            />

            <div className="pt-2">
              <CTAButton
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Spinner /> Submitting…
                  </>
                ) : (
                  <>
                    See Available Times
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </>
                )}
              </CTAButton>
              <p className="mt-3 text-center text-xs text-zinc-500">
                By submitting you agree to be contacted about your inquiry. No
                spam, ever.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  inputMode,
  disabled,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  disabled?: boolean;
}) {
  const id = `f_${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}_err` : undefined}
        className={[
          "block h-12 w-full rounded-xl border bg-white/[0.02] px-4 text-[15px] text-white placeholder:text-zinc-600",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink",
          error
            ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/40"
            : "border-white/10 focus:border-violet-400/60 focus:ring-violet-400/40",
          disabled ? "opacity-60" : "",
        ].join(" ")}
      />
      {error ? (
        <p id={`${id}_err`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
      />
    </svg>
  );
}
