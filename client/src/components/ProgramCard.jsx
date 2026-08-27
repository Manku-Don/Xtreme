import { Check } from "lucide-react";
import Reveal from "./Reveal";

// Added 'id' to the props we are destructuring
export default function ProgramCard({ id, name, summary, points, image, index }) {
  return (
    <Reveal delay={index * 0.1} className="group flex flex-col overflow-hidden border border-line bg-panel">
      <div className="relative h-56 overflow-hidden bg-ink/50">
        <img
          src={image}
          alt=""
          loading="lazy"
          // Conditionally apply object-top only if it's the personal training card
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            id === "personal-training" ? "object-top" : "object-center"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-display text-2xl text-chalk">{name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">{summary}</p>
        <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-chalk-dim">
              <Check size={16} className="mt-0.5 shrink-0 text-plate-yellow" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}