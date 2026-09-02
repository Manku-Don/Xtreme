// Very small gate for the admin/CRM endpoints: the gym owner's dashboard
// sends the key back as `x-admin-key`. This is intentionally simple (no
// user accounts, no sessions) since there's a single owner-operator — but
// it does mean ADMIN_API_KEY in .env must be changed from the example
// value before this ever goes on a public server.
export function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_API_KEY;
  const provided = req.get("x-admin-key");

  if (!expected || expected === "change-me-before-deploy") {
    return res.status(503).json({
      ok: false,
      error: "Admin access isn't configured yet — set ADMIN_API_KEY in server/.env.",
    });
  }
  if (provided !== expected) {
    return res.status(401).json({ ok: false, error: "Invalid or missing admin key." });
  }
  next();
}
