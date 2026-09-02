import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, CheckCircle2 } from "lucide-react";
import { FREE_DEMO } from "../data/siteData";
import { submitWhatsappOptIn, trackEvent } from "../utils/tracking";

const SESSION_FLAG = "xfg_exit_intent_shown";
// Skip the modal on pages where it'd interrupt someone already mid-task.
const EXCLUDED_PATHS = ["/contact"];

export default function ExitIntentModal({ path }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");
  const armedRef = useRef(false);

  useEffect(() => {
    if (EXCLUDED_PATHS.includes(path)) return;
    if (sessionStorage.getItem(SESSION_FLAG)) return;

    // Give the page a few seconds before arming — an exit-intent that can
    // fire the instant someone lands is just an ambush, not a signal.
    const armTimer = setTimeout(() => {
      armedRef.current = true;
    }, 6000);

    const showOnce = () => {
      if (!armedRef.current || sessionStorage.getItem(SESSION_FLAG)) return;
      sessionStorage.setItem(SESSION_FLAG, "1");
      setOpen(true);
      trackEvent("exit_intent_shown");
    };

    // Desktop: cursor leaving toward the top of the viewport.
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) showOnce();
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    // Mobile has no mouse-leave signal — fall back to a longer dwell timer,
    // so it's still a "you've been reading a while" prompt, not a popup war.
    const isTouchDevice = "ontouchstart" in window;
    const mobileTimer = isTouchDevice ? setTimeout(showOnce, 45000) : null;

    return () => {
      clearTimeout(armTimer);
      if (mobileTimer) clearTimeout(mobileTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [path]);

  const close = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const ok = await submitWhatsappOptIn({
      phone,
      source: "exit_intent",
      wantsDemo: true,
      message: "Requested free demo details via exit-intent popup",
    });
    if (ok) {
      setStatus("success");
      trackEvent("exit_intent_submitted");
    } else {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md border border-line-strong bg-panel p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 text-steel-dim transition-colors hover:text-chalk"
            >
              <X size={20} />
            </button>

            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 size={36} className="text-plate-yellow" />
                <h3 className="text-display text-xl">You're on the list.</h3>
                <p className="text-sm text-steel">
                  We'll message you on WhatsApp with your {FREE_DEMO.short.toLowerCase()} details shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-1 flex items-center gap-2 text-plate-red">
                  <Flame size={18} strokeWidth={2.5} />
                  <span className="text-stencil text-xs font-bold tracking-[0.12em]">
                    BEFORE YOU GO
                  </span>
                </div>
                <h3 className="text-display text-2xl leading-tight">
                  Grab your {FREE_DEMO.short.toLowerCase()}.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">
                  Drop your number and we'll send the details straight to WhatsApp — no
                  card, no commitment, just a full session on the floor.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="w-full border border-line-strong bg-panel-2 px-4 py-3.5 text-chalk placeholder:text-steel-dim outline-none transition-colors focus:border-plate-red focus:ring-1 focus:ring-plate-red/30"
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={status === "loading"}
                    className="text-stencil bg-plate-red px-6 py-3.5 text-sm font-bold tracking-[0.1em] text-chalk transition-colors hover:bg-plate-red-dim disabled:opacity-60"
                  >
                    {status === "loading" ? "Sending..." : "Send My Demo Details"}
                  </motion.button>
                  <p className="text-center text-[0.7rem] leading-relaxed text-steel-dim">
                    By submitting, you agree to receive your demo details and a couple of
                    follow-up messages on WhatsApp. Reply STOP anytime to opt out.
                  </p>
                  {status === "error" && (
                    <p className="text-center text-xs text-plate-red">
                      Couldn't send that — try the WhatsApp button in the corner instead.
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
