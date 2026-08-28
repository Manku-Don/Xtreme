import { Dumbbell, Snowflake, UserCheck, IndianRupee } from "lucide-react";
import Reveal from "./Reveal";

const ICONS = { Dumbbell, Snowflake, UserCheck, IndianRupee };

export default function WhyUsCard({ icon, title, body, index }) {
  const Icon = ICONS[icon] || Dumbbell;
  
  return (
    <Reveal
      delay={index * 0.08}
      // Removed spotlight script. Added smooth transition, hover z-index, and a deep ambient glow
      className="group relative flex h-full flex-col border border-line bg-panel p-7 transition-all duration-500 hover:z-10 hover:border-plate-red/40 hover:bg-ink hover:shadow-[0_0_40px_rgba(204,51,0,0.25)]"
    >
      {/* Icon box scales up and glows on hover */}
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-sm bg-panel-2 text-plate-red transition-all duration-500 group-hover:scale-110 group-hover:bg-plate-red group-hover:text-chalk group-hover:shadow-[0_0_15px_rgba(204,51,0,0.4)]">
        <Icon size={20} strokeWidth={2} />
      </div>
      
      {/* Heading smoothly transitions to red to match the aesthetic */}
      <h3 className="text-display max-w-[85%] text-2xl leading-tight text-chalk transition-colors duration-500 group-hover:text-plate-red">
        {title}
      </h3>
      
      <p className="mt-3 text-sm leading-relaxed text-steel">
        {body}
      </p>
    </Reveal>
  );
}