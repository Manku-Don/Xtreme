import { Dumbbell } from "lucide-react";
import Reveal from "./Reveal";

export default function TrainerCard({ name, title, focus, index }) {
  return (
    <Reveal delay={index * 0.1} className="group border border-line bg-panel">
      <div className="knurl-texture flex h-56 items-center justify-center bg-panel-2">
        <Dumbbell size={48} strokeWidth={1.2} className="text-steel-dim transition-colors group-hover:text-plate-red" />
      </div>
      <div className="p-6">
        <span className="text-stencil text-xs font-bold text-plate-yellow">{title}</span>
        <h3 className="text-display mt-1 text-2xl text-chalk">{name}</h3>
        <p className="mt-2 text-sm text-steel">Focus: {focus}</p>
      </div>
    </Reveal>
  );
}
