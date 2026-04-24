/**
 * Lead state persisted across the funnel via sessionStorage.
 * Cleared on browser tab close (not on refresh) — which is the right TTL
 * for a single-session funnel.
 */

const KEY = "blitzmailer_lead_v1";

export type SurveyAnswers = {
  q1_industry?: string;
  q2_revenue?: string;
  q3_current_channel?: string;
  q4_timeline?: string;
  q5_bottleneck?: string;
};

export type UTMs = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type Contact = {
  fullName?: string;
  email?: string;
  phone?: string;
  website?: string;
};

export type LeadState = SurveyAnswers &
  UTMs &
  Contact & {
    landed_at?: string; // ISO timestamp of first landing
    referrer?: string;
  };

export function loadLead(): LeadState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as LeadState;
  } catch {
    return {};
  }
}

export function saveLead(state: LeadState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function updateLead(patch: Partial<LeadState>): LeadState {
  const next = { ...loadLead(), ...patch };
  saveLead(next);
  return next;
}

export function clearLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

/** Capture UTMs from the current URL on first visit; returns the merged state. */
export function captureUTMsFromURL(): LeadState {
  if (typeof window === "undefined") return {};
  const existing = loadLead();

  const params = new URLSearchParams(window.location.search);
  const utmKeys: (keyof UTMs)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  const patch: Partial<LeadState> = {};
  for (const k of utmKeys) {
    const v = params.get(k);
    // Only set if present in URL AND not already stored (first-touch attribution).
    if (v && !existing[k]) {
      patch[k] = v;
    }
  }

  if (!existing.landed_at) {
    patch.landed_at = new Date().toISOString();
    patch.referrer = document.referrer || undefined;
  }

  return Object.keys(patch).length ? updateLead(patch) : existing;
}
