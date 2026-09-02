import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { getCookieConsent, setCookieConsent } from "../utils/tracking";

// Sits above everything else — a real choice, not a pre-ticked formality.
// "Essential only" genuinely disables the analytics/interest-tracking calls
// (see utils/tracking.js), it isn't just cosmetic.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
  }, []);

  const choose = (value) => {
    setCookieConsent(value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[95] border-t border-line-strong bg-ink/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex gap-3">
              <Cookie size={20} className="mt-0.5 shrink-0 text-plate-yellow" />
              <p className="text-sm leading-relaxed text-chalk-dim">
                We use third-party cookies to personalize your experience. By clicking "Accept", you consent to our use of cookies and our "Terms of Service". 
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => choose("essential-only")}
                className="text-stencil border border-line-strong px-4 py-2.5 text-xs font-bold tracking-[0.1em] text-chalk-dim transition-colors hover:border-chalk hover:text-chalk"
              >
                Essential Only
              </button>
              <button
                onClick={() => choose("accepted")}
                className="text-stencil bg-plate-red px-4 py-2.5 text-xs font-bold tracking-[0.1em] text-chalk transition-colors hover:bg-plate-red-dim"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
