import { Router } from "express";
import { randomUUID } from "node:crypto";
import { db } from "../db.js";

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

// POST /api/enquiry — create a new enquiry from the contact form
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

  return res.status(201).json({ ok: true, enquiry });
});

// GET /api/enquiry — list all enquiries (simple admin view; no auth yet)
router.get("/", async (_req, res) => {
  await db.read();
  const sorted = [...db.data.enquiries].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json({ ok: true, count: sorted.length, enquiries: sorted });
});

export default router;
