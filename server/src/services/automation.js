// The actual "automated WhatsApp follow-up" engine. On a consented opt-in,
// this sends an immediate welcome (a *session* message — legal because the
// person just contacted us) and schedules three template follow-ups. Every
// scheduled send is re-checked against consent/opt-out/staff-takeover at
// send time, not just at scheduling time, so someone who replies STOP on
// day 2 never gets the day-3 message.
import cron from "node-cron";
import { randomUUID } from "node:crypto";
import { db } from "../db.js";
import { sendSessionMessage, sendTemplateMessage } from "./whatsapp.js";
import { GYM } from "../constants.js";

const DAY = 24 * 60 * 60 * 1000;

// The drip sequence. `delayMs` is measured from the moment the lead opts in.
// Template names come from .env so they match whatever's actually approved
// in Meta Business Manager (see server/.env.example for the full explainer).
function steps() {
  return [
    {
      key: "day1_reminder",
      delayMs: 1 * DAY,
      templateEnvKey: "WHATSAPP_TEMPLATE_DAY1_REMINDER",
      params: (lead) => [lead.name || "there", GYM.freeDemoShort],
    },
    {
      key: "day3_incentive",
      delayMs: 3 * DAY,
      templateEnvKey: "WHATSAPP_TEMPLATE_DAY3_INCENTIVE",
      params: (lead) => [lead.name || "there"],
    },
    {
      key: "day7_winback",
      delayMs: 7 * DAY,
      templateEnvKey: "WHATSAPP_TEMPLATE_DAY7_WINBACK",
      params: (lead) => [lead.name || "there"],
    },
  ];
}

const TAG_LINES = {
  student: "Ask about off-peak student-friendly slots when you visit.",
  working_professional: "We've got early-morning and late-evening slots that fit a work schedule.",
  homemaker_or_other: "Come by whenever suits your day — mid-mornings tend to be nice and quiet.",
  womens_batch_interest: "Ask our coach on the floor about women's training slots when you visit.",
};

// Call this right when a lead opts in to WhatsApp marketing. Sends the
// immediate welcome inline (session message) and queues the rest. The
// welcome line is personalized with whatever we already know — distance
// (if the lead checked their proximity) and self-reported tags (if they
// filled those in on the contact form) — since this is free text (not a
// pre-approved template), unlike the day-1/3/7 drip below.
export async function enrollLeadInDrip(lead) {
  const lines = [`Hey ${lead.name || "there"}! 💪 Thanks for reaching out to ${GYM.name}.`];

  if (lead.geo?.near) {
    lines.push(`You're only about ${lead.geo.distanceKm}km away — an easy trip in.`);
  }

  const tagLine = (lead.tags || []).map((t) => TAG_LINES[t]).find(Boolean);
  if (tagLine) lines.push(tagLine);

  lines.push(
    `Your ${GYM.freeDemoShort} is ready whenever you want to swing by — ${GYM.hours}, ${GYM.days}. ` +
      `Reply here anytime with questions, or STOP to opt out of updates.`
  );

  await sendSessionMessage(lead.phone, lines.join(" "), { leadId: lead.id });

  const now = Date.now();
  for (const step of steps()) {
    db.data.campaignQueue.push({
      id: randomUUID(),
      leadId: lead.id,
      step: step.key,
      channel: "whatsapp",
      scheduledFor: new Date(now + step.delayMs).toISOString(),
      status: "pending",
      sentAt: null,
    });
  }
  await db.write();
}

// Cancels any not-yet-sent queue items for a lead — used on opt-out (STOP
// keyword) and when a human reply comes in (see routes/whatsapp.js), so
// staff taking over a conversation doesn't get undercut by a bot message.
export async function cancelPendingDrip(leadId, reason = "cancelled") {
  let changed = false;
  for (const item of db.data.campaignQueue) {
    if (item.leadId === leadId && item.status === "pending") {
      item.status = reason;
      changed = true;
    }
  }
  if (changed) await db.write();
}

async function processDueItems() {
  const now = Date.now();
  const due = db.data.campaignQueue.filter(
    (item) => item.status === "pending" && new Date(item.scheduledFor).getTime() <= now
  );
  if (!due.length) return;

  const stepConfig = Object.fromEntries(steps().map((s) => [s.key, s]));

  for (const item of due) {
    const lead = db.data.leads.find((l) => l.id === item.leadId);
    const config = stepConfig[item.step];

    // Re-check every gate at send time, not just at enqueue time.
    if (!lead || !lead.optedInWhatsApp || lead.whatsappOptOut || lead.engagedManually || lead.status === "converted") {
      item.status = "skipped";
      continue;
    }

    const templateName = process.env[config.templateEnvKey];
    if (!templateName) {
      item.status = "skipped"; // template not configured — nothing to send
      continue;
    }

    const result = await sendTemplateMessage(lead.phone, templateName, config.params(lead), { leadId: lead.id });
    item.status = result.ok ? "sent" : "failed";
    item.sentAt = new Date().toISOString();
  }

  await db.write();
}

let started = false;
export function startAutomationScheduler() {
  if (started) return;
  started = true;
  const minutes = Math.max(1, Number(process.env.AUTOMATION_TICK_MINUTES) || 15);
  cron.schedule(`*/${minutes} * * * *`, () => {
    processDueItems().catch((err) => console.error("[automation] tick failed:", err));
  });
  console.log(`[automation] drip-campaign scheduler running every ${minutes} min`);
}

// Exposed for the admin dashboard's "run now" button and for tests.
export { processDueItems };
