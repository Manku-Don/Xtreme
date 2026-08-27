import { motion } from "framer-motion";

// Dimensions for 25kg (Red), 15kg (Yellow), 10kg (Chalk), 5kg (Steel)
const PLATE_DEF = [
  { height: 96, width: 22, color: "var(--color-plate-red)" },
  { height: 78, width: 18, color: "var(--color-plate-yellow)" },
  { height: 60, width: 14, color: "var(--color-chalk-dim)" },
  { height: 46, width: 10, color: "var(--color-steel)" },
];

export default function PlateStack({ plates = 1, className = "" }) {
  const count = Math.min(plates, PLATE_DEF.length);

  // Generates precise X coordinates so plates stack perfectly against the collars
  const generateDiscs = (direction) => {
    const discs = [];
    let currentX = direction === "left" ? 85 : 215; // Starting points at the collars

    for (let i = 0; i < count; i++) {
      const p = PLATE_DEF[i];
      let x;
      if (direction === "left") {
        x = currentX - p.width;
        currentX = x - 1; // 1px gap between plates
      } else {
        x = currentX;
        currentX = x + p.width + 1;
      }
      discs.push({ ...p, x, key: `${direction}-${i}`, index: i });
    }
    return discs;
  };

  const leftDiscs = generateDiscs("left");
  const rightDiscs = generateDiscs("right");

  return (
    <svg viewBox="0 0 300 130" className={className} aria-hidden="true">
      {/* --- DEFINITIONS FOR 3D SHADING & TEXTURES --- */}
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
        </filter>

        <linearGradient id="metal-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#737373" />
          <stop offset="25%" stopColor="#e5e5e5" />
          <stop offset="50%" stopColor="#a3a3a3" />
          <stop offset="85%" stopColor="#262626" />
          <stop offset="100%" stopColor="#0f0f0f" />
        </linearGradient>

        <linearGradient id="metal-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#525252" />
          <stop offset="20%" stopColor="#9ca3af" />
          <stop offset="50%" stopColor="#374151" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>

        <linearGradient id="plate-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="15%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="85%" stopColor="#000000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.7" />
        </linearGradient>

        {/* Crosshatch pattern to simulate barbell knurling */}
        <pattern id="knurl" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="2" height="4" fill="#000" opacity="0.3" />
          <rect width="4" height="2" fill="#000" opacity="0.3" />
        </pattern>
      </defs>

      {/* --- BARBELL HARDWARE --- */}
      <motion.g
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: "150px 65px" }}
      >
        {/* Sleeves (The outer rods where plates go) */}
        <rect x="15" y="58" width="70" height="14" fill="url(#metal-bar)" rx="1" />
        <rect x="215" y="58" width="70" height="14" fill="url(#metal-bar)" rx="1" />
        
        {/* Sleeve fine details (End caps and rings) */}
        <rect x="15" y="58" width="3" height="14" fill="#000" opacity="0.3" />
        <rect x="282" y="58" width="3" height="14" fill="#000" opacity="0.3" />

        {/* Collars (The stoppers before the shaft) */}
        <rect x="85" y="53" width="10" height="24" fill="url(#metal-bar)" rx="1.5" />
        <rect x="205" y="53" width="10" height="24" fill="url(#metal-bar)" rx="1.5" />

        {/* Center Shaft */}
        <rect x="95" y="61" width="110" height="8" fill="url(#metal-bar)" />

        {/* Knurling Grips */}
        {/* Left Grip */}
        <rect x="100" y="61" width="30" height="8" fill="url(#metal-dark)" />
        <rect x="100" y="61" width="30" height="8" fill="url(#knurl)" />
        {/* Center Knurl (Powerlifting standard) */}
        <rect x="142" y="61" width="16" height="8" fill="url(#metal-dark)" />
        <rect x="142" y="61" width="16" height="8" fill="url(#knurl)" />
        {/* Right Grip */}
        <rect x="170" y="61" width="30" height="8" fill="url(#metal-dark)" />
        <rect x="170" y="61" width="30" height="8" fill="url(#knurl)" />
      </motion.g>

      {/* --- COMPETITION PLATES --- */}
      {[...leftDiscs, ...rightDiscs].map((p) => (
        <motion.g
          key={p.key}
          initial={{ scaleY: 0.2, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 + p.index * 0.1, type: "spring", bounce: 0.4 }}
          style={{ transformOrigin: `${p.x + p.width / 2}px 65px` }}
        >
          {/* Main Rubber Body w/ Drop Shadow */}
          <rect x={p.x} y={65 - p.height / 2} width={p.width} height={p.height} rx="3" fill={p.color} filter="url(#shadow)" />
          
          {/* Studio Lighting Shine Overlay */}
          <rect x={p.x} y={65 - p.height / 2} width={p.width} height={p.height} rx="3" fill="url(#plate-shine)" />

          {/* Chamfered Edge Highlight */}
          <rect x={p.x} y={65 - p.height / 2} width={p.width} height={p.height} rx="3" fill="transparent" stroke="#fff" strokeOpacity="0.2" strokeWidth="0.5" />

          {/* Inner Groove (Creates the raised lip effect seen on real bumpers) */}
          <rect x={p.x + 3} y={65 - p.height / 2 + 6} width={p.width - 6} height={p.height - 12} rx="1" fill="#000" opacity="0.15" />

          {/* Central Steel Hub */}
          <rect x={p.x} y={53} width={p.width} height={24} fill="url(#metal-bar)" />
          <rect x={p.x} y={53} width={p.width} height={24} fill="#000" opacity="0.15" />

          {/* Deep Hole (Where the sleeve passes through) */}
          <rect x={p.x} y={58} width={p.width} height={14} fill="#0a0a0a" />
          <rect x={p.x} y={58} width={p.width} height={2} fill="#000" opacity="0.5" />
        </motion.g>
      ))}
    </svg>
  );
}