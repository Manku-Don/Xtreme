// First-party visitor tracking. No third-party ad pixels, nothing sold to
// anyone — this exists so the gym owner can see which pages a lead looked
// at before calling them back, and to power the (consent-gated, see below)
// "you're nearby" banner. Talks to the server's /api/track/* routes, which
// read/write the httpOnly xfg_vid cookie (see server/src/middleware/visitor.js).
import { API_BASE_URL } from "../data/siteData";

const CONSENT_KEY = "xfg_cookie_consent"; // "accepted" | "essential-only"
const UTM_KEY = "xfg_utm";

// Self-reported audience segments — mirrors server/src/services/leadEngine.js
// KNOWN_TAGS. Self-selected only, never inferred; used to personalize the
// automated WhatsApp welcome message and for admin-side filtering.
export const TAG_OPTIONS = [
  { id: "student", label: "Student" },
  { id: "working_professional", label: "Working Professional" },
  { id: "homemaker_or_other", label: "Homemaker / Other" },
  { id: "womens_batch_interest", label: "Interested in women's training slots (if available)" },
];

export function getCookieConsent() {
  return localStorage.getItem(CONSENT_KEY);
}

export function setCookieConsent(value) {
  localStorage.setItem(CONSENT_KEY, value);
}

// First-touch UTM attribution: capture ?utm_source=... once, then keep
// reusing it for the rest of the session even once the visitor has clicked
// through to a URL without those params.
function getUtm() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
  };
  if (Object.values(fromUrl).some(Boolean)) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}");
  } catch {
    return {};
  }
}

async function post(path, body) {
  try {
    await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });
  } catch {
    // Tracking is best-effort and must never break the site for the user.
  }
}

// Non-essential (analytics/marketing) — gated on cookie consent.
export function trackVisit(path) {
  if (getCookieConsent() === "essential-only") return;
  post("/api/track/visit", { path, referrer: document.referrer, utm: getUtm() });
}

export function trackEvent(type, meta) {
  if (getCookieConsent() === "essential-only") return;
  post("/api/track/event", { type, meta });
}

// Geolocation is opt-in per call (a button press, never on page load) and
// the consent:true flag mirrors the explicit action that triggered it —
// see NearbyBanner.jsx. Returns { near, distanceKm } or null on failure.
export async function checkProximity(lat, lng) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/track/geo`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng, consent: true }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Submits a phone number as a WhatsApp-marketing opt-in — the one path that
// enrolls someone in the automated follow-up sequence (server-side).
export async function submitWhatsappOptIn({ name, phone, source, wantsDemo, message, tags }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/whatsapp/opt-in`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, source, wantsDemo, message, tags }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
