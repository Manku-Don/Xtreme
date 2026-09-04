// Small, server-side mirror of the gym facts client/src/data/siteData.js
// needs for message copy (WhatsApp templates, welcome text). Kept separate
// rather than importing across the client/server boundary — these two
// packages are deployed independently.
export const GYM = {
  name: "Xtreme Fitness Gym",
  hours: "5:00 AM – 10:00 PM",
  days: "Monday – Saturday",
  freeDemoShort: "1-Day Free Demo",
  // Real coordinates for B-4, Pankha Rd, Raghu Nagar, Dabri, New Delhi —
  // mirrors client/src/data/siteData.js GYM.address.coordinates. Used as a
  // safe fallback so proximity features (NearbyBanner, homepage "closer
  // than you think" tagging) don't silently break with NaN distances if
  // GYM_LAT/GYM_LNG aren't set in the environment. Override via env vars
  // if the gym ever relocates.
  lat: 28.6112664,
  lng: 77.0908111,
};
