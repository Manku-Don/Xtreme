// Central place that turns raw browsing behaviour into a CRM-usable "lead"
// record. Anonymous visitors (tracked only by the xfg_vid cookie) build up
// an interest score just by browsing; the moment they hand over a phone
// number (contact form, WhatsApp opt-in, exit-intent capture), that history
// gets attached to a named Lead the gym owner can actually follow up with.
import { randomUUID } from "node:crypto";
import { db } from "../db.js";

// Point values are deliberately rough — the goal is a "hot lead" ranking
// for the admin dashboard, not a precise model.
export const EVENT_WEIGHTS = {
  page_view: 1,
  viewed_pricing: 3,
  viewed_programs: 2,
  viewed_trainers: 1,
  time_on_page_60s: 2,
  clicked_whatsapp: 5,
  watched_intro_complete: 1,
  geo_near: 3,
  exit_intent_shown: 0,
  exit_intent_submitted: 8,
  wants_demo: 10,
  form_submit: 10,
  whatsapp_opt_in: 6,
};

// Self-reported audience segments (never inferred) — shown as optional
// checkboxes on the contact/exit-intent forms so a lead can tag themselves.
// Kept as a controlled vocabulary server-side so the admin dashboard's tag
// filter is reliable rather than free text. Add to both this list and the
// frontend's checkbox options together if you add a new segment.
export const KNOWN_TAGS = [
  "student",
  "working_professional",
  "homemaker_or_other",
  "womens_batch_interest",
];

function ensureVisitor(visitorId) {
  if (!visitorId) return null;
  if (!db.data.visitors[visitorId]) {
    db.data.visitors[visitorId] = {
      visitorId,
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      utm: {},
      region: null,
      interestScore: 0,
      leadId: null,
    };
  }
  return db.data.visitors[visitorId];
}

// Records one interaction (page view / click / etc), scores it, and — if
// this visitor is already linked to a named lead — keeps that lead's score
// and lastSeenAt in sync too, so returning-but-not-yet-converted behaviour
// still shows up on the dashboard.
export async function recordEvent({ visitorId, type, meta = {}, utm }) {
  const visitor = ensureVisitor(visitorId);
  const weight = EVENT_WEIGHTS[type] ?? 0;
  const now = new Date().toISOString();

  db.data.events.push({ id: randomUUID(), visitorId, type, meta, timestamp: now });

  if (visitor) {
    visitor.lastSeenAt = now;
    visitor.interestScore += weight;
    if (utm && Object.values(utm).some(Boolean)) {
      visitor.utm = { ...visitor.utm, ...utm };
    }
    if (visitor.leadId) {
      const lead = db.data.leads.find((l) => l.id === visitor.leadId);
      if (lead) {
        lead.interestScore += weight;
        lead.lastSeenAt = now;
        lead.updatedAt = now;
      }
    }
  }

  await db.write();
  return visitor;
}

// Creates a new lead, or updates an existing one matched by phone number —
// re-submitting the contact form (e.g. "actually, call me on this number
// instead") updates the same person rather than forking a duplicate record.
// This is the single entry point every lead-capturing surface (contact
// form, WhatsApp opt-in checkbox, exit-intent modal) should call through.
export async function upsertLead({
  visitorId,
  name,
  phone,
  email,
  source,
  message,
  wantsDemo,
  optedInWhatsApp,
  geo,
  utm,
  tags,
}) {
  const now = new Date().toISOString();
  const normalizedPhone = String(phone || "").replace(/\D/g, "").slice(-10);
  let lead = db.data.leads.find((l) => l.phone === normalizedPhone);

  const visitor = visitorId ? ensureVisitor(visitorId) : null;
  const carriedScore = visitor?.interestScore ?? 0;
  const carriedUtm = visitor?.utm ?? {};
  const carriedRegion = visitor?.region ?? null;
  // Self-reported only — filters out anything not in KNOWN_TAGS so the
  // admin filter dropdown never sees junk/typo'd values.
  const cleanTags = Array.isArray(tags) ? tags.filter((t) => KNOWN_TAGS.includes(t)) : [];

  if (lead) {
    lead.name = name || lead.name;
    lead.email = email ?? lead.email;
    lead.message = message ?? lead.message;
    if (wantsDemo) lead.wantsDemo = true;
    if (optedInWhatsApp) {
      lead.optedInWhatsApp = true;
      lead.whatsappOptOut = false;
      lead.consent = { ...lead.consent, whatsapp: { granted: true, at: now } };
    }
    if (geo) lead.geo = geo;
    if (carriedRegion && !lead.region) lead.region = carriedRegion;
    if (cleanTags.length) lead.tags = [...new Set([...(lead.tags || []), ...cleanTags])];
    lead.visitorId = visitorId || lead.visitorId;
    lead.interestScore = Math.max(lead.interestScore, carriedScore) + (EVENT_WEIGHTS.form_submit ?? 0);
    lead.lastSeenAt = now;
    lead.updatedAt = now;
  } else {
    lead = {
      id: randomUUID(),
      visitorId: visitorId || null,
      name: name || "",
      phone: normalizedPhone,
      email: email || null,
      source: source || "unknown",
      utm: { ...carriedUtm, ...(utm || {}) },
      region: carriedRegion,
      tags: cleanTags,
      firstSeenAt: visitor?.firstSeenAt || now,
      lastSeenAt: now,
      interestScore: carriedScore + (EVENT_WEIGHTS.form_submit ?? 0),
      wantsDemo: Boolean(wantsDemo),
      optedInWhatsApp: Boolean(optedInWhatsApp),
      whatsappOptOut: false,
      engagedManually: false,
      consent: {
        whatsapp: optedInWhatsApp ? { granted: true, at: now } : { granted: false, at: null },
      },
      geo: geo || null,
      status: "new",
      notes: "",
      message: message || "",
      createdAt: now,
      updatedAt: now,
    };
    db.data.leads.push(lead);
  }

  if (visitor) visitor.leadId = lead.id;
  await db.write();
  return lead;
}

export async function getLeadById(id) {
  return db.data.leads.find((l) => l.id === id) || null;
}

export async function getLeadByPhone(phone) {
  const normalized = String(phone || "").replace(/\D/g, "").slice(-10);
  return db.data.leads.find((l) => l.phone === normalized) || null;
}
