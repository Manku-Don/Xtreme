// Thin wrapper around Meta's WhatsApp Business Cloud API
// (https://developers.facebook.com/docs/whatsapp/cloud-api).
//
// IMPORTANT — WhatsApp compliance, not just code hygiene:
//   - Meta requires an *approved message template* for any business-initiated
//     message sent outside the 24h "customer service window" (i.e. more than
//     24h since the person last messaged you). sendTemplateMessage() is for
//     that. sendSessionMessage() is only valid inside that 24h window (e.g.
//     immediately after someone messages your WhatsApp or submits a form
//     that counts as user-initiated contact).
//   - Every send here should already be consent-gated by the caller
//     (lead.optedInWhatsApp === true) — this file does not enforce that
//     itself, see services/automation.js and routes/whatsapp.js.
//
// DRY-RUN MODE: until WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID are set in
// .env, every "send" here just logs to whatsappLog with status
// "simulated" and resolves successfully — so the whole opt-in -> welcome ->
// drip pipeline can be built, demoed and tested end-to-end with zero real
// WhatsApp Business API access, and flipping to real sends later is just
// filling in the two env vars.
import axios from "axios";
import { db } from "../db.js";
import { randomUUID } from "node:crypto";

function isConfigured() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

function graphUrl() {
  const version = process.env.WHATSAPP_API_VERSION || "v21.0";
  return `https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
}

async function logMessage(entry) {
  db.data.whatsappLog.push({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  });
  await db.write();
}

// Normalizes an Indian 10-digit mobile number (or already-E.164 number) to
// E.164 (+91XXXXXXXXXX) for the Graph API's `to` field.
export function toE164India(rawPhone) {
  const digits = String(rawPhone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits; // best-effort passthrough for other formats
}

async function post(payload, { leadId, kind }) {
  if (!isConfigured()) {
    await logMessage({
      leadId,
      direction: "outbound",
      to: payload.to,
      kind,
      status: "simulated",
      payload,
    });
    return { ok: true, simulated: true };
  }

  try {
    const { data } = await axios.post(graphUrl(), payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 10_000,
    });
    await logMessage({
      leadId,
      direction: "outbound",
      to: payload.to,
      kind,
      status: "sent",
      payload,
      response: data,
    });
    return { ok: true, simulated: false, data };
  } catch (err) {
    const errData = err.response?.data || { message: err.message };
    await logMessage({
      leadId,
      direction: "outbound",
      to: payload.to,
      kind,
      status: "failed",
      payload,
      error: errData,
    });
    return { ok: false, simulated: false, error: errData };
  }
}

// Free-text message — only legal inside the 24h customer-service window
// (e.g. right after someone opts in via the contact form, or replies to us).
export async function sendSessionMessage(to, body, { leadId } = {}) {
  const payload = {
    messaging_product: "whatsapp",
    to: toE164India(to),
    type: "text",
    text: { body },
  };
  return post(payload, { leadId, kind: "session" });
}

// Approved-template message — required for anything sent outside the 24h
// window (the automated drip: day-1 / day-3 / day-7 follow-ups).
// `params` fills the template's {{1}}, {{2}}... body variables, in order.
export async function sendTemplateMessage(to, templateName, params = [], { leadId, langCode = "en" } = {}) {
  const payload = {
    messaging_product: "whatsapp",
    to: toE164India(to),
    type: "template",
    template: {
      name: templateName,
      language: { code: langCode },
      components: params.length
        ? [{ type: "body", parameters: params.map((text) => ({ type: "text", text: String(text) })) }]
        : undefined,
    },
  };
  return post(payload, { leadId, kind: `template:${templateName}` });
}

export async function logInbound(entry) {
  return logMessage({ direction: "inbound", ...entry });
}
