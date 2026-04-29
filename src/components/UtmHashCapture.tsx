"use client";

import { useEffect } from "react";

const TRACKED_KEYS = [
  // UTMs
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  // Meta ad URL parameters
  "campaign_id",
  "ad_id",
  "ad_name",
  "campaign_name",
  "adset_id",
  "adset_name",
] as const;

const COOKIE_NAME = "bm_utm";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Captures UTM and ad URL parameters from the URL fragment
 * (e.g. blitzmailer.site/#utm_source=meta&campaign_id=123)
 * on first page load. URL fragments survive Vercel's apex redirect because they're
 * never sent to the server — they live entirely in the browser.
 *
 * After capture, this component:
 *   1. Writes tracked params to the bm_utm cookie (read by storage.ts on contact submit)
 *   2. Promotes them from #fragment to ?query so existing code paths see them
 *   3. Cleans up the URL so users see a clean address bar
 */
export default function UtmHashCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    // Strip leading "#" and parse like a query string
    const fragmentParams = new URLSearchParams(hash.slice(1));
    const tracked: Record<string, string> = {};
    for (const key of TRACKED_KEYS) {
      const v = fragmentParams.get(key);
      if (v) tracked[key] = v;
    }

    if (Object.keys(tracked).length === 0) return;

    // 1. Write the cookie (first-touch — only if no cookie exists yet)
    const existing = document.cookie
      .split("; ")
      .find((c) => c.startsWith(COOKIE_NAME + "="));
    if (!existing) {
      const value = encodeURIComponent(JSON.stringify(tracked));
      document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
    }

    // 2. Promote fragment → query string in the URL so anything reading
    //    location.search downstream sees them, AND clean up the address bar
    const url = new URL(window.location.href);
    for (const [k, v] of Object.entries(tracked)) {
      url.searchParams.set(k, v);
    }
    url.hash = "";
    window.history.replaceState(null, "", url.toString());
  }, []);

  return null;
}
