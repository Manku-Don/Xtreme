import { motion } from "framer-motion";

// Pseudo-random generation so it stays consistent on re-renders (no hydration errors)
const PARTICLES = Array.from({ length: 35 }).map((_, i) => {
  // Use prime numbers to create organic, non-repeating chaos
  const sizeBase = 1 + ((i * 17) % 4);
  const isForeground = i % 5 === 0; // 1 in 5 particles are massive and out of focus
  
  return {
    id: i,
    left: `${(i * 23) % 100}%`,
    // Foreground particles are huge, background are tiny
    size: isForeground ? sizeBase * 3 : sizeBase,
    // Heavy blur on foreground to create 3D camera depth
    blur: isForeground ? 4 : (i % 3 === 0 ? 1 : 0),
    // Slower, lazier movement (15 to 35 seconds)
    duration: 15 + ((i * 11) % 20),
    // Negative delay means the animation fast-forwards, so the screen is already full on load
    delay: -((i * 13) % 30),
    // Horizontal sway (drift left and right)
    xDrift: ((i * 7) % 50) - 25,
    // Max opacity depends on depth
    maxOpacity: isForeground ? 0.15 : 0.4 + ((i % 5) * 0.1),
  };
});

export default function ChalkDust({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-chalk"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            filter: `blur(${p.blur}px)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(255, 255, 255, 0.4)`,
          }}
          animate={{
            // Rise far past the top of the container
            top: ["110%", "-20%"],
            // Gentle side-to-side sway
            x: [0, p.xDrift, -p.xDrift, 0],
            // Fade in smoothly, peak, fade out smoothly
            opacity: [0, p.maxOpacity, 0],
          }}
          transition={{
            // Y-axis uses linear so it rises at a constant speed
            top: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
            // X-axis and Opacity use easeInOut for organic swaying/fading
            x: { duration: p.duration * 0.7, repeat: Infinity, ease: "easeInOut", delay: p.delay },
            opacity: { duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay },
          }}
        />
      ))}
    </div>
  );
}