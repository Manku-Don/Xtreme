# Xtreme Fitness Gym — Website

A full-stack, multi-page website for Xtreme Fitness Gym: a React + Vite frontend
(Framer Motion animations, React Router, Tailwind CSS) and a Node/Express
backend that handles contact-form enquiries **and** a lead-tracking /
WhatsApp marketing-automation layer — cookie-based visitor tracking, an
interest-scored CRM, consent-gated proximity marketing, and an automated
WhatsApp follow-up sequence via Meta's WhatsApp Business Cloud API.

## Structure

```
xtreme-fitness-gym-project/
├── client/     React + Vite frontend
│   └── src/
│       ├── components/CookieConsent.jsx    consent banner (gates tracking)
│       ├── components/ExitIntentModal.jsx  "before you go" lead capture
│       ├── components/NearbyBanner.jsx     opt-in "how close am I" widget
│       ├── pages/Admin.jsx                 owner-only leads dashboard (/admin)
│       └── utils/tracking.js               visitor/event/geo client helpers
└── server/     Express API
    └── src/
        ├── routes/enquiry.js    Contact-form submissions (admin-key gated to read)
        ├── routes/track.js      visit / event / geo-proximity tracking
        ├── routes/leads.js      admin CRM API (list, stats, update, run-now)
        ├── routes/whatsapp.js   opt-in endpoint + Meta webhook
        ├── services/whatsapp.js WhatsApp Cloud API wrapper (dry-run by default)
        ├── services/automation.js  drip-campaign scheduler (node-cron)
        └── services/leadEngine.js  visitor→lead linking + interest scoring
```

## Design

- **Palette**: near-black "concrete" background with two accent colours pulled
  from real IPF/IWF competition plate colours (red = 25kg, yellow = 15kg),
  plus a warm "chalk" off-white for headlines.
- **Type**: Anton for headlines, Big Shoulders Stencil for tags/eyebrows
  (stenciled-plate look), Manrope for body text.
- **Signature visual**: the pricing cards render an animated "loaded barbell" —
  more plates for longer plans — instead of a plain price table.
- Every page uses Framer Motion for scroll-reveal and page-transition animation.

## Running it locally

### 1. Backend

```bash
cd server
cp .env.example .env      # then fill in ADMIN_API_KEY at minimum — see below
npm install
npm run dev                # http://localhost:4000
```

`server/data/db.json` (auto-created, gitignored) holds everything via lowdb —
enquiries, leads, visitors, events, the WhatsApp send log, and the drip
campaign queue. No external database required.

### 2. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

The frontend reads the API URL from `VITE_API_BASE_URL` (see `client/.env`).

### 3. Production build

```bash
cd client && npm run build     # outputs client/dist
cd server && npm start         # run the API with a process manager (pm2, etc.) in production
```

Deploy `client/dist` as a static site (Vercel/Netlify/Nginx) and the `server/`
folder anywhere that runs Node (Render/Railway/a small VPS) — just point
`VITE_API_BASE_URL` at wherever the API ends up, and `CLIENT_ORIGIN` in the
server's `.env` back at the deployed frontend URL.

---

## Marketing & lead-automation layer

### What it does

- **Visitor tracking** — every browser gets a first-party, httpOnly cookie
  (`xfg_vid`). Page views and interest signals (viewed pricing, clicked
  WhatsApp, etc.) build up an interest score *before* anyone hands over
  contact info, so a lead already looks "hot" or "cold" the moment they do.
- **Lead capture, three ways**: the Contact form, an exit-intent popup
  ("before you go, grab your free demo"), and an opt-in "How Close Am I?"
  proximity banner. All three funnel into one CRM record per phone number.
- **Automated WhatsApp follow-up**: opting in sends an immediate welcome,
  then queues day-1 / day-3 / day-7 template messages. A reply pauses the
  automation (a human should take it from there); "STOP" unsubscribes
  immediately and cancels everything queued.
- **Admin dashboard** at `/admin` (not linked in the site nav) — funnel
  stats, a sortable lead list with interest scores, inline status/notes
  editing, a direct `wa.me` link per lead, and a manual "run automation now"
  button.

### Why it's built the way it is (please read before enabling real sends)

Two design choices were deliberate, not accidental gaps:

