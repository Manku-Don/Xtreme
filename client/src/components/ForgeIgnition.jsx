import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgeIgnition({ onComplete, fast = false }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (fast) {
      onComplete?.();
      return;
    }

    // Phase 1: Hold the black screen for 1.4 seconds while the logo does its power-on effect
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 1400);

    // Phase 2: Fade out completes at 2.4 seconds, telling the Home page to unlock scrolling
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2400);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [fast, onComplete]);

  if (fast || typeof document === 'undefined') return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          role="presentation"
          // z-[60] perfectly covers the Navbar (which is z-[50])
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050505] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Deep, pulsing arena glow that slowly breathes behind the logo */}
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,40,40,0.15)_0%,transparent_60%)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}