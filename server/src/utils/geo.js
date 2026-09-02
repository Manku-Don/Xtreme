// Haversine great-circle distance between two lat/lng points, in kilometres.
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius, km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Coarse, IP-based location — no permission prompt needed (unlike the GPS
// flow in NearbyBanner.jsx), so this runs passively on every visit and is
// what lets *every* visitor get tagged with an approximate service area,
// not just the ones who click "how close am I". Resolution is city/ISP-block
// level (a few to ~50km), nowhere near GPS precision — good enough to
// separate "probably a real local prospect" from "random web traffic", not
// good enough to claim someone is N km away. Uses geoip-lite's bundled
// offline database: the visitor's IP is never sent to a third party.
import geoip from "geoip-lite";

const SERVICE_AREA_RADIUS_KM = Number(process.env.SERVICE_AREA_RADIUS_KM) || 40;

export function resolveCoarseLocation(ip, gymLat, gymLng) {
  if (!ip) return null;
  // IPv4-mapped IPv6 (::ffff:1.2.3.4) trips up geoip-lite's lookup table.
  const clean = ip.replace(/^::ffff:/, "");
  const hit = geoip.lookup(clean);
  if (!hit || !hit.ll) return null;

  const [lat, lng] = hit.ll;
  const approxKm = distanceKm(lat, lng, gymLat, gymLng);
  return {
    city: hit.city || null,
    region: hit.region || null,
    country: hit.country || null,
    approxDistanceKm: Math.round(approxKm),
    inServiceArea: approxKm <= SERVICE_AREA_RADIUS_KM,
  };
}