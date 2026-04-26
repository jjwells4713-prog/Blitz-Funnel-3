import { NextResponse } from "next/server";

// Runs on the Node.js runtime (default). The webhook URL is server-only and
// never shipped to the browser.
export const runtime = "nodejs";

// Keep this route out of any static/prerender paths.
export const dynamic = "force-dynamic";

type LeadPayload = {
  // Contact
  fullName?: string;
  email?: string;
  phone?: string;
  website?: string;
  // Survey
  q1_industry?: string;
  q2_revenue?: string;
  q3_current_channel?: string;
  q4_timeline?: string;
  q5_bottleneck?: string;
  // UTMs (first-touch)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  // Meta
  landed_at?: string;
  referrer?: string;
};

export async function POST(req: Request) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[submit-lead] GHL_WEBHOOK_URL is not set");
    return NextResponse.json(
      { ok: false, error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Light server-side validation — don't block on soft failures, but refuse
  // totally empty submissions so we don't pollute GHL with junk.
  if (!body.email && !body.phone && !body.fullName) {
    return NextResponse.json(
      { ok: false, error: "Missing contact info" },
      { status: 400 }
    );
  }

  // Pull a few useful request-level bits. GHL can use these for dedupe or IP geo.
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0]?.trim() || "";
  const userAgent = req.headers.get("user-agent") || "";

  const payload = {
    // Contact fields
    full_name: body.fullName,
    email: body.email,
    phone: body.phone,
    website: body.website,
    // Survey answers (flat, snake_case — map these in GHL to custom fields)
    q1_industry: body.q1_industry,
    q2_revenue: body.q2_revenue,
    q3_current_channel: body.q3_current_channel,
    q4_timeline: body.q4_timeline,
    q5_bottleneck: body.q5_bottleneck,
    // Attribution
    utm_source: body.utm_source,
    utm_medium: body.utm_medium,
    utm_campaign: body.utm_campaign,
    utm_content: body.utm_content,
    utm_term: body.utm_term,
    // Meta
    landed_at: body.landed_at,
    submitted_at: new Date().toISOString(),
    referrer: body.referrer,
    ip,
    user_agent: userAgent,
    // Source tag so you can filter in GHL smart lists.
    source: "blitzmailer_funnel",
  };

  console.log("[submit-lead] received body:", JSON.stringify(body));
  console.log("[submit-lead] sending payload:", JSON.stringify(payload));

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Guard against hanging webhooks. GHL is usually <1s; be generous.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[submit-lead] GHL non-OK", res.status, text);
      return NextResponse.json(
        { ok: false, error: `Webhook returned ${res.status}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit-lead] fetch failed", err);
    return NextResponse.json(
      { ok: false, error: "Webhook request failed" },
      { status: 502 }
    );
  }
}
