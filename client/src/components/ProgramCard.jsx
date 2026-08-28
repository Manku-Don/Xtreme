import { Check } from "lucide-react";
import Reveal from "./Reveal";

export default function ProgramCard({ id, name, summary, points, image, index }) {
  return (
    <Reveal
      delay={index * 0.1}
      // Replaced the spotlight with a premium 3D lift and glowing box-shadow
      className="group flex flex-col overflow-hidden border border-line bg-panel transition-all duration-500 hover:-translate-y-1.5 hover:border-plate-red/40 hover:shadow-[0_10px_40px_-10px_rgba(204,51,0,0.3)]"
    >
      <div className="relative h-56 overflow-hidden bg-ink/50">
        <img
          src={image}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            id === "personal-training" ? "object-top" : "object-center"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        
        {/* Subtle red overlay that fades in over the image on hover */}
        <div className="absolute inset-0 bg-plate-red/0 transition-colors duration-500 group-hover:bg-plate-red/10" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-display text-2xl text-chalk transition-colors duration-500 group-hover:text-plate-red">
          {name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">{summary}</p>
        <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-chalk-dim">
              <Check size={16} className="mt-0.5 shrink-0 text-plate-yellow transition-transform duration-300 group-hover:scale-110" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}