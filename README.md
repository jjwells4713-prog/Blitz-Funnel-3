# Blitzmailer Funnel

A paid-social landing funnel for [Blitzmailer](https://blitzmailer.ai) — built in Next.js 14 (App Router) + TypeScript + Tailwind, deployed on Vercel.

**Flow:** `/` (VSL + proof) → `/apply` (5-step survey) → `/apply/contact` (contact form) → `/book` (Calendly) → `/thanks` (conversion fire).

---

## Quick start

```bash
# 1. Install deps
npm install

# 2. Copy env template and fill in values (see "Environment variables" below)
cp .env.local.example .env.local

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Requires Node 20+.**

---

## Environment variables

Copy `.env.local.example` → `.env.local` and fill in:

| Variable                      | Type         | Purpose                                                                  |
| ----------------------------- | ------------ | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_META_PIXEL_ID`   | public       | Meta Pixel ID. Leave blank to disable. Add before launch.                |
| `NEXT_PUBLIC_GA4_ID`          | public       | GA4 measurement ID (e.g. `G-XXXXXXX`). Leave blank to disable.           |
| `NEXT_PUBLIC_CALENDLY_URL`    | public       | Calendly event URL. Already set in the template.                         |
| `GHL_WEBHOOK_URL`             | **server**   | GHL inbound webhook. **Never** prefix with `NEXT_PUBLIC_`.               |

Pixel/GA4 scripts only load when the corresponding ID is present, so it's safe to deploy with them blank during build-out.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              Root layout: fonts, pixel scripts, metadata
│   ├── page.tsx                Landing page (hero, VSL, sections)
│   ├── apply/
│   │   ├── page.tsx            5-step survey (one question per screen)
│   │   └── contact/page.tsx    Contact form → POSTs to /api/submit-lead
│   ├── book/page.tsx           Calendly inline widget (react-calendly)
│   ├── thanks/page.tsx         Confirmation + conversion pixel fire
│   └── api/submit-lead/
│       └── route.ts            Server route that forwards lead to GHL
├── components/                 Hero, VSL, FAQ, CTAButton, SurveyStep, etc.
├── lib/
│   ├── tracking.ts             Pixel/GA4 event helpers (safe no-ops)
│   └── storage.ts              sessionStorage lead state + UTM capture
├── types/globals.d.ts          Wistia custom element + window globals
└── styles/globals.css
```

---

## Tracking

All event-firing is centralized in `src/lib/tracking.ts`. Safe to call server-side (no-ops) and when pixel IDs are blank.

| Event                         | Meta Pixel          | GA4                   | Fired from                                   |
| ----------------------------- | ------------------- | --------------------- | -------------------------------------------- |
| Page view                     | `PageView` (auto)   | auto via `gtag` config| pixel scripts in `layout.tsx`                |
| VSL play                      | `ViewContent`       | `vsl_play`            | `VSL.tsx` (Wistia `_wq` play handler)        |
| Survey start                  | `InitiateCheckout`  | `survey_start`        | `app/apply/page.tsx` on mount                |
| Contact form view             | `AddToCart`         | `contact_form_view`   | `app/apply/contact/page.tsx` on mount        |
| Booking complete              | `Lead`              | `booking_complete`    | `app/thanks/page.tsx` on mount               |

---

## GHL webhook payload

The server route `POST /api/submit-lead` sends this flat JSON to the webhook:

```json
{
  "full_name": "...",
  "email": "...",
  "phone": "...",
  "website": "https://...",

  "q1_industry": "...",
  "q2_revenue": "...",
  "q3_current_channel": "...",
  "q4_timeline": "...",
  "q5_bottleneck": "...",

  "utm_source": "...",
  "utm_medium": "...",
  "utm_campaign": "...",
  "utm_content": "...",
  "utm_term": "...",

  "landed_at": "2025-01-01T00:00:00.000Z",
  "submitted_at": "2025-01-01T00:00:05.000Z",
  "referrer": "https://...",
  "ip": "1.2.3.4",
  "user_agent": "Mozilla/5.0...",
  "source": "blitzmailer_funnel"
}
```

In GHL, map `full_name` → Full Name, `email` → Email, `phone` → Phone, `website` → custom field "Website". Map each `q*` to its own custom field. UTMs already have native GHL fields; map them directly.

---

## Deploying to Vercel

### 1. First deploy (preview URL)

```bash
# From a clean git clone:
npm i -g vercel      # if you don't already have it
vercel               # follow prompts — link to a new project
```

During setup, Vercel will detect Next.js automatically. **Add the four env vars** (see above) in the Vercel dashboard → Project → Settings → Environment Variables. Be sure to select all three environments (Production, Preview, Development) for `GHL_WEBHOOK_URL` and `NEXT_PUBLIC_CALENDLY_URL`.

Deploy to preview:

```bash
vercel
```

You'll get a `*.vercel.app` URL. **Verify the full funnel on this URL before DNS cutover.**

### 2. Full end-to-end test (on preview URL)

Run through these before pointing the domain:

- [ ] Landing page loads fast, looks clean on mobile (Chrome DevTools responsive mode)
- [ ] VSL loads and plays. Check browser console for no errors
- [ ] Open DevTools → Network → filter by "fbevents" → confirm `PageView` fires (if Meta Pixel ID is set)
- [ ] Clicking CTA → lands on `/apply` with progress bar at 1/5
- [ ] Selecting an answer auto-advances after ~300ms
- [ ] Back button returns to previous question with your prior answer still selected
- [ ] Refreshing mid-survey preserves answers (sessionStorage)
- [ ] After Q5, redirects to `/apply/contact`
- [ ] Contact form validates (bad email, missing fields, bad URL)
- [ ] Submitting with valid data → lands on `/book?name=...&email=...` and Calendly is prefilled
- [ ] Go to GHL → confirm the inbound webhook received a payload with all 5 survey answers, contact, and UTMs
- [ ] Book a test slot on Calendly → redirects to `/thanks`
- [ ] On `/thanks`: Meta Pixel `Lead` event fires (check Network → `fbevents.js`)
- [ ] Test with UTM params: visit `/?utm_source=meta&utm_campaign=test` and confirm UTMs arrive in the webhook

### 3. Production deploy

```bash
vercel --prod
```

### 4. DNS cutover (blitzmailer.site)

The domain currently points at a GHL funnel. To cut over:

1. **In Vercel:** Project → Settings → Domains → **Add** `blitzmailer.site` and `www.blitzmailer.site`.
2. Vercel will show you the required DNS records. There are two paths:
   - **Path A — nameserver swap (recommended):** change your registrar's nameservers to Vercel's. Simplest, gives Vercel full control of the zone. ~5-60 min propagation.
   - **Path B — A + CNAME records:** at your current DNS host (likely wherever you bought the domain or your GHL DNS host), add:
     - `A` record for `blitzmailer.site` → `76.76.21.21`
     - `CNAME` record for `www` → `cname.vercel-dns.com`
     - Remove any conflicting `A` / `CNAME` records pointing to the old GHL funnel.
3. Wait for Vercel to show "Valid Configuration" (usually a few minutes, can take up to 24h for full propagation).
4. Vercel auto-provisions an SSL cert. Once it's green, visit `https://blitzmailer.site` and re-run the E2E checklist above on the live domain.
5. **Turn off the GHL funnel** at the URL level so it's not eating traffic during the overlap.

### 5. Post-launch

- Fill in `NEXT_PUBLIC_META_PIXEL_ID` and `NEXT_PUBLIC_GA4_ID` in Vercel env vars → redeploy.
- In Meta Ads Manager: create custom conversions on the `Lead` event (and optionally `InitiateCheckout` and `ViewContent` for mid-funnel optimization).
- In GA4: mark `booking_complete` as a conversion/key event.

---

## Customization pointers

- **Brand colors:** `tailwind.config.ts` → `theme.extend.colors.violet` + `colors.ink`.
- **Copy:** every user-facing string is inline in its component (e.g. `Hero.tsx`, `FAQ.tsx`). Nothing is pulled from a CMS.
- **Testimonials:** `src/components/Testimonials.tsx` has 3 placeholder quotes + a logo strip. Replace `quotes` array and `logos` array with real content.
- **Wistia video:** swap the `WISTIA_ID` constant at the top of `src/components/VSL.tsx`.
- **Calendly link:** change `NEXT_PUBLIC_CALENDLY_URL` in env.
- **Adding a survey question:** append to the `questions` array in `src/app/apply/page.tsx` and add the field to `SurveyAnswers` in `src/lib/storage.ts`. That's it — progress bar and routing scale automatically.

---

## Notes on design decisions

- **Geist font** via the `geist` npm package (Vercel's default — sharp, modern, matches Linear/Vercel/Cal.com aesthetic).
- **sessionStorage, not localStorage** — funnel state is intentionally scoped to a single tab session so re-entering the funnel later starts fresh.
- **First-touch UTM attribution** — UTMs are captured only if not already stored, so a user who comes in via a paid Meta ad and later returns via a different channel still gets credited to the paid source.
- **Webhook failures don't block booking** — if the GHL POST fails, we still redirect to Calendly. Lead data is recoverable from Calendly's own submission record.
- **No secondary nav** — per brief, there are no outbound links except the footer email/phone. Logo links back to `/`.
-
-
-
-
