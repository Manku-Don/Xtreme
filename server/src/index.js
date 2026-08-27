import "dotenv/config";
import express from "express";
import cors from "cors";
import enquiryRouter from "./routes/enquiry.js";

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "xtreme-fitness-gym-server", time: new Date().toISOString() });
});

app.use("/api/enquiry", enquiryRouter);

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
});
