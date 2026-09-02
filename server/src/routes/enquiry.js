import { Router } from "express";
import { randomUUID } from "node:crypto";
import { db } from "../db.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { upsertLead } from "../services/leadEngine.js";

const router = Router();

function validateEnquiry(body) {
  const errors = [];
  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();

  if (!name) errors.push("Name is required.");
  if (!phone) errors.push("Phone is required.");
  else if (!/^[\d+\-\s()]{7,15}$/.test(phone)) errors.push("Phone number looks invalid.");

  return { errors, data: { name, phone, message } };
}

// POST /api/enquiry — create a new enquiry from the contact form.
// Every submission also upserts a Lead (this is the main top-of-funnel
// capture point), so it shows up in the admin dashboard immediately —
// independent of whether they also ticked the separate WhatsApp opt-in
// checkbox, which is handled by POST /api/whatsapp/opt-in.
router.post("/", async (req, res) => {
  const { errors, data } = validateEnquiry(req.body || {});
  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }

  const enquiry = {
    id: randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };

  db.data.enquiries.push(enquiry);
  await db.write();

  const wantsDemo = /free demo/i.test(data.message || "");
  await upsertLead({
    visitorId: req.visitorId,
    name: data.name,
    phone: data.phone,
    source: "contact_form",
    message: data.message,
    wantsDemo,
    tags: req.body?.tags,
  });

  return res.status(201).json({ ok: true, enquiry });
});

// GET /api/enquiry — list all enquiries. Now admin-key gated (it used to be
// open, which meant anyone could read every phone number/message ever
// submitted — worth locking down alongside the new lead-tracking layer).
router.get("/", requireAdmin, async (_req, res) => {
  await db.read();
  const sorted = [...db.data.enquiries].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json({ ok: true, count: sorted.length, enquiries: sorted });
});

export default router;
