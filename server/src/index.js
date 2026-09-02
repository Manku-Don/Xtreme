import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import enquiryRouter from "./routes/enquiry.js";
import trackRouter from "./routes/track.js";
import leadsRouter from "./routes/leads.js";
import whatsappRouter from "./routes/whatsapp.js";
import { visitorCookie } from "./middleware/visitor.js";
import { startAutomationScheduler } from "./services/automation.js";

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.set("trust proxy", 1);

// helmet() adds standard security headers (X-Content-Type-Options,
// HSTS in prod, etc). CSP is left off here since this is a JSON API, not an
// HTML-serving app.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(visitorCookie);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "xtreme-fitness-gym-server", time: new Date().toISOString() });
});

// Generic protection against form-spam and scraping on the public,
// user-facing routes. The WhatsApp webhook (Meta -> us) is deliberately not
// rate-limited here — Meta retries on non-2xx and a strict limit could
// cause dropped inbound messages.
const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false });
app.use("/api/enquiry", publicLimiter);
app.use("/api/track", publicLimiter);

app.use("/api/enquiry", enquiryRouter);
app.use("/api/track", trackRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/whatsapp", whatsappRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: "Something went wrong on our end." });
});

app.listen(PORT, () => {
  console.log(`Xtreme Fitness Gym API running on http://localhost:${PORT}`);
  console.log(`Allowing requests from: ${ALLOWED_ORIGIN}`);
  startAutomationScheduler();
});
