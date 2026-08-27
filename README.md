# Xtreme Fitness Gym — Website

A full-stack, multi-page website for Xtreme Fitness Gym: a React + Vite frontend
(Framer Motion animations, React Router, Tailwind CSS) and a small Node/Express
backend that receives contact-form enquiries.

## Structure

```
xtreme-fitness-gym-project/
├── client/     React + Vite frontend
└── server/     Express API (handles the Contact page enquiry form)
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
cp .env.example .env
npm install
npm run dev        # http://localhost:4000
```

Enquiries submitted from the Contact page are stored in `server/data/db.json`
(a simple JSON file via lowdb — no external database required). Swap this for
MongoDB/Mongoose later if you want a real database; the route logic in
`server/src/routes/enquiry.js` is intentionally small and easy to replace.

### 2. Frontend

In a second terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

The frontend reads the API URL from `VITE_API_BASE_URL` (see `client/.env.example`).

### 3. Production build

```bash
cd client && npm run build     # outputs client/dist
cd server && npm start         # run the API with a process manager (pm2, etc.) in production
```

Deploy `client/dist` as a static site (Vercel/Netlify/Nginx) and the `server/`
folder anywhere that runs Node (Render/Railway/a small VPS) — just point
`VITE_API_BASE_URL` at wherever the API ends up.

## Things to finish before this goes live

These are called out inline in the code too (search for `TODO`):

1. **Trainer bios** — `client/src/data/siteData.js` → `TRAINERS` array currently
   holds placeholder names/titles. Swap in real names, photos, and specific
   powerlifting achievements.
2. **Gallery/section photos** — currently real, freely-licensed stock photography
   (Unsplash) standing in for real photos of your floor. Swap the URLs in
   `IMAGES` for actual photos of the gym whenever you have them.
3. **Reviews** — `REVIEWS` in `siteData.js` has 3 real five-star reviews pulled
   from your public Google listing (the tool used here only exposes a handful
   of review snippets, not all 51, and doesn't expose a per-review star
   rating — one real review that explicitly said "four-star experience" was
   excluded, and one about "Sunday practice classes" was left out because it
   was about the now-closed academy, not the gym). Open your Google Business
   Profile, copy in more 5-star reviews with text, and the carousel will pick
   them up automatically — it's not hardcoded to 3.
4. **Contact details** — phone number was pulled from the gym's public Google
   listing; double check it's current. Email and WhatsApp link are placeholders.
5. **Map embed** — currently a plain Google Maps search embed built from the
   address text. If you have a Google Maps API key, this can be swapped for a
   pinned embed using the Place ID (`ChIJlVKbEOgbDTkRagcWRBXfRqc`) already
   stored in `siteData.js`.
