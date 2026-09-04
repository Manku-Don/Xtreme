import { Router } from "express";
import { db } from "../db.js";
import { distanceKm, resolveCoarseLocation } from "../utils/geo.js";
import { recordEvent } from "../services/leadEngine.js";
import { GYM } from "../constants.js";

const router = Router();

// POST /api/track/visit — fired once per route change from the client.
// Anonymous: keyed only by the xfg_vid cookie, no name/phone attached yet.
// Also resolves a coarse, IP-based service-area signal — no permission
// prompt needed, unlike the precise GPS flow below — so every visitor gets
// tagged, not just the ones who click "how close am I". See
// utils/geo.js:resolveCoarseLocation for why this is deliberately fuzzy.
router.post("/visit", async (req, res) => {
  const { path: pagePath, referrer, utm } = req.body || {};
  // Falls back to the real, known gym coordinates (see constants.js) so this
  // never silently breaks with NaN if the env vars are unset.
  const gymLat = Number(process.env.GYM_LAT) || GYM.lat;
  const gymLng = Number(process.env.GYM_LNG) || GYM.lng;
  const coarseLocation = resolveCoarseLocation(req.ip, gymLat, gymLng);

  const visitor = await recordEvent({
    visitorId: req.visitorId,
    type: "page_view",
    meta: { path: pagePath, referrer },
    utm,
  });
  if (visitor && coarseLocation && !visitor.region) {
    visitor.region = coarseLocation;
    await db.write();
  }

  res.json({ ok: true });
});

// POST /api/track/event — generic interest-signal log (viewed pricing,
// clicked WhatsApp, watched the intro animation through, etc). See
// services/leadEngine.js EVENT_WEIGHTS for what each type is worth.
router.post("/event", async (req, res) => {
  const { type, meta } = req.body || {};
  if (!type) return res.status(400).json({ ok: false, error: "type is required" });
  await recordEvent({ visitorId: req.visitorId, type, meta });
  res.json({ ok: true });
});

// POST /api/track/geo — ONLY called client-side after the browser's own
// geolocation permission prompt has been accepted AND the user has clicked
// an explicit "show me how close I am" control (see NearbyBanner.jsx) — this
// endpoint itself also requires body.consent === true as a second, explicit
// gate. Nothing here messages anyone: it only unlocks the on-site "you're
// nearby" banner and, if the visitor separately chooses to submit their
// phone number in that banner, feeds into the normal opt-in flow below.
router.post("/geo", async (req, res) => {
  const { lat, lng, consent } = req.body || {};
  if (!consent) {
    return res.status(400).json({ ok: false, error: "Location consent is required." });
  }
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ ok: false, error: "lat/lng must be numbers." });
  }

  const gymLat = Number(process.env.GYM_LAT) || GYM.lat;
  const gymLng = Number(process.env.GYM_LNG) || GYM.lng;
  const thresholdKm = Number(process.env.GEO_PROXIMITY_KM) || 5;
  const km = distanceKm(lat, lng, gymLat, gymLng);
  const near = km <= thresholdKm;

  const visitor = await recordEvent({
    visitorId: req.visitorId,
    type: near ? "geo_near" : "geo_checked",
    meta: { distanceKm: Number(km.toFixed(2)) },
  });
  if (visitor) {
    visitor.geo = { lat, lng, distanceKm: Number(km.toFixed(2)), near, capturedAt: new Date().toISOString() };
    await db.write();
  }

  res.json({ ok: true, near, distanceKm: Number(km.toFixed(2)) });
});

export default router;