1. **Nobody gets messaged just for being physically near the gym.** The geo
   endpoint (`/api/track/geo`) requires an explicit `consent: true` flag that
   only `NearbyBanner.jsx`'s button click sends — it powers an on-site
   "you're 2km away" message, nothing more, unless the visitor separately
   types in their own phone number. Auto-texting strangers based on location
   would risk both WhatsApp Business account bans and non-compliance with
   India's telecom/consent rules — and would just be creepy.
2. **WhatsApp marketing messages require their own opt-in**, separate from
   "book a demo." Booking a demo means a callback; the "also message me
   updates on WhatsApp" checkbox (Contact page) or the act of submitting the
   exit-intent/nearby forms (whose entire stated purpose is a WhatsApp
   message) is what enrolls someone in the automated sequence.

### Going live with real WhatsApp sends

Right now the whole pipeline runs in **dry-run mode** — outbound messages are
logged to `db.json`'s `whatsappLog` instead of actually sent, so you can test
opt-in → welcome → drip end-to-end with zero WhatsApp Business API access.
To send real messages:

1. Create a Meta developer app with WhatsApp Business Platform access, get a
   `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`.
2. In Meta Business Manager, create and get approved the three template
   messages named in `.env` (`WHATSAPP_TEMPLATE_DAY1_REMINDER`, etc.) —
   templates are *required* by Meta for any business-initiated message sent
   more than 24h after the person last messaged you.
3. Register your webhook URL (`https://yourdomain.com/api/whatsapp/webhook`)
   in the Meta dashboard, using the same `WHATSAPP_VERIFY_TOKEN` as `.env`.
4. Fill in all four values in `server/.env` — sends flip from simulated to
   real automatically, no code changes needed.
5. **Change `ADMIN_API_KEY` from the example value** before deploying — the
   admin routes (including everyone's phone numbers) are gated on it.

### Proximity targeting & audience segmentation

Two more pieces layer on top of the above, aimed at proximity being the
main audience:

- **Every visitor gets a coarse, passive location signal** — not just the
  ones who click "How Close Am I?". `geoip-lite` (a bundled, offline IP
  database — nobody's IP is ever sent to a third party) resolves an
  approximate city/region on first page view, no permission prompt needed.
  It's deliberately fuzzy (city/ISP-block accuracy, configurable via
  `SERVICE_AREA_RADIUS_KM`) — good enough to flag "probably a real local
  prospect" for the admin dashboard, not precise enough to claim a specific
  distance (that's still only ever shown after the GPS-based opt-in check).
- **The homepage now has its own "Closer Than You Think" section** with the
  same consent-based proximity widget, instead of it living only on the
  Contact page — proximity is meant to be a first-class CTA, not a buried
  one. Deliberately doesn't name specific neighbourhoods (no "we serve
  Janakpuri, Palam..." copy) — the proximity check itself tells each
  visitor their own distance instead of guessing at a service-area list.
- **Admin dashboard defaults to sorting nearby leads first** (`sort=proximity`),
  ahead of interest score — so staff call the closest prospects before
  chasing a hotter-scored lead three cities away.
- **Self-reported audience tags** (student / working professional /
  homemaker / interested in women's-only slots) — optional checkboxes on
  the Contact form, never inferred. Feed the admin dashboard's tag filter
  and personalize the immediate WhatsApp welcome message (free text, so no
  Meta template approval needed for this part — see below for what does
  need approval).

  **Before this goes live**: the "women's-only slots" tag option is a
  placeholder, not a confirmed fact about Xtreme's actual programs — confirm
  and adjust it in `client/src/utils/tracking.js` (`TAG_OPTIONS`) before
  publishing, or drop it if the gym doesn't offer that.

## Things to finish before this goes live

1. **Trainer bios, gallery photos, more reviews** — see inline `TODO`s in
   `client/src/data/siteData.js`.
2. **Email** (`GYM.email` in `siteData.js`) is still a placeholder.
3. **WhatsApp Business API credentials + approved templates** — see above;
   until then, automation runs in dry-run/simulated mode.
4. **`ADMIN_API_KEY` and `WHATSAPP_VERIFY_TOKEN`** — both still the example
   placeholder value in `.env.example`; must be changed before this is
   reachable from the public internet.
5. **Map embed** — currently a plain Google Maps search embed. If you have a
   Google Maps API key, swap for a pinned embed using the Place ID
   (`ChIJlVKbEOgbDTkRagcWRBXfRqc`) already stored in `siteData.js`.
