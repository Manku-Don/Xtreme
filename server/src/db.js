import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSONFilePreset } from "lowdb/node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dbFile = path.join(dataDir, "db.json");

// Fresh clones don't have server/data/ yet (it's gitignored, since it's
// runtime data) — lowdb's atomic writer needs the directory to already
// exist, so create it up front instead of failing on the first write.
fs.mkdirSync(dataDir, { recursive: true });

// `enquiries` is the original collection (Contact form submissions).
// Everything else backs the lead-tracking / marketing-automation layer:
//   visitors      - anonymous cookie-tracked sessions, pre-identification
//   leads         - named/phoned people, the CRM record automation acts on
//   events        - raw interaction log (page views, clicks, geo pings...)
//   campaignQueue - scheduled WhatsApp follow-ups (see services/automation.js)
//   whatsappLog   - every outbound/inbound WhatsApp message, for audit + the
//                   webhook's "did we already message this person" checks
const defaultData = {
  enquiries: [],
  visitors: {},
  leads: [],
  events: [],
  campaignQueue: [],
  whatsappLog: [],
};

export const db = await JSONFilePreset(dbFile, defaultData);

// Older copies of db.json (from before the marketing-automation layer was
// added) only have `enquiries`. Backfill any missing collections in place
// rather than requiring people to delete their data file.
let needsWrite = false;
for (const [key, value] of Object.entries(defaultData)) {
  if (!(key in db.data)) {
    db.data[key] = value;
    needsWrite = true;
  }
}
if (needsWrite) await db.write();
