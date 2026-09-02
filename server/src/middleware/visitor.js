import { randomUUID } from "node:crypto";

const COOKIE_NAME = "xfg_vid";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Assigns every browser a long-lived, anonymous visitor id (no personal data
// in the cookie itself — just a random UUID). This is what lets us stitch
// "viewed pricing 3 times over a week" into one story before we ever know
// someone's name, and what a lead record gets linked back to once they do
// hand over their phone number. Purely functional/analytics use, not
// third-party ad tracking — worth saying so in a cookie-consent banner.
export function visitorCookie(req, res, next) {
  let vid = req.cookies?.[COOKIE_NAME];
  if (!vid) {
    vid = randomUUID();
    res.cookie(COOKIE_NAME, vid, {
      maxAge: ONE_YEAR_MS,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  req.visitorId = vid;
  next();
}
