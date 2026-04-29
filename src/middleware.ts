import { NextRequest, NextResponse } from "next/server";

/**
 * UTM + ad param capture middleware.
 *
 * Runs at the edge on every request. If the URL contains UTM parameters
 * or Meta ad URL parameters (campaign_id, ad_id, etc.), we stuff them
 * into a cookie immediately — before any redirect (including the apex→www
 * redirect handled by Vercel) can strip them off.
 *
 * The client then reads from BOTH the URL search params AND this cookie
 * when capturing UTMs/ad params (URL takes precedence if both are set).
 *
 * First-touch attribution: we don't overwrite an existing cookie unless
 * the new request actually carries UTMs. This means if a user lands once
 * with UTMs, then revisits later organically, the original UTMs persist.
 */
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
// 30 days — long enough to attribute multi-session attribution
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const params = url.searchParams;

  // Build a tracking object from whatever's in the URL right now.
  const tracked: Record<string, string> = {};
  for (const key of TRACKED_KEYS) {
    const v = params.get(key);
    if (v) tracked[key] = v;
  }

  const res = NextResponse.next();

  // Only write the cookie if we found at least one tracked param in the URL.
  // (Don't clobber an existing cookie on every page load.)
  if (Object.keys(tracked).length > 0) {
    res.cookies.set({
      name: COOKIE_NAME,
      value: JSON.stringify(tracked),
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
      // Not httpOnly — client-side code needs to read this for the form payload.
      httpOnly: false,
      secure: true,
    });
  }

  return res;
}

// Run on every page request (skip Next.js internals + static assets).
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)",
  ],
};
