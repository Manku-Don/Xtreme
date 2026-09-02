import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { processDueItems } from "../services/automation.js";
import { KNOWN_TAGS } from "../services/leadEngine.js";

const router = Router();
router.use(requireAdmin);

// A lead counts as "local" if EITHER the precise, consent-based GPS check
// (NearbyBanner) or the passive, coarse IP-based one (every visit) flagged
// them as being in the service area. Derived at read time, not stored, so
// dashboard sorting always reflects current thresholds in .env.
function isLocal(lead) {
  return Boolean(lead.geo?.near || lead.region?.inServiceArea);
}

// GET /api/leads — the CRM list. Sorted hottest-first by default so the
// gym owner sees who to call today, not just who signed up most recently.
// sort=proximity puts local leads first (proximity IS the main audience —
// see README) with interest score as the tiebreaker within each group.
router.get("/", async (req, res) => {
  await db.read();
  const { status, tag, sort = "interest" } = req.query;

  let leads = [...db.data.leads];
  if (status) leads = leads.filter((l) => l.status === status);
  if (tag) leads = leads.filter((l) => (l.tags || []).includes(tag));

  leads.sort((a, b) => {
    if (sort === "recent") return new Date(b.lastSeenAt) - new Date(a.lastSeenAt);
    if (sort === "proximity") {
      const localDiff = Number(isLocal(b)) - Number(isLocal(a));
      return localDiff !== 0 ? localDiff : b.interestScore - a.interestScore;
    }
    return b.interestScore - a.interestScore;
  });

  res.json({ ok: true, count: leads.length, leads: leads.map((l) => ({ ...l, isLocal: isLocal(l) })) });
});

// GET /api/leads/stats — funnel counts for the dashboard header cards.
router.get("/stats", async (_req, res) => {
  await db.read();
  const leads = db.data.leads;
  const bySource = {};
  const byStatus = {};
  const byTag = Object.fromEntries(KNOWN_TAGS.map((t) => [t, 0]));
  let localCount = 0;
  for (const l of leads) {
    bySource[l.source] = (bySource[l.source] || 0) + 1;
    byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    for (const t of l.tags || []) {
      if (t in byTag) byTag[t] += 1;
    }
    if (isLocal(l)) localCount += 1;
  }
  res.json({
    ok: true,
    totalLeads: leads.length,
    totalVisitors: Object.keys(db.data.visitors).length,
    optedInWhatsApp: leads.filter((l) => l.optedInWhatsApp && !l.whatsappOptOut).length,
    converted: byStatus.converted || 0,
    localLeads: localCount,
    bySource,
    byStatus,
    byTag,
  });
});

// PATCH /api/leads/:id — update status/notes from the dashboard (e.g. mark
// "demo_booked" after a phone call, or "converted" once they sign up — the
// automation engine reads `status` too, so marking someone converted also
// stops the drip queue from bothering them further).
router.patch("/:id", async (req, res) => {
  const lead = db.data.leads.find((l) => l.id === req.params.id);
  if (!lead) return res.status(404).json({ ok: false, error: "Lead not found" });

  const { status, notes, engagedManually } = req.body || {};
  if (status) lead.status = status;
  if (typeof notes === "string") lead.notes = notes;
  if (typeof engagedManually === "boolean") lead.engagedManually = engagedManually;
  lead.updatedAt = new Date().toISOString();

  await db.write();
  res.json({ ok: true, lead });
});

// POST /api/leads/automation/run-now — manual trigger so the owner can test
// the drip pipeline (or clear a backlog) without waiting for the next cron
// tick. Same code path the scheduler itself uses.
router.post("/automation/run-now", async (_req, res) => {
  await processDueItems();
  res.json({ ok: true });
});

export default router;
