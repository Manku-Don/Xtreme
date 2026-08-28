import { Dumbbell } from "lucide-react";
import Reveal from "./Reveal";
import { handleSpotlightMove } from "../utils/spotlight";

export default function TrainerCard({ name, title, focus, index }) {
  const initial = name?.trim()?.charAt(0) || "X";
  return (
    <Reveal
      delay={index * 0.1}
      onMouseMove={handleSpotlightMove}
      className="card-spotlight group overflow-hidden border border-line bg-panel transition-colors hover:border-plate-red/50"
    >
      <div className="knurl-texture relative flex h-56 items-center justify-center overflow-hidden bg-panel-2">
        <span
          aria-hidden="true"
          className="text-display pointer-events-none absolute select-none text-[7.5rem] leading-none text-chalk/[0.06] transition-colors duration-500 group-hover:text-plate-red/10"
        >
          {initial}
        </span>
        <Dumbbell
          size={44}
          strokeWidth={1.2}
          className="relative text-steel-dim transition-colors duration-300 group-hover:text-plate-red"
        />
      </div>
      <div className="p-6">
        <span className="text-stencil text-xs font-bold text-plate-yellow">{title}</span>
        <h3 className="text-display mt-1 text-2xl text-chalk">{name}</h3>
        <p className="mt-2 text-sm text-steel">Focus: {focus}</p>
      </div>
    </Reveal>
  );
}
