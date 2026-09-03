import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Send, CheckCircle2 } from "lucide-react";
import { GYM } from "../data/siteData";
import { checkProximity, submitWhatsappOptIn, trackEvent } from "../utils/tracking";

// Entirely user-initiated: nothing here runs until the visitor presses the
// button, which is what triggers both the browser's own location-permission
// prompt AND the consent flag sent to the server (see utils/tracking.js).
// No location is requested or stored passively on page load.
export default function NearbyBanner() {
  const [state, setState] = useState("idle"); // idle | checking | near | far | denied
  const [distanceKm, setDistanceKm] = useState(null);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  // Dynamic formatter: shows meters if under 1km, otherwise 1 decimal place max
  const formatDistance = (km) => {
    if (!km) return "";
    if (km < 1) {
      return `${Math.round(km * 1000)} meters`;
    }
    // Number() automatically drops trailing zeros (e.g., 5.0 becomes 5, 5.12 becomes 5.1)
    return `${Number(km.toFixed(1))} km`;
  };

  const formattedDistance = formatDistance(distanceKm);

  const handleCheck = () => {
    if (!navigator.geolocation) {
      setState("denied");
      return;
    }
    setState("checking");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const result = await checkProximity(pos.coords.latitude, pos.coords.longitude);
        if (!result) {
          setState("denied");
          return;
        }
        setDistanceKm(result.distanceKm);
        setState(result.near ? "near" : "far");
      },
      () => setState("denied"),
      { timeout: 8000 }
    );
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const ok = await submitWhatsappOptIn({
      phone,
      source: "nearby_banner",
      wantsDemo: true,
      message: `Nearby visitor (${formattedDistance}) requested directions/demo info`,
    });
    if (ok) {
      setSent(true);
      trackEvent("nearby_optin_submitted", { distanceKm });
    }
  };

  if (state === "idle") {
    return (
      <button
        onClick={handleCheck}
        className="text-stencil group inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 text-xs font-bold tracking-[0.1em] text-chalk-dim transition-colors hover:border-plate-yellow hover:text-chalk"
      >
        <MapPin size={14} className="text-plate-yellow" />
        How Close Am I?
      </button>
    );
  }

  if (state === "checking") {
    return <p className="text-sm text-steel-dim">Checking your distance…</p>;
  }

  if (state === "denied") {
    return (
      <p className="text-sm text-steel-dim">
        Couldn't get your location — you can still find us via the map below.
      </p>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-line-strong bg-panel p-5"
      >
        {state === "near" && !sent && (
          <>
            <p className="flex items-center gap-2 text-sm font-semibold text-chalk">
              <MapPin size={16} className="text-plate-yellow" />
              You're only {formattedDistance} away — closer than you thought.
            </p>
            <p className="mt-1.5 text-sm text-steel">
              Swing by any open hour ({GYM.hours}, {GYM.days}), or get the address and free
              demo details sent straight to WhatsApp:
            </p>
            <form onSubmit={handleSend} className="mt-3 flex flex-col gap-2.5 sm:flex-row">
              <input
                type="tel"
                inputMode="numeric"
                required
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                className="flex-1 border border-line-strong bg-panel-2 px-4 py-2.5 text-sm text-chalk placeholder:text-steel-dim outline-none focus:border-plate-red focus:ring-1 focus:ring-plate-red/30"
              />
              <button
                type="submit"
                className="text-stencil flex items-center justify-center gap-2 bg-plate-red px-4 py-2.5 text-xs font-bold tracking-[0.1em] text-chalk transition-colors hover:bg-plate-red-dim"
              >
                Text Me <Send size={14} />
              </button>
            </form>
            <p className="mt-2 text-[0.7rem] text-steel-dim">
              By submitting, you agree to receive this on WhatsApp. Reply STOP anytime.
            </p>
          </>
        )}
        {state === "near" && sent && (
          <p className="flex items-center gap-2 text-sm text-plate-yellow">
            <CheckCircle2 size={16} /> Sent — check WhatsApp shortly.
          </p>
        )}
        {state === "far" && (
          <p className="flex items-center gap-2 text-sm text-steel">
            <MapPin size={16} className="text-steel-dim" />
            You're {formattedDistance} away — still an easy trip on the days you train.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}