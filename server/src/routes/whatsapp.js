import { Router } from "express";
import { db } from "../db.js";
import { upsertLead, getLeadByPhone } from "../services/leadEngine.js";
import { enrollLeadInDrip, cancelPendingDrip } from "../services/automation.js";
import { sendSessionMessage, logInbound } from "../services/whatsapp.js";

const router = Router();

// POST /api/whatsapp/opt-in — the "message me updates on WhatsApp" checkbox
// (Contact.jsx, ExitIntentModal.jsx). This is the ONLY path that enrolls
// someone in the automated drip sequence, and it requires an explicit,
// separate consent flag from the caller — ticking "book my free demo"
// alone does not opt someone into marketing messages.
router.post("/opt-in", async (req, res) => {
  const { name, phone, source, wantsDemo, message, tags } = req.body || {};
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({ ok: false, error: "A valid phone number is required." });
  }

  // Carry over any proximity data the visitor already generated (e.g. via
  // NearbyBanner) so it shows up on the lead record in the dashboard.
  const visitorGeo = db.data.visitors[req.visitorId]?.geo || null;

  const lead = await upsertLead({
    visitorId: req.visitorId,
    name,
    phone: cleanPhone,
    source: source || "whatsapp_opt_in",
    wantsDemo,
    message,
    optedInWhatsApp: true,
    geo: visitorGeo,
    tags,
  });

  await enrollLeadInDrip(lead);
  res.status(201).json({ ok: true, lead });
});

// GET /api/whatsapp/webhook — Meta's one-time webhook verification
// handshake. Register this URL in Meta's dashboard with the same
// WHATSAPP_VERIFY_TOKEN set in .env.
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// POST /api/whatsapp/webhook — inbound messages + delivery/read status
// updates land here. Two jobs: (1) honor STOP/unsubscribe immediately, and
// (2) hand the conversation to a human — any other reply pauses the
// automated drip so staff can pick it up without a bot message crossing it.
router.post("/webhook", async (req, res) => {
  res.sendStatus(200); // ack fast; Meta retries on non-2xx

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const messages = change?.messages;
    if (!messages?.length) return;

    for (const msg of messages) {
      const from = msg.from;
      const body = msg.text?.body || "";
      const lead = await getLeadByPhone(from);

      await logInbound({
        leadId: lead?.id || null,
        from,
        body,
        raw: msg,
      });

      if (!lead) continue;

      const normalized = body.trim().toUpperCase();
      if (["STOP", "UNSUBSCRIBE", "CANCEL"].includes(normalized)) {
        lead.whatsappOptOut = true;
        await cancelPendingDrip(lead.id, "opted_out");
        await sendSessionMessage(
          from,
          "You've been unsubscribed from Xtreme Fitness Gym updates. Reply START anytime to opt back in.",
          { leadId: lead.id }
        );
      } else {
        // A real reply came in — let a human take it from here.
        lead.status = lead.status === "new" ? "contacted" : lead.status;
        lead.engagedManually = true;
        await cancelPendingDrip(lead.id, "human_engaged");
      }
    }
  } catch (err) {
    console.error("[whatsapp webhook] failed to process:", err);
  }
});

export default router;
