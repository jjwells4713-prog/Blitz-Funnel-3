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

/** Capture UTMs from the current URL on first visit; returns the merged state.
 *
 * Reads from two sources, in priority order:
 *   1. Current URL search params
 *   2. The `bm_utm` cookie set by middleware (this is the rescue path —
 *      middleware captures UTMs at the edge before Vercel's apex→www
 *      redirect strips them from the URL).
 *
 * First-touch wins: if a UTM is already in sessionStorage, we don't overwrite it.
 */
export function captureUTMsFromURL(): LeadState {
  if (typeof window === "undefined") return {};
  const existing = loadLead();

  const utmKeys: (keyof UTMs)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  // Source 1: URL search params
  const params = new URLSearchParams(window.location.search);

  // Source 2: bm_utm cookie (middleware captures UTMs into this before redirects)
  const cookieUtms = readUtmCookie();

  const patch: Partial<LeadState> = {};
  for (const k of utmKeys) {
    const fromUrl = params.get(k) || undefined;
    const fromCookie = cookieUtms[k];
    const value = fromUrl || fromCookie;

    // Only set if present AND not already stored (first-touch attribution).
    if (value && !existing[k]) {
      patch[k] = value;
    }
  }

  if (!existing.landed_at) {
    patch.landed_at = new Date().toISOString();
    patch.referrer = document.referrer || undefined;
  }

  return Object.keys(patch).length ? updateLead(patch) : existing;
}

/** Read and parse the bm_utm cookie set by middleware. */
function readUtmCookie(): Partial<UTMs> {
  if (typeof document === "undefined") return {};
  try {
    const match = document.cookie.match(/(?:^|;\s*)bm_utm=([^;]+)/);
    if (!match) return {};
    const decoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(decoded);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}
