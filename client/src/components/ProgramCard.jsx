import { Check } from "lucide-react";
import Reveal from "./Reveal";

export default function ProgramCard({ id, name, summary, points, image, index }) {
  return (
    <Reveal
      delay={index * 0.1}
      className="group flex flex-col overflow-hidden border border-line bg-panel transition-all duration-[600ms] ease-out hover:-translate-y-1 hover:border-plate-red/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]"
    >
      {/* 
        FIXED: Changed bg-ink to bg-panel and added transform-gpu. 
        If the browser's anti-aliasing creates a sub-pixel gap during the zoom, 
        it will now perfectly match the text box below it, making it invisible. 
      */}
      <div className="relative h-56 w-full overflow-hidden bg-panel transform-gpu">
        <img
          src={image}
          alt=""
          loading="lazy"
          // Added will-change-transform and block to force clean hardware rendering and remove baseline gaps
          className={`block h-full w-full object-cover will-change-transform transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05] ${
            id === "personal-training" ? "object-top" : "object-center"
          }`}
        />
        {/* The smooth gradient fade overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-ink/20 to-transparent opacity-90" />
        
        {id === "personal-training" && (
          <span className="absolute right-4 top-4 border border-line-strong bg-ink/80 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-plate-yellow shadow-lg backdrop-blur-md">
            Limited Slots
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col bg-panel p-7">
        {/* The razor-thin glowing red line */}
        <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-plate-red/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        
        <h3 className="text-display text-2xl text-chalk transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-white">
          {name}
        </h3>
        
        <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">{summary}</p>
        
        <ul className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-chalk-dim transition-colors duration-500 group-hover:text-chalk">
              <Check 
                size={16} 
                className="mt-0.5 shrink-0 text-plate-yellow opacity-60 transition-opacity duration-500 group-hover:opacity-100" 
                strokeWidth={2.5}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}