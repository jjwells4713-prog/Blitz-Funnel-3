/**
 * Tracking helpers. Every function is safe to call on both server and client;
 * on the server (or when IDs aren't configured), they're no-ops.
 *
 * Standard Meta Pixel events used in this funnel:
 *   - PageView (fired by pixel script on every navigation)
 *   - ViewContent (VSL play)
 *   - InitiateCheckout (survey start)
 *   - AddToCart (contact form load)
 *   - Lead (booking complete)
 *
 * GA4 events mirror these with sensible names.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";

export const hasMeta = () => typeof window !== "undefined" && !!window.fbq && !!META_PIXEL_ID;
export const hasGA = () => typeof window !== "undefined" && !!window.gtag && !!GA4_ID;

export function fbqTrack(event: string, params?: Record<string, unknown>) {
  if (!hasMeta()) return;
  try {
    window.fbq!("track", event, params);
  } catch {
    /* noop */
  }
}

export function gaEvent(name: string, params?: Record<string, unknown>) {
  if (!hasGA()) return;
  try {
    window.gtag!("event", name, params || {});
  } catch {
    /* noop */
  }
}

// High-level funnel events — call these from pages/components.
export const track = {
  viewContentVSL: () => {
    fbqTrack("ViewContent", { content_name: "VSL" });
    gaEvent("vsl_play");
  },
  surveyStart: () => {
    fbqTrack("InitiateCheckout");
    gaEvent("survey_start");
  },
  contactFormView: () => {
    fbqTrack("AddToCart");
    gaEvent("contact_form_view");
  },
  lead: () => {
    fbqTrack("Lead");
    gaEvent("booking_complete");
  },
};
